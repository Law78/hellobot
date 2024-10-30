import { Product } from './product'

export type Institution = {
  id: string
  description: string
  digitalAddress: string
  createdAt: string
  onboarding: Array<Product>
}
