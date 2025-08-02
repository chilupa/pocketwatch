'use client';

import { useState, useEffect } from 'react';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import ExpenseSummary from '@/components/ExpenseSummary';
import { Expense } from '@/types/expense';

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Load expenses from localStorage on mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  // Save expenses to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString()
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const editExpense = (updatedExpense: Expense) => {
    setExpenses(prev => prev.map(expense => 
      expense.id === updatedExpense.id ? updatedExpense : expense
    ));
    setEditingExpense(null);
  };

  const startEdit = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const cancelEdit = () => {
    setEditingExpense(null);
  };



  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            PocketWatch
          </h1>
          <p className="text-gray-600 text-lg">Smart expense tracking made simple</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ExpenseForm 
              onAddExpense={addExpense} 
              onEditExpense={editExpense}
              editingExpense={editingExpense}
              onCancelEdit={cancelEdit}
            />
            <ExpenseList 
              expenses={expenses} 
              onDeleteExpense={deleteExpense}
              onEditExpense={startEdit}
            />
          </div>
          
          <div>
            <ExpenseSummary expenses={expenses} />
          </div>
        </div>
      </div>
    </div>
  );
}