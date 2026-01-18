'use client';

import { useEmployeeAuth } from '@/contexts/EmployeeAuthContext';
import { useEffect, useState } from 'react';
import { FiDollarSign, FiDownload, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import EmployeeLayout from '@/components/layout/EmployeeLayout';

interface Payroll {
  _id: string;
  month: number;
  year: number;
  baseSalary: number;
  allowances: number;
  deductions: number;
  bonus?: number;
  totalSalary: number;
  status: 'pending' | 'paid' | 'cancelled';
  paidAt?: string;
  createdAt: string;
}

export default function EmployeePayrollPage() {
  const { user } = useEmployeeAuth();
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPayrolls();
    }
  }, [user]);

  const fetchPayrolls = async () => {
    try {
      const response = await fetch(`/api/employee/payroll?employeeId=${user?._id}`);
      const data = await response.json();
      if (data.success) {
        setPayrolls(data.payrolls);
      }
    } catch (error) {
      console.error('Error fetching payroll:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (month: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
            <FiCheckCircle size={14} />
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
            Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const totalEarned = payrolls
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.totalSalary, 0);

  const currentMonthPayroll = payrolls.find(p => {
    const now = new Date();
    return p.month === now.getMonth() + 1 && p.year === now.getFullYear();
  });

  if (loading) {
    return (
      <EmployeeLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading payroll...</p>
          </div>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Payroll</h1>
            <p className="text-gray-600 mt-1">View your salary slips and payment history</p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-white bg-opacity-20">
                  <FiDollarSign size={24} />
                </div>
              </div>
              <p className="text-sm text-green-100 mb-1">Total Earned (This Year)</p>
              <p className="text-4xl font-bold">${(totalEarned / 1000).toFixed(1)}K</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <p className="text-sm text-gray-500 mb-2">Current Month Salary</p>
              <p className="text-4xl font-bold text-blue-600">
                ${currentMonthPayroll ? (currentMonthPayroll.totalSalary / 1000).toFixed(1) + 'K' : '0'}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {currentMonthPayroll ? getStatusBadge(currentMonthPayroll.status) : 'Not generated yet'}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <p className="text-sm text-gray-500 mb-2">Total Payslips</p>
              <p className="text-4xl font-bold text-purple-600">{payrolls.length}</p>
              <p className="text-xs text-gray-500 mt-2">
                {payrolls.filter(p => p.status === 'paid').length} paid
              </p>
            </div>
          </div>

          {/* Payroll Records */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Salary Slips</h2>
            </div>

            {payrolls.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Base Salary</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Allowances</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Bonus</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Deductions</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Net Salary</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid On</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {payrolls.map((payroll) => (
                      <tr key={payroll._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          {getMonthName(payroll.month)} {payroll.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                          ${payroll.baseSalary.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-green-600">
                          +${payroll.allowances.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-green-600">
                          {payroll.bonus ? `+$${payroll.bonus.toLocaleString()}` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600">
                          -${payroll.deductions.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                          ${payroll.totalSalary.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(payroll.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {payroll.paidAt 
                            ? new Date(payroll.paidAt).toLocaleDateString()
                            : '-'
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => alert('Download functionality coming soon!')}
                            className="text-blue-600 hover:text-blue-800"
                            title="Download Payslip"
                          >
                            <FiDownload size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FiDollarSign size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No payroll records yet</p>
                <p className="text-sm text-gray-500 mt-2">Your salary slips will appear here once generated by HR</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}
