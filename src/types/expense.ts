export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface ExpenseSummary {
  category: string;
  total: number;
  percentage: number;
}