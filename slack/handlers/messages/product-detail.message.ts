import { KnownBlock } from '@slack/bolt'
import dayjs from 'dayjs'
import { Institution } from '../../../types/institution'
import { Product } from '../../../types/product'
import getProduct from '../../../utils/getProduct'

const getProductDetailMessage = (
  institution: Institution,
  product: Product,
): { blocks: Array<KnownBlock> } => {
  return {
    blocks: [
      {
        type: 'divider',
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Prodotto*: \`${getProduct(product.productId)}\``,
          },
          {
            type: 'mrkdwn',
            text: '*Stato*: `ACTIVE`',
          },
        ],
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Codice SDI*: \`${product.billing.recipientCode}\``,
          },
          {
            type: 'mrkdwn',
            text: `*Data Creazione*: \`${dayjs(product.createdAt).format('DD-MM-YYYY')}\``,
          },
        ],
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Cod. Fiscale*: \`${product.billing.vatNumber}\``,
          },
          {
            type: 'mrkdwn',
            text: `*P.IVA*: \`${product.billing.vatNumber}\``,
          },
        ],
      },
      {
        type: 'actions',
        block_id: 'actions1',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Utenti',
              emoji: true,
            },
            value: `${institution.id}_${product.productId}`,
            action_id: 'users',
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Contratto',
              emoji: true,
            },
            value: 'contract_',
            action_id: 'contract',
          },
        ],
      },
    ],
  }
}

export default getProductDetailMessage
