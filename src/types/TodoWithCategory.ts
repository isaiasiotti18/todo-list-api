export interface TodoWithCategory {
  id: number;
  title: string;
  description: string | null;
  endDate: Date | null;
  categoryId: number | null;
  categoryName: string | null;
  createdAt: Date;
  updatedAt: Date;
}
