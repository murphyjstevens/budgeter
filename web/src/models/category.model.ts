export default interface Category {
  id: number
  name: string
  sortOrder: number
  categoryGroupId: number

  // Client-side only
  budget: number
  available: number
  spent: number
}
