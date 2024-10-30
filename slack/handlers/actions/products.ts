import {
  AllMiddlewareArgs,
  BlockButtonAction,
  SlackActionMiddlewareArgs,
} from '@slack/bolt'
import { StringIndexed } from '@slack/bolt/dist/types/helpers'
import { Institution } from '../../../types/institution'
import hasAuthorization from '../../../utils/hasAuthorization'
import { envData } from '../../../utils/validateEnv'
import validateInput from '../../../utils/validateInput'
import getProductsMessage from '../messages/products.message'

const productsAction = async ({
  body,
  ack,
  say,
}: SlackActionMiddlewareArgs<BlockButtonAction> &
  AllMiddlewareArgs<StringIndexed>) => {
  await ack()
  if (!body || !body.actions || !body.actions[0] || !body.actions[0].value) {
    return
  }

  const [taxCode, subunitCode] = body.actions[0].value.split('_')

  if (!(await validateInput({ taxCode }, say))) {
    return
  }

  if (!(await hasAuthorization(body.user.id, say))) {
    return
  }

  const response = await fetch(
    `${envData.INSTITUTION_URL}?taxCode=${taxCode}${subunitCode && subunitCode !== 'undefined' ? '&subunitCode=' + subunitCode : ''}`,
    {
      headers: {
        'Ocp-Apim-Subscription-Key': envData.OCP_APIM_SUBSCRIPTION_KEY,
      },
    },
  )
  const data = await response.json()

  if (!response.ok) {
    await say('Si è verificato un errore, riprova più tardi.')
    return
  }
  const institution: Institution = data.institutions[0]

  await say(getProductsMessage(institution.onboarding))
}

export default productsAction
