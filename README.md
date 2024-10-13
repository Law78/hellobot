# Azure Function

```jsx
brew tap azure/functions
brew install azure-functions-core-tools@4
func init --typescript
```

cambia il nome della cartella src/functions con il nome della funzione e cambia il main in `package.json` in qualcosa tipo `"main": "dist/**/*.js",`

Avvia con `npm start`

Vedi: https://github.com/ekzhang/bore e qui gli altri https://github.com/anderspitman/awesome-tunneling?tab=readme-ov-file

con bore posso creare un ip pubblico del mio server locale: `bore local 7071 --to bore.pub`

ti verrà assegnata una porta come: [`bore.pub:56882`](http://bore.pub:56882/api/v1/slack) e, ad esempio, una azure function sarà raggiungibile su [`http://bore.pub:56882/api/v1/slack`](http://bore.pub:56882/api/v1/slack)

la porta 7071 in questo caso è quella della mia azure function

```jsx
import { app } from "@azure/functions";

app.http("httpTrigger1", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "v1/slack",
  handler: async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get("name") || (await request.text()) || "world";

    return { body: `Hello, ${name}!` };
  },
});
```

fatta la base proviamo ad andare avanti: installo dotenv e @slack/bolt e imposto questo `.env`:

```jsx
SLACK_BOT_TOKEN = xoxb - xxxxx;
SLACK_SIGNING_SECRET = dfc5xxxxx;
APP_TOKEN = xapp - 1 - xxxxxx;

SERVICENAME = "AskMeAnything";
```

ma prima creo il file handler.ts:

```jsx
export const handler = async (request, context) => {
  context.log(`Http function processed request for url "${request.url}"`);

  const name = request.query.get("name") || (await request.text()) || "world";

  return { body: `Hello, ${name}!` };
};
```

e cambio index.ts:

```jsx
import { app } from "@azure/functions";
import { handler } from "./handler";

app.http("slackevents", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "v1/slack",
  handler: handler,
});
```

cambiamo il tsconfig.json:

```jsx
{
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "Node",
    "target": "es6",
    "outDir": "dist",
    "rootDir": ".",
    "sourceMap": true,
    "strict": false,
    "esModuleInterop": true,
    "resolveJsonModule": true
  }
}
```

Vedi:

https://gist.github.com/ClydeDz/eb06295989329d6838d64107bb6e61bd

[https://github.com/ClydeDz/netlify-functions-slack-demo/blob/main/src/functions/slackbot.ts](https://github.com/ClydeDz/netlify-functions-slack-demo/blob/main/src/functions/slackbot.ts)

https://trailhead.salesforce.com/it/content/learn/modules/slack-app-development-with-bolt/build-a-bolt-app

Quando configuro un bot slack per ricevere gli Eventi devo rispondere ad un `challenge` per cui devo prevedere di intercettare un payload che contenga questo valore e rispondere nuovamente con questo valore.

Alcuni riferimenti:

https://learn.temporal.io/tutorials/typescript/work-queue-slack-app/build/

https://dev.to/soumyadey/verifying-requests-from-slack-the-correct-method-for-nodejs-417i

https://merlinbecker.de/introducing-slacktron-building-a-low-budget-always-on-slackbot-template-with-azure-functions-and-edbc7359bd4d