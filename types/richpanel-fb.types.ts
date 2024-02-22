import { User } from 'firebase/auth'
import { ReactNode } from 'react'

export interface IPropsWithChildren {
  children: ReactNode
}

export interface IRichPanelContext {
  connected: boolean
  setConnected: React.Dispatch<React.SetStateAction<boolean>>
  user: User | null
  pageName: string | null
  setPageName: React.Dispatch<React.SetStateAction<string | null>>
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

export interface IFBAccountData {
  accounts: Accounts
  id: string
}

export interface Accounts {
  data: AccountData[]
  paging: Paging
}

export interface AccountData {
  access_token: string
  category: string
  category_list: CategoryList[]
  name: string
  id: string
  tasks: string[]
}

export interface CategoryList {
  id: string
  name: string
}

export interface Cursors {
  before: string
  after: string
}

export interface IConversations {
  data: Conversation[]
  paging: Paging
}

export interface Conversation {
  participants: Participants
  updated_time: string
  id: string
  messages: Messages
}

export interface Participants {
  data: Participant[]
}

export interface Participant {
  name: string
  email: string
  id: string
}

export interface Messages {
  data: Message[]
  paging: Paging
}

export interface Message {
  message: string
  created_time: string
  to: To
  from: From
  attachments?: Attachments
  id: string
}

export interface To {
  data: Reciever[]
}

export interface Reciever {
  name: string
  email: string
  id: string
}

export interface From {
  name: string
  email: string
  id: string
}

export interface Attachments {
  data: Attachment[]
  paging: Paging
}

export interface Attachment {
  id: string
  mime_type: string
  name: string
  image_data: ImageData
  size?: number
}

export interface ImageData {
  width: number
  height: number
  max_width: number
  max_height: number
  url: string
  preview_url: string
  raw_gif_image?: string
  raw_webp_image?: string
  animated_gif_url?: string
  animated_gif_preview_url?: string
  animated_webp_url?: string
  animated_webp_preview_url?: string
  image_type: number
  render_as_sticker: boolean
}

export interface Paging {
  cursors: Cursors
}

export interface ReturnData {
  sender_name: string
  sender_id: string
  updated_time: string
  conversation_id: string
  messages: Message[]
}
