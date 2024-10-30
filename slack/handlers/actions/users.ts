import {
  AllMiddlewareArgs,
  BlockButtonAction,
  SlackActionMiddlewareArgs,
} from '@slack/bolt'
import { StringIndexed } from '@slack/bolt/dist/types/helpers'
import User from '../../../types/user'
import hasAuthorization from '../../../utils/hasAuthorization'
import { envData } from '../../../utils/validateEnv'
import getUsersMessage from '../messages/users.message'

const usersAction = async ({
  body,
  ack,
  say,
}: SlackActionMiddlewareArgs<BlockButtonAction> &
  AllMiddlewareArgs<StringIndexed>) => {
  await ack()
  if (!body.actions[0].value) {
    return
  }

  const [institutionId, productId] = body.actions[0].value.split('_')

  if (!(await hasAuthorization(body.user.id, say))) {
    return
  }

  const response = await fetch(
    `${envData.USERS_URL}/${institutionId}/users?productId=${productId}`,
    {
      headers: {
        'Ocp-Apim-Subscription-Key': envData.USERS_APIM_SUBSCRIPTION_KEY,
      },
    },
  )
  const data: Array<User> = await response.json()

  if (!response.ok) {
    await say('Si è verificato un errore, riprova più tardi.')
    return
  }

  await say(getUsersMessage(data))
}

export default usersAction
