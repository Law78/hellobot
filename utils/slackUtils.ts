import { HttpRequest } from "@azure/functions";
import { ExpressReceiver, ReceiverEvent } from "@slack/bolt";
import { parse } from "querystring";
import { createHmac } from "crypto";
import tsscmp from "tsscmp";

export const verifyRequest = (
  // signingSecret: string, // è il valore di SLACK_SIGNING_SECRET
  req: HttpRequest,
  body: any
  // signature: string | undefined, // si prende da 'x-slack-signature' nell'HEADER
  // requestTimestamp: string | undefined // si prende da 'x-slack-request-timestamp' nell'HEADER,
): void => {
  const signature = readHeader(req, "x-slack-signature");
  const requestTimestamp = readHeader(req, "x-slack-request-timestamp");
  /*   if (signature === undefined || requestTimestamp === undefined) {
    throw new Error(
      "Slack request signing verification failed. Some headers are missing."
    );
  } */
  console.log(`SIGNATURE ${signature}`);
  console.log(`Timestamp ${requestTimestamp}`);

  const ts = Number(requestTimestamp);
  if (isNaN(ts)) {
    console.log(`${ts} is NaN`);
  }

  // Divide current date to match Slack ts format
  // Subtract 5 minutes from current time
  const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 60 * 5;

  console.log(`fiveMinutesAgo = ${fiveMinutesAgo}`);

  if (ts < fiveMinutesAgo) {
    throw new Error(
      "Slack request signing verification failed. Timestamp is too old."
    );
  } else {
    console.log("Slack request signing verification accepted");
  }

  const hmac = createHmac("sha256", process.env["SLACK_SIGNING_SECRET"]);
  const [version, hash] = signature.split("=");
  hmac.update(`${version}:${ts}:${body}`);
  if (!tsscmp(hash, hmac.digest("hex"))) {
    throw new Error(
      "Slack request signing verification failed. Signature mismatch."
    );
  } else {
    console.log("Slack request signing verification is OK!");
  }
};

export function generateReceiverEvent(payload: any): ReceiverEvent {
  return {
    body: payload,
    ack: async (response): Promise<any> => {
      return {
        statusCode: 200,
        body: response ?? "",
      };
    },
  };
}

export const expressReceiver: ExpressReceiver = new ExpressReceiver({
  signingSecret: `${process.env.SLACK_SIGNING_SECRET}`,
  processBeforeResponse: true,
});

export function readHeader(request: HttpRequest, key: string): string {
  return Object.fromEntries(request.headers.entries())[key];
}

export function parseRequestBody(
  stringBody: string | null,
  contentType: string | undefined
): any | undefined {
  try {
    if (!stringBody) {
      return "";
    }

    let result: any = {};

    if (contentType && contentType === "application/json") {
      console.log("RILEVATO application/json");
      return JSON.parse(stringBody);
    }

    if (contentType === "application/x-www-form-urlencoded") {
      const parsedBody = parse(stringBody);

      if (typeof parsedBody.payload === "string") {
        return JSON.parse(parsedBody.payload);
      }

      return parsedBody;
    }

    let keyValuePairs: string[] = stringBody.split("&");
    keyValuePairs.forEach(function (pair: string): void {
      let individualKeyValuePair: string[] = pair.split("=");
      result[individualKeyValuePair[0]] = decodeURIComponent(
        individualKeyValuePair[1] || ""
      );
    });
    return JSON.parse(JSON.stringify(result));
  } catch {
    console.log("PROBLEMA CONTENT BODY");
    return "";
  }
}
