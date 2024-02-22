import { FBUser, Message } from '@/types/richpanel-fb.types'
import Image, { ImageLoader, ImageLoaderProps } from 'next/image'
import React, { FC, Fragment } from 'react'

const MessagesList: FC<{
  messages: Message[]
  selectedUser: FBUser | undefined
}> = ({ messages, selectedUser }) => {
  const fbImageLoader: ImageLoader = ({ src, width }: ImageLoaderProps) => {
    return `${src}`
  }
  messages.sort((a, b) => +new Date(a.created_time) - +new Date(b.created_time))
  return (
    <Fragment>
      {messages.map(
        (message) =>
          (message.message.length !== 0 ||
            message.attachments?.data[0]?.image_data?.url) && (
            <div
              key={message.id}
              className={`flex ${
                selectedUser?.name === message.from.name
                  ? 'justify-start'
                  : 'justify-end'
              }`}
            >
              <div
                key={message.id}
                className={`mt-3 flex w-fit rounded bg-white px-2 py-1 text-content shadow-md`}
              >
                <div>
                  {message.message.length !== 0 ? (
                    message.message
                  ) : (
                    <Image
                      height={0}
                      width={0}
                      loader={fbImageLoader}
                      className="h-28 w-28"
                      alt=""
                      src={message?.attachments?.data?.[0]?.image_data?.url!}
                    />
                  )}
                </div>
              </div>
            </div>
          )
      )}
    </Fragment>
  )
}

export default MessagesList
