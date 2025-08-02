'use client';

import { Expense, type ExpenseSummary } from '@/types/expense';
import { useState } from 'react';

interface ExpenseSummaryProps {
  expenses: Expense[];
}

export default function ExpenseSummary({ expenses }: ExpenseSummaryProps) {
  const [period, setPeriod] = useState<'month' | 'year' | 'comparison'>('month');
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');
  
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  
  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date + 'T00:00:00');
    if (period === 'month') {
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    } else if (period === 'year') {
      return expenseDate.getFullYear() === currentYear;
    } else {
      // For comparison, include both current and last month
      return (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) ||
             (expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear);
    }
  });

  // Separate expenses for comparison
  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date + 'T00:00:00');
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  const lastMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date + 'T00:00:00');
    return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear;
  });

  const currentMonthTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const difference = currentMonthTotal - lastMonthTotal;
  const percentageChange = lastMonthTotal > 0 ? ((difference / lastMonthTotal) * 100) : 0;
  
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const categoryTotals = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const summary: ExpenseSummary[] = Object.entries(categoryTotals)
    .map(([category, total]) => ({
      category,
      total,
      percentage: totalAmount > 0 ? (total / totalAmount) * 100 : 0
    }))
    .sort((a, b) => b.total - a.total);

  // Comparison summaries
  const currentMonthCategoryTotals = currentMonthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const lastMonthCategoryTotals = lastMonthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const allCategories = new Set([...Object.keys(currentMonthCategoryTotals), ...Object.keys(lastMonthCategoryTotals)]);
  
  const comparisonSummary = Array.from(allCategories).map(category => {
    const currentAmount = currentMonthCategoryTotals[category] || 0;
    const lastAmount = lastMonthCategoryTotals[category] || 0;
    const diff = currentAmount - lastAmount;
    return {
      category,
      currentAmount,
      lastAmount,
      difference: diff,
      percentageChange: lastAmount > 0 ? ((diff / lastAmount) * 100) : (currentAmount > 0 ? 100 : 0)
    };
  }).sort((a, b) => b.currentAmount - a.currentAmount);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Expense Summary</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as 'list' | 'chart')}
            className="p-2 border rounded-md text-sm text-gray-900 font-medium"
          >
            <option value="list">List View</option>
            <option value="chart">Chart View</option>
          </select>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as 'month' | 'year')}
            className="p-2 border rounded-md text-sm text-gray-900 font-medium"
          >
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="comparison">Monthly Comparison</option>
          </select>
        </div>
      </div>
      
      <div className="mb-4">
        {period === 'comparison' ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-700">
                  ${currentMonthTotal.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500">This Month</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">
                  ${lastMonthTotal.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500">Last Month</div>
              </div>
            </div>
            <div className="text-center">
              <div className={`text-sm font-medium ${
                difference > 0 ? 'text-red-600' : difference < 0 ? 'text-green-600' : 'text-gray-600'
              }`}>
                {difference > 0 ? '+' : ''}${difference.toFixed(2)} 
                ({percentageChange > 0 ? '+' : ''}{Math.round(percentageChange)}%)
              </div>
              <div className="text-xs text-gray-500">
                vs last month
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold text-blue-700">
              ${totalAmount.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">
              Total {period === 'month' ? 'this month' : 'this year'}
            </div>
          </>
        )}
      </div>
      
      {period === 'comparison' ? (
        comparisonSummary.length > 0 ? (
          viewMode === 'list' ? (
            <div className="space-y-3">
              {comparisonSummary.map((item) => (
                <div key={item.category} className="border rounded-md p-3">
                  <div className="font-semibold text-gray-900 mb-2">{item.category}</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">This Month:</span>
                      <span className="font-bold text-gray-900 ml-1">${item.currentAmount.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Last Month:</span>
                      <span className="font-bold text-gray-900 ml-1">${item.lastAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className={`text-xs mt-1 ${
                    item.difference > 0 ? 'text-red-600' : item.difference < 0 ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {item.difference > 0 ? '+' : ''}${item.difference.toFixed(2)} 
                    ({item.percentageChange > 0 ? '+' : ''}{Math.round(item.percentageChange)}%)
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {comparisonSummary.map((item) => {
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-gray-500'];
                const colorIndex = comparisonSummary.indexOf(item) % colors.length;
                const maxAmount = Math.max(...comparisonSummary.map(s => Math.max(s.currentAmount, s.lastAmount)));
                return (
                  <div key={item.category} className="space-y-2">
                    <div className="font-semibold text-gray-900 text-sm">{item.category}</div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>This Month: ${item.currentAmount.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${colors[colorIndex]}`}
                          style={{ width: `${maxAmount > 0 ? (item.currentAmount / maxAmount) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Last Month: ${item.lastAmount.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${colors[colorIndex]} opacity-50`}
                          style={{ width: `${maxAmount > 0 ? (item.lastAmount / maxAmount) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          <p className="text-gray-500">No expenses to compare.</p>
        )
      ) : summary.length > 0 ? (
        viewMode === 'list' ? (
          <div className="space-y-3">
            {summary.map((item) => (
              <div key={item.category} className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-gray-900">{item.category}</div>
                  <div className="text-sm text-gray-500">{Math.round(item.percentage)}%</div>
                </div>
                <div className="font-bold text-gray-900">${item.total.toFixed(2)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Bar Chart */}
            <div className="space-y-2">
              {summary.map((item) => {
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-gray-500'];
                const colorIndex = summary.indexOf(item) % colors.length;
                return (
                  <div key={item.category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-gray-900">{item.category}</span>
                      <span className="font-bold text-gray-900">${item.total.toFixed(2)} ({Math.round(item.percentage)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${colors[colorIndex]}`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Pie Chart (Simple CSS version) */}
            <div className="mt-6">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Category Distribution</h3>
              <div className="flex flex-wrap gap-2">
                {summary.map((item) => {
                  const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-gray-500'];
                  const colorIndex = summary.indexOf(item) % colors.length;
                  return (
                    <div key={item.category} className="flex items-center gap-2 text-xs">
                      <div className={`w-3 h-3 rounded-full ${colors[colorIndex]}`}></div>
                      <span className="font-medium text-gray-900">{item.category}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )
      ) : (
        <p className="text-gray-500">No expenses for this {period === 'month' ? 'month' : 'year'}.</p>
      )}
    </div>
  );
}