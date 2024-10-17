import { ReceiverEvent } from "@slack/bolt";
import {
  generateReceiverEvent,
  parseRequestBody,
  readHeader,
  verifyRequest,
} from "../utils/slackUtils";
import { getApp } from "./slack/slackApp";
import "dotenv/config";

export const handler = async (request, context) => {
  const servicename = process.env["SERVICENAME"] ?? "HelloBot";
  context.log(`Starting ${servicename}`);

  if (request.method === "GET") {
    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get("name") || (await request.text()) || "world";

    return { body: `Hello, ${name}!` };
  } else {
    const body = await request.text();
    const contentType = readHeader(request, "content-type");
    const payload: any = parseRequestBody(body, contentType);
    verifyRequest(request, body);

    if (payload && payload.challenge) {
      console.log("Challenge received");
      return {
        status: 200,
        body: JSON.stringify({ challenge: payload.challenge }),
      };
    }

    const slackApp = getApp();

    context.log("Received event from Slack");
    const slackEvent: ReceiverEvent = generateReceiverEvent(payload);
    await slackApp.processEvent(slackEvent);
    context.log("Event processed by Slack app");
  }
};
