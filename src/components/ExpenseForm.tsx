'use client';

import { useState, useEffect } from 'react';
import { Expense } from '@/types/expense';

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onEditExpense?: (expense: Expense) => void;
  editingExpense?: Expense | null;
  onCancelEdit?: () => void;
}

const categories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Travel',
  'Other'
];

export default function ExpenseForm({ onAddExpense, onEditExpense, editingExpense, onCancelEdit }: ExpenseFormProps) {
  const getLocalDateString = () => {
    const today = new Date();
    return new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  };

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(getLocalDateString());

  // Populate form when editing
  useEffect(() => {
    if (editingExpense) {
      setAmount(editingExpense.amount.toString());
      setCategory(editingExpense.category);
      setDescription(editingExpense.description);
      setDate(editingExpense.date);
    } else {
      setAmount('');
      setDescription('');
      setDate(getLocalDateString());
    }
  }, [editingExpense]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    if (editingExpense && onEditExpense) {
      onEditExpense({
        ...editingExpense,
        amount: parseFloat(amount),
        category,
        description,
        date
      });
    } else {
      onAddExpense({
        amount: parseFloat(amount),
        category,
        description,
        date
      });
    }

    setAmount('');
    setDescription('');
    setDate(getLocalDateString());
  };

  const handleCancel = () => {
    setAmount('');
    setDescription('');
    setDate(getLocalDateString());
    onCancelEdit?.();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{editingExpense ? 'Edit Expense' : 'Add Expense'}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Amount</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded-md text-gray-900 font-medium"
            placeholder="0.00"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded-md text-gray-900 font-medium"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md text-gray-900 font-medium"
            placeholder="What did you spend on?"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={getLocalDateString()}
            className="w-full p-2 border rounded-md text-gray-900 font-medium"
            required
          />
        </div>
      </div>
      
      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
        >
          {editingExpense ? 'Update Expense' : 'Add Expense'}
        </button>
        {editingExpense && (
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}