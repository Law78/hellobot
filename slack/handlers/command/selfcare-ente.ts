/* eslint-disable @typescript-eslint/no-explicit-any */

import { AckFn, SayFn, SlashCommand } from '@slack/bolt'
import { Institution } from '../../../types/institution'
import getSelfcareEnteMessage from '../messages/selfcare-ente.message'
import { envData } from '../../../utils/validateEnv'
import hasAuthorization from '../../../utils/hasAuthorization'
import validateInput from '../../../utils/validateInput'

const selfcareEnteCommand = async ({
  command,
  ack,
  say,
}: {
  command: SlashCommand
  ack: AckFn<any>
  say: SayFn
}): Promise<void> => {
  await ack()
  const [taxCode, subunitCode] = command.text.split(' ')

  if (!(await validateInput({ taxCode }, say))) {
    return
  }
  if (!(await hasAuthorization(command.user_id, say))) {
    return
  }

  const response = await fetch(
    `${envData.INSTITUTION_URL}?taxCode=${taxCode}${
      subunitCode ? '&subunitCode=' + subunitCode : ''
    }`,
    {
      headers: {
        'Ocp-Apim-Subscription-Key': envData.OCP_APIM_SUBSCRIPTION_KEY,
      },
    },
  )
  const body = await response.json()

  if (!response.ok) {
    await say('Si è verificato un errore, riprova più tardi.')
    return
  }

  if (!body.institutions || body.institutions.length === 0) {
    await say('Ente non presente.')
    return
  }

  const institution: Institution = body.institutions[0]

  say(getSelfcareEnteMessage({ taxCode, subunitCode, institution }))
}

export default selfcareEnteCommand
