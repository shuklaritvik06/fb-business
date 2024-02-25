'use client'

/* eslint-disable */

import React, { Fragment, useContext, useEffect, useState } from 'react'
import Image, { ImageLoader, ImageLoaderProps } from 'next/image'
import moment from 'moment'
import ImageIcon, {
  CallIcon,
  MenuIcon,
  ProfileIcon,
  RefreshIcon,
} from '@/components/icons/app-icons'
import Loader from '@/components/common/loader'
import {
  FBUser,
  IConversations,
  Message,
  ProfilePic,
  ReturnData,
} from '@/types/richpanel-fb.types'
import { ClipLoader } from 'react-spinners'
import MessagesList from './message-list'
import { RichPanelContextValues } from '@/context/app-context'

const ConversationList = ({
  conversation,
  selectedConv,
  setSelectedConversation,
}: {
  conversation: ReturnData
  selectedConv: string | null
  setSelectedConversation: React.Dispatch<React.SetStateAction<string | null>>
}) => {
  const handleSelected = () => {
    setSelectedConversation(conversation.conversation_id)
  }

  const isSelected = selectedConv === conversation.conversation_id

  return (
    <div
      className={`cursor-pointer transition-all duration-200 hover:bg-secondary/70 hover:shadow-md ${
        isSelected ? 'bg-secondary/70' : ''
      }`}
      onClick={handleSelected}
      id={conversation.conversation_id}
    >
      <div className="border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-5">
            <input
              type="checkbox"
              className="h-4 w-4 rounded-md accent-primary"
            />
            <div className="flex flex-col">
              <div className="text-base font-semibold">
                {conversation.sender_name}
              </div>
              <div className="text-sm font-medium">Facebook DM</div>
            </div>
          </div>
          <div>{moment(conversation.updated_time).fromNow(true)}</div>
        </div>
        <div className="mt-5 flex flex-col gap-1">
          <div className="text-sm font-semibold">Awesome Product</div>
          <div className="line-clamp-1 text-[12px] font-light text-slate-700">
            {conversation.messages[0].message.length !== 0 ? (
              conversation.messages[0].message
            ) : (
              <div className="flex items-center gap-2">
                <div className="h-5 w-5">
                  <ImageIcon />
                </div>{' '}
                You have a new message
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const DashboardMain = () => {
  const { user } = useContext(RichPanelContextValues)!
  const [inputValue, setInputValue] = useState<string>('')
  const [conversations, setConversations] = useState<ReturnData[] | undefined>(
    undefined
  )
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null)

  const [messages, setMessages] = useState<Message[]>([])

  const [loading, setLoading] = useState(false)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<FBUser>()

  const fbImageLoader: ImageLoader = ({ src, width }: ImageLoaderProps) => {
    return `${src}`
  }

  const fetchData = async () => {
    try {
      setLoading(true)

      const page_data = localStorage.getItem(`facebook_page_data`)

      if (page_data) {
        const accessToken = JSON.parse(page_data).access_token

        const response = await fetch(
          'https://graph.facebook.com/v13.0/me/conversations?fields=participants,updated_time,id,messages{message,created_time,to,from,attachments,created_at},subject&limit=25',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        if (response.ok) {
          const responseData: IConversations = await response.json()
          const result = responseData.data.map((conversation) => {
            const sender = conversation.participants.data[0]
            return {
              sender_name: sender.name,
              sender_id: sender.id,
              sender_email: sender.email,
              updated_time: conversation.updated_time,
              conversation_id: conversation.id,
              messages: conversation.messages.data,
            }
          })

          setConversations(result)
        } else {
          console.error('Error fetching conversations:', response.statusText)
          if (response.status === 401) {
            console.warn('Unauthorized access. Removing facebook_page_data.')
            localStorage.removeItem(`facebook_page_data`)
            window.location.href = '/connect'
          }
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessagesAndUserData = async () => {
    setMessagesLoading(true)

    try {
      if (selectedConversation) {
        const selectedConv = conversations?.find(
          (conv) => conv.conversation_id === selectedConversation
        )

        if (selectedConv) {
          const { sender_name, sender_email, sender_id } = selectedConv
          const [first_name, last_name] = sender_name?.split(' ') || []
          const email = sender_email
          const token = JSON.parse(
            localStorage.getItem(`facebook_page_data`)!
          ).access_token

          if (token) {
            const response = await fetch(
              `https://graph.facebook.com/${sender_id}?fields=profile_pic`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )

            if (response.ok) {
              const data: ProfilePic = await response.json()
              setSelectedUser({
                email: email || '',
                first_name: first_name || '',
                last_name: last_name || '',
                picture: data.profile_pic || '',
                name: sender_name || '',
                sender_id: sender_id,
              })
            } else {
              console.error(
                `Error: ${response.status} - ${response.statusText}`
              )
            }
          }

          setMessages(selectedConv.messages || [])
        } else {
          setMessages([])
        }
      }
    } catch (error) {
      console.error('Error fetching messages and user data:', error)
    } finally {
      setMessagesLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user])

  useEffect(() => {
    fetchMessagesAndUserData()
  }, [selectedConversation, conversations])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      const newMessage = inputValue.trim()

      if (newMessage !== '') {
        const data = JSON.parse(localStorage.getItem(`facebook_page_data`)!)
        fetch(
          `https://graph.facebook.com/v13.0/me/messages?recipient={'id':'${selectedUser?.sender_id}'}&messaging_type=MESSAGE_TAG&message={'text':'${newMessage}'}&tag=HUMAN_AGENT`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${data.access_token}`,
            },
          }
        ).then(() => {
          setMessages([
            ...messages,
            {
              created_time: new Date().toISOString(),
              id: `temp-${new Date().toISOString()}`,
              message: inputValue,
              from: {
                email: `${data.id}@facebook.com`,
                id: `${data.id}`,
                name: `${data.name}`,
              },
              to: { data: [] },
            },
          ])
          setInputValue('')
        })
      }
    }
  }

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-12 overflow-hidden">
          <div className="col-span-5 hidden h-screen overflow-y-auto border-r md:block xl:col-span-3">
            <div className="flex justify-between border-b p-4">
              <div className="flex items-center space-x-4">
                <div className="cursor-pointer">
                  <MenuIcon />
                </div>
                <div className="text-xl font-bold tracking-wide">
                  Conversations
                </div>
              </div>
              <div
                className={`cursor-pointer ${loading ? 'animate-spin' : null}`}
                onClick={() => {
                  fetchData()
                  fetchMessagesAndUserData()
                }}
              >
                <RefreshIcon />
              </div>
            </div>
            <div className="overflow-y-auto">
              {conversations?.length ? (
                conversations.map((conversation, index) => (
                  <ConversationList
                    key={index}
                    conversation={conversation}
                    selectedConv={selectedConversation}
                    setSelectedConversation={setSelectedConversation}
                  />
                ))
              ) : (
                <div className="mx-2 mt-5 text-center text-sm text-gray-500">
                  No Conversations Found 😔
                </div>
              )}
            </div>
          </div>
          {selectedConversation ? (
            <Fragment>
              {messagesLoading ? (
                <div className="col-span-7 flex h-full w-full items-center justify-center">
                  <ClipLoader size={30} color="#1e4d91" />
                </div>
              ) : (
                <Fragment>
                  <div className="relative col-span-12 w-full md:col-span-7 xl:col-span-6">
                    <div className="border-b p-4">
                      <div className="text-xl font-bold tracking-wide">
                        {selectedUser ? selectedUser.name : 'Amit RJ'}
                      </div>
                    </div>
                    <div className="h-screen bg-tertiary px-2">
                      <div className="h-5/6 overflow-y-auto py-2">
                        <MessagesList
                          messages={messages}
                          selectedUser={selectedUser}
                        />
                      </div>
                    </div>
                    <div className="absolute bottom-24 left-0 right-0 px-4">
                      <input
                        type="text"
                        id="rp-message"
                        onKeyDown={handleKeyDown}
                        placeholder={`Message ${selectedUser ? selectedUser.name : 'Amit RJ'}`}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-full rounded border bg-white px-2 py-3 outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      />
                    </div>
                  </div>
                  <div className="hidden h-screen border-l xl:col-span-3 xl:block">
                    <div className="h-[26%] bg-white">
                      <div className="mt-8 flex flex-col items-center">
                        <div>
                          <Image
                            src={
                              selectedUser?.picture
                                ? selectedUser.picture
                                : '/default_user.webp'
                            }
                            loader={fbImageLoader}
                            width={0}
                            height={0}
                            alt="Profile Picture"
                            className="h-20 w-20 rounded-full object-cover"
                          />
                        </div>
                        <div className="mt-3 text-lg font-semibold">
                          {selectedUser ? selectedUser?.name : 'Amit RJ'}
                        </div>
                        <div className="mt-2 flex items-center space-x-2">
                          <div className="h-3 w-3 rounded-full bg-slate-300" />
                          <div className="cursor-pointer text-sm text-slate-600">
                            Offline
                          </div>
                        </div>
                        <div className="mt-5 flex items-center gap-4">
                          <div className="flex cursor-pointer items-center space-x-2 rounded border-2 border-secondary px-4 py-1">
                            <CallIcon />
                            <div>Call</div>
                          </div>
                          <div className="flex cursor-pointer items-center space-x-2 rounded border-2 border-secondary px-4 py-1">
                            <ProfileIcon />
                            <div>Profile</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="h-[74%] bg-quaternary">
                      <div className="px-5 py-3">
                        <div className="space-y-3 overflow-hidden rounded-xl border bg-white p-5 shadow-md shadow-tertiary">
                          <div className="text-base font-semibold text-content">
                            Customer Details
                          </div>
                          <div className="mt-5 flex items-center justify-between">
                            <div className="cursor-pointer text-sm font-medium text-slate-400">
                              Email
                            </div>
                            <div className="text-sm font-medium text-content">
                              {selectedUser
                                ? selectedUser.email
                                : 'amit@richpanel.com'}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="cursor-pointer text-sm font-medium text-slate-400">
                              First Name
                            </div>
                            <div className="text-sm font-medium text-content">
                              {selectedUser ? selectedUser.first_name : 'Amit'}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="cursor-pointer text-sm font-medium text-slate-400">
                              Last Name
                            </div>
                            <div className="text-sm font-medium text-content">
                              {selectedUser ? selectedUser.last_name : 'RJ'}
                            </div>
                          </div>
                          <div>
                            <a
                              href="/"
                              className="mt-2 cursor-pointer text-sm font-semibold text-primary"
                            >
                              View more details
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Fragment>
              )}
            </Fragment>
          ) : (
            <div className="col-span-7 flex h-full items-center justify-center text-content xl:col-span-9">
              No Chats Selected 😔
            </div>
          )}
        </div>
      )}
    </Fragment>
  )
}

export default DashboardMain
