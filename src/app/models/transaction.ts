export interface Transaction {
  id: number;
  accountId: number;
  categoryId: number;
  date: Date;
  cost: number;
  recipient: string;
  isEditing: boolean;
}
