import { z } from 'zod'
import 'dotenv/config'

const envSchema = z.object({
  SERVICENAME: z.string(),
  SLACK_BOT_TOKEN: z.string(),
  SLACK_SIGNING_SECRET: z.string(),
  SLACK_API_URL: z.string(),
  INSTITUTION_URL: z.string(),
  USERS_URL: z.string(),
  OCP_APIM_SUBSCRIPTION_KEY: z.string(),
  USERS_APIM_SUBSCRIPTION_KEY: z.string(),
  ENABLED_EMAILS_SECRET: z
    .string()
    .transform((value) => value.split(';'))
    .transform((value) => value.map((item) => item.trim())),
})

const envParse = envSchema.safeParse({
  SERVICENAME: process.env.SERVICENAME,
  SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN,
  SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
  SLACK_API_URL: process.env.SLACK_API_URL,
  INSTITUTION_URL: process.env.INSTITUTION_URL,
  USERS_URL: process.env.USERS_URL,
  OCP_APIM_SUBSCRIPTION_KEY: process.env.OCP_APIM_SUBSCRIPTION_KEY,
  USERS_APIM_SUBSCRIPTION_KEY: process.env.USERS_APIM_SUBSCRIPTION_KEY,
  ENABLED_EMAILS_SECRET: process.env.ENABLED_EMAILS_SECRET,
})

if (!envParse.success) {
  console.error(envParse.error.issues)
  throw new Error('Error on you env configuration')
}

export const envData = envParse.data
