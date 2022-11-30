export default interface Category {
  id: number
  name: string
  spent: number
  available: number
  sortOrder: number
  categoryGroupId: number

  // Client-side only
  budget: number
}
