export type Product = {
  status: string
  productId: string
  billing: {
    recipientCode: string
    vatNumber: string
  }
  createdAt: string
}
