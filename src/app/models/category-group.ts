import { Category } from "./category";

export interface CategoryGroup {
  id: number;
  name: string;
  categories: Array<Category>;
}
