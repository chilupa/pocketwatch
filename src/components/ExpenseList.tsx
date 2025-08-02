'use client';

import { useState, useEffect } from 'react';
import { Expense } from '@/types/expense';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  onEditExpense: (expense: Expense) => void;
}

export default function ExpenseList({ expenses, onDeleteExpense, onEditExpense }: ExpenseListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [timePeriod, setTimePeriod] = useState('all');

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory, timePeriod, sortBy, sortOrder, itemsPerPage]);

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

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const filteredAndSortedExpenses = expenses
    .filter(expense => {
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           expense.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
      
      // Time period filter
      let matchesTime = true;
      if (timePeriod !== 'all') {
        const expenseDate = new Date(expense.date + 'T00:00:00');
        if (timePeriod === 'month') {
          matchesTime = expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
        } else if (timePeriod === 'year') {
          matchesTime = expenseDate.getFullYear() === currentYear;
        } else if (timePeriod === 'week') {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          matchesTime = expenseDate >= weekAgo;
        }
      }
      
      return matchesSearch && matchesCategory && matchesTime;
    })
    .sort((a, b) => {
      let result = 0;
      switch (sortBy) {
        case 'date':
          result = new Date(a.date + 'T00:00:00').getTime() - new Date(b.date + 'T00:00:00').getTime();
          break;
        case 'amount':
          result = a.amount - b.amount;
          break;
        case 'category':
          result = a.category.localeCompare(b.category);
          break;
      }
      return sortOrder === 'desc' ? -result : result;
    });

  if (expenses.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Expenses</h2>
        <p className="text-gray-500">No expenses recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Expenses</h2>
      
      {/* Search, Filter, and Sort */}
      <div className="mb-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 border rounded-md text-sm text-gray-900 font-medium"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-2 border rounded-md text-sm text-gray-900 font-medium"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="p-2 border rounded-md text-sm text-gray-900 font-medium"
          >
            <option value="all">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 border rounded-md text-sm text-gray-900 font-medium"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="category">Category</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="p-2 border rounded-md text-sm text-gray-900 font-medium"
            >
              {sortBy === 'date' && (
                <>
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </>
              )}
              {sortBy === 'amount' && (
                <>
                  <option value="desc">Highest First</option>
                  <option value="asc">Lowest First</option>
                </>
              )}
              {sortBy === 'category' && (
                <>
                  <option value="desc">Z to A</option>
                  <option value="asc">A to Z</option>
                </>
              )}
            </select>
          </div>

          {(searchTerm || filterCategory !== 'all' || timePeriod !== 'all') && (
            <button
              onClick={() => { setSearchTerm(''); setFilterCategory('all'); setTimePeriod('all'); }}
              className="px-3 py-2 text-gray-500 hover:text-gray-700 text-sm cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
      
      {filteredAndSortedExpenses.length === 0 && expenses.length > 0 ? (
        <p className="text-gray-500 text-center py-4">No expenses match your search criteria.</p>
      ) : (
        <>
          <div className="space-y-3">
            {filteredAndSortedExpenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((expense) => (
              <div key={expense.id} className="flex justify-between items-center p-3 border rounded-md">
                <div>
                  <div className="font-semibold text-gray-900">{expense.description}</div>
                  <div className="text-sm text-gray-500">
                    {expense.category} • {new Date(expense.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg text-gray-900">${expense.amount.toFixed(2)}</span>
                  <button
                    onClick={() => onEditExpense(expense)}
                    className="text-blue-500 hover:text-blue-700 text-sm cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteExpense(expense.id)}
                    className="text-red-500 hover:text-red-700 text-sm cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          {filteredAndSortedExpenses.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="p-2 border rounded-md text-sm text-gray-900 font-medium"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-600">per page</span>
              </div>
              
              {filteredAndSortedExpenses.length > itemsPerPage && (
                <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.ceil(filteredAndSortedExpenses.length / itemsPerPage) }, (_, i) => i + 1)
                .filter(page => {
                  const totalPages = Math.ceil(filteredAndSortedExpenses.length / itemsPerPage);
                  return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                })
                .map((page, index, array) => (
                  <div key={page} className="flex items-center">
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2 text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 border rounded text-sm cursor-pointer ${
                        currentPage === page 
                          ? 'bg-blue-500 text-white border-blue-500' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  </div>
                ))
              }
              
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredAndSortedExpenses.length / itemsPerPage)))}
                    disabled={currentPage === Math.ceil(filteredAndSortedExpenses.length / itemsPerPage)}
                    className="px-3 py-1 border rounded text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}