import {
  AllMiddlewareArgs,
  BlockExternalSelectAction,
  SlackActionMiddlewareArgs,
} from '@slack/bolt'
import { StringIndexed } from '@slack/bolt/dist/types/helpers'
import { Institution } from '../../../types/institution'
import { envData } from '../../../utils/validateEnv'
import getProductDetailMessage from '../messages/product-detail.message'

const productDetailAction = async ({
  body,
  ack,
  say,
}: SlackActionMiddlewareArgs<BlockExternalSelectAction> &
  AllMiddlewareArgs<StringIndexed>) => {
  await ack()

  if (!body.actions[0].selected_option?.value) {
    return
  }

  const [taxCode, subunitCode, productId] =
    body.actions[0].selected_option.value.split('_')

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

  const product = institution.onboarding.find(
    (product) => product.productId === productId,
  )

  if (!product) {
    return
  }

  await say(getProductDetailMessage(institution, product))
}

export default productDetailAction
