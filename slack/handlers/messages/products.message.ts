import { KnownBlock } from '@slack/bolt'
import { Product } from '../../../types/product'
import getProduct from '../../../utils/getProduct'
import getProductStatusMessage from '../../../utils/getProductStatusMessage'

const getProductsMessage = (
  products: Array<Product>,
): { blocks: Array<KnownBlock> } => {
  const blocks: Array<KnownBlock> = [{ type: 'divider' }]

  products.forEach((product, index) => {
    blocks.push({
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: getProductStatusMessage(product.status),
        },
        {
          type: 'mrkdwn',
          text: `${index + 1} - *${getProduct(product.productId)}*`,
        },
      ],
    })
  })

  return { blocks }
}

export default getProductsMessage
