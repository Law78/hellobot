import { SayFn } from '@slack/bolt'
import { z } from 'zod'

const validateInput = async (input: Record<string, string>, say: SayFn) => {
  const schema = z.object({
    taxCode: z
      .string({
        message: 'Il codice fiscale deve essere un codice di 11 numeri.',
      })
      .trim()
      .length(11, 'Il codice fiscale deve essere un codice di 11 numeri.')
      .regex(
        /^[0-9]*$/,
        'Il codice fiscale deve essere un codice di 11 numeri.'
      ),
  })
  const result = schema.safeParse(input)

  if (!result.success) {
    await say(result.error.issues[0].message)
    return false
  }

  return true
}

export default validateInput
