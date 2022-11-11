import type Category from './category'

export default interface CategoryGroup {
  id: number
  name: string
  sortOrder: number

  // Client-side only
  categories: Array<Category>
  budgeted: number | null
  available: number | null
  spent: number | null
  isNameInvalid: boolean
}
