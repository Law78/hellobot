import dayjs from 'dayjs'
import getProduct from '../../../utils/getProduct'
import { Institution } from '../../../types/institution'

const getSelfcareEnteMessage = ({
  taxCode,
  subunitCode,
  institution,
}: {
  taxCode: string
  subunitCode: string
  institution: Institution
}) => {
  const products = institution.onboarding

  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `📍 *${institution.description}*`,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `:email: *PEC:* ${institution.digitalAddress}`,
          },
        ],
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*ID*: \`${institution.id}\``,
          },
          {
            type: 'mrkdwn',
            text: `*Origin*: \`IPA\``,
          },
        ],
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Ragione Sociale*: \`${institution.description}\``,
          },
          {
            type: 'mrkdwn',
            text: `*Data Creazione*: \`${dayjs(institution.createdAt).format(
              'DD-MM-YYYY'
            )}\``,
          },
        ],
      },
      {
        type: 'divider',
      },
      {
        type: 'actions',
        block_id: 'actions1',
        elements: [
          {
            type: 'static_select',
            placeholder: {
              type: 'plain_text',
              text: 'Seleziona un prodotto',
            },
            action_id: 'product_detail',
            options: products
              .filter((product) => product.status === 'ACTIVE')
              .map((product) => {
                return {
                  text: {
                    type: 'plain_text',
                    text: getProduct(product.productId),
                  },
                  value: `${taxCode}_${subunitCode}_${product.productId}`,
                }
              }),
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Storico adesioni',
              emoji: true,
            },
            value: `${taxCode}_${subunitCode}`,
            action_id: 'products',
          },
        ],
      },
    ],
  }
}

export default getSelfcareEnteMessage
