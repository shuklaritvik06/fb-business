import { IConversations, ReturnData } from '@/types/richpanel-fb.types'

export const fetchConversations = async (pageAccessToken: string) => {
  const data: IConversations = await fetch(
    'https://graph.facebook.com/v13.0/me/conversations?fields=participants,updated_time,id,messages{message,created_time,to,from,attachments,created_at},subject&limit=25',
    {
      headers: {
        Authorization: `Bearer ${pageAccessToken}`,
      },
    }
  ).then((res) => res.json())
  let result: ReturnData[] = []
  data.data.forEach(async (conversation) => {
    const sender_name = conversation.participants.data[0].name
    const sender_id = conversation.participants.data[0].id
    const updated_time = conversation.updated_time
    const conversation_id = conversation.id
    const messages = conversation.messages.data
    const data = {
      sender_name,
      sender_id,
      updated_time,
      conversation_id,
      messages,
    }
    result.push(data)
  })

  return result
}

export const fetchUserDetails = async (userId: string) => {}
