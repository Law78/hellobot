import { KnownBlock } from '@slack/bolt'
import User from '../../../types/user'

const getUsersMessage = (users: Array<User>) => {
  const blocks: Array<KnownBlock> = [{ type: 'divider' }]

  users.forEach((user) => {
    blocks.push({
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `\`${user.roles[0]}\` ${user.name} ${user.surname}`,
        },
        {
          type: 'mrkdwn',
          text: user.email.toLowerCase(),
        },
      ],
    })
  })

  return { blocks }
}

export default getUsersMessage
