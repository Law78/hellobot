import { SayFn } from '@slack/bolt'
import { envData } from './validateEnv'

const hasAuthorization = async (userId: string, say: SayFn) => {
  const users = envData.ENABLED_EMAILS_SECRET

  const response = await fetch(
    `${envData.SLACK_API_URL}/users.info?user=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${envData.SLACK_BOT_TOKEN}`,
      },
    }
  )
  const body = await response.json()

  if (!response.ok) {
    await say('Si è verificato un errore, riprova più tardi.')
    return false
  }

  if (!users.find((user) => user === body.user.profile.email)) {
    await say(
      "Non sei autorizzato ad utilizzare questo comando, richiedi l'accesso scrivendoci sul canale IO Service Management."
    )
    return false
  }

  return true
}

export default hasAuthorization
