import {
  App,
  BlockButtonAction,
  BlockExternalSelectAction,
  ExpressReceiver,
  ReceiverEvent,
} from '@slack/bolt'
import { StringIndexed } from '@slack/bolt/dist/types/helpers'
import { envData } from '../utils/validateEnv'
import selfcareEnteCommand from './handlers/command/selfcare-ente'
import productsAction from './handlers/actions/products'
import productDetailAction from './handlers/actions/product_detail'
import usersAction from './handlers/actions/users'

/* eslint-disable @typescript-eslint/no-explicit-any */
export const runSlackApp = (payload: any) => {
  const app = new App({
    token: envData.SLACK_BOT_TOKEN,
    signingSecret: envData.SLACK_SIGNING_SECRET,
    receiver: new ExpressReceiver({
      signingSecret: envData.SLACK_SIGNING_SECRET,
      processBeforeResponse: true,
    }),
  })

  const slackEvent = (payload: StringIndexed): ReceiverEvent => {
    return {
      body: payload,
      /* eslint-disable @typescript-eslint/no-explicit-any */
      ack: async (response: Response): Promise<any> => {
        return {
          statusCode: 200,
          body: response ?? '',
        }
      },
    }
  }

  app.command('/selfcare-ente', selfcareEnteCommand)
  app.action<BlockButtonAction>('products', productsAction)
  app.action<BlockExternalSelectAction>('product_detail', productDetailAction)
  app.action<BlockButtonAction>('users', usersAction)

  app.processEvent(slackEvent(payload))

  return app
}
