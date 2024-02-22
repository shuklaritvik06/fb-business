'use client'

import React, { Fragment, useEffect, useState } from 'react'
import Image from 'next/image'
import moment from 'moment'
import ImageIcon, {
  CallIcon,
  MenuIcon,
  ProfileIcon,
  RefreshIcon,
} from '@/components/icons/app-icons'
import Loader from '@/components/common/loader'
import { fetchConversations } from '@/lib/message-utils'
import { ReturnData } from '@/types/richpanel-fb.types'

const ConversationList = ({ conversation }: { conversation: ReturnData }) => (
  <div
    className="cursor-pointer transition-all duration-200 hover:bg-secondary/70 hover:shadow-md"
    id={conversation.sender_id}
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
            <div className="flex items-center space-x-2">
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

const DashboardMain = () => {
  const [conversations, setConversations] = useState<ReturnData[] | undefined>(
    undefined
  )
  const [selectedConversation, setSelectedConversation] =
    useState<ReturnData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const page_data = localStorage.getItem('facebook_page_data')
      if (page_data) {
        const accessToken = JSON.parse(page_data).access_token
        const data = await fetchConversations(accessToken)
        setConversations(data)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
      if (error instanceof Response && error.status === 401) {
        console.warn('Unauthorized access. Removing facebook_page_data.')
        localStorage.removeItem('facebook_page_data')
        window.location.href = '/connect'
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const name = 'Ajit RJ'
  console.log(conversations)

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
                onClick={() => fetchData()}
              >
                <RefreshIcon />
              </div>
            </div>
            <div className="overflow-y-auto">
              {conversations?.length ? (
                conversations.map((conversation, index) => (
                  <ConversationList key={index} conversation={conversation} />
                ))
              ) : (
                <div className="mx-2 mt-5 text-center text-sm text-gray-500">
                  No Conversations Found 😔
                </div>
              )}
            </div>
          </div>
          {selectedConversation ? (
            <>
              <div className="relative col-span-12 w-full md:col-span-7 xl:col-span-6">
                <div className="border-b p-4">
                  <div className="text-xl font-bold tracking-wide">{name}</div>
                </div>
                <div className="h-screen overflow-y-auto bg-tertiary"></div>
                <div className="absolute bottom-24 left-0 right-0 px-4">
                  <input
                    type="text"
                    id="rp-message"
                    placeholder={`Message ${name}`}
                    className="w-full rounded border bg-white px-2 py-3 outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  />
                </div>
              </div>
              <div className="hidden h-screen border-l xl:col-span-3 xl:block">
                <div className="h-[26%] bg-white">
                  <div className="mt-8 flex flex-col items-center">
                    <div>
                      <Image
                        src="/default_user.webp"
                        width={100}
                        height={100}
                        alt="Profile Picture"
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="mt-3 text-lg font-semibold">{name}</div>
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
                    <div className="space-y-3 rounded-xl border bg-white p-5 shadow-md shadow-tertiary">
                      <div className="text-base font-semibold text-content">
                        Customer Details
                      </div>
                      <div className="mt-5 flex items-center justify-between">
                        <div className="cursor-pointer text-sm font-medium text-slate-400">
                          Email
                        </div>
                        <div className="text-sm font-medium text-content">
                          amit@richpanel.com
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="cursor-pointer text-sm font-medium text-slate-400">
                          First Name
                        </div>
                        <div className="text-sm font-medium text-content">
                          Amit
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="cursor-pointer text-sm font-medium text-slate-400">
                          Last Name
                        </div>
                        <div className="text-sm font-medium text-content">
                          RG
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
            </>
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
