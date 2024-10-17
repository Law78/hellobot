import { App, BlockAction, BlockElementAction, ButtonAction, LogLevel, ReceiverEvent } from '@slack/bolt';
import { expressReceiver } from '../../utils/slackUtils';
import { waveMessage } from './handler/message';

export const getApp = () => {
  const app = new App({
    token: process.env["SLACK_BOT_TOKEN"],
    signingSecret: process.env["SLACK_SIGNING_SECRET"],
    receiver: expressReceiver,
    logLevel: LogLevel.DEBUG,
    // appToken: process.env["APP_TOKEN"],
    // processBeforeResponse: true,
    // socketMode: true
  });

  app.message('hello', waveMessage);

  app.action('action_a', async ({ body, ack, say }) => {
    console.log('ACTION A')
    await ack();
    await say(`<@${body.user.id}> clicked the button VALID`);
  });

  app.message(':wave:', async ({ message, say }) => {
      if (
    message.subtype !== "message_deleted" &&
    message.subtype !== "message_replied" &&
    message.subtype !== "message_changed"
    ) {
      await say(`Hello, <@${message.user}>`);
    }
  });

  app.action<BlockAction<BlockElementAction>>(
    "action_b",
    async ({ack, say, body}) => {
      console.log('ACTION B')
      await ack();
      // Ensure the body.actions[0] is a ButtonAction
      const action = body.actions[0] as ButtonAction;
      if (action.value) {
        const [channelName, workId, userId] = action.value.split("_");
        const claimantId = body.user.id;
        await ack();
        await say(`<@${body.user.id}> clicked the button INVALID`);
      } else {
        console.error("Action value is undefined.");
      }
    }
  );

  app.error(async ({error}: {error: Error}) => {
    if (error instanceof Error) {
      console.error(`Error: ${error.name}, Message: ${error.message}`);
    } else {
      console.error("An unknown error occurred", error);
    }
  });

  return app;
}