export default interface Transaction {
  id: number
  accountId: number
  date: Date | string
  recipientId: number
  cost: number
  categoryId: number | null

  // Client-side only
  isEditing: boolean
}
