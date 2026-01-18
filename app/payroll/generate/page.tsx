'use client';

import { useHRAuth } from '@/contexts/HRAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiDollarSign, FiUsers, FiCalendar, FiSave, FiX, FiAlertCircle } from 'react-icons/fi';
import HRLayout from '@/components/layout/HRLayout';

interface Employee {
  _id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  department: string;
  position: string;
  salary: number;
  status: string;
}

interface PayrollItem {
  employeeId: string;
  employeeName: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  included: boolean;
}

export default function GeneratePayrollPage() {
  const { user, loading: authLoading } = useHRAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrollItems, setPayrollItems] = useState<PayrollItem[]>([]);
  
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      // Set default month and year to current
      const now = new Date();
      setMonth((now.getMonth() + 1).toString().padStart(2, '0'));
      setYear(now.getFullYear().toString());
      setPaymentDate(now.toISOString().split('T')[0]);
      
      fetchEmployees();
    }
  }, [user]);

  const fetchEmployees = async () => {
    try {
      if (!user?.companyId) {
        setError('Company ID not found. Please contact support.');
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/employees?companyId=${user.companyId}`);
      const data = await response.json();

      if (data.success) {
        const activeEmployees = data.employees.filter((emp: Employee) => emp.status === 'active');
        setEmployees(activeEmployees);
        
        // Initialize payroll items
        const items: PayrollItem[] = activeEmployees.map((emp: Employee) => ({
          employeeId: emp._id,
          employeeName: `${emp.firstName} ${emp.lastName}`,
          basicSalary: emp.salary / 12, // Monthly salary
          allowances: 0,
          deductions: 0,
          netSalary: emp.salary / 12,
          included: true,
        }));
        setPayrollItems(items);
      } else {
        setError(data.error || 'Failed to fetch employees');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const updatePayrollItem = (index: number, field: keyof PayrollItem, value: any) => {
    const updatedItems = [...payrollItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Recalculate net salary
    if (field === 'basicSalary' || field === 'allowances' || field === 'deductions') {
      const item = updatedItems[index];
      item.netSalary = item.basicSalary + item.allowances - item.deductions;
    }
    
    setPayrollItems(updatedItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      // Filter only included employees
      const includedItems = payrollItems.filter(item => item.included);
      
      if (includedItems.length === 0) {
        setError('Please select at least one employee');
        setSaving(false);
        return;
      }

      // Create payroll records for each employee
      const payrollRecords = includedItems.map(item => ({
        employeeId: item.employeeId,
        month: parseInt(month),
        year: parseInt(year),
        basicSalary: item.basicSalary,
        allowances: item.allowances,
        deductions: item.deductions,
        netSalary: item.netSalary,
        paymentDate,
        status: 'pending',
        notes,
      }));

      // Send batch request
      const response = await fetch('/api/payroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payrollRecords }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/payroll');
      } else {
        setError(data.error || 'Failed to generate payroll');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate payroll');
    } finally {
      setSaving(false);
    }
  };

  const totalNetSalary = payrollItems
    .filter(item => item.included)
    .reduce((sum, item) => sum + item.netSalary, 0);

  if (authLoading || loading) {
    return (
      <HRLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading employees...</p>
          </div>
        </div>
      </HRLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <HRLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Generate Payroll</h1>
            <p className="text-gray-600 mt-1">Create payroll for multiple employees</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Payroll Period */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiCalendar className="text-green-600" />
                Payroll Period
              </h2>
              
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <FiAlertCircle />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Month *
                  </label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Month</option>
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year *
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                    min="2020"
                    max="2100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Date *
                  </label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Add any notes about this payroll batch..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Employee List */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiUsers className="text-green-600" />
                Employees ({payrollItems.filter(item => item.included).length} selected)
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        <input
                          type="checkbox"
                          checked={payrollItems.every(item => item.included)}
                          onChange={(e) => {
                            const updatedItems = payrollItems.map(item => ({
                              ...item,
                              included: e.target.checked
                            }));
                            setPayrollItems(updatedItems);
                          }}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Employee</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Basic Salary</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Allowances</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Deductions</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Net Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrollItems.map((item, index) => (
                      <tr key={item.employeeId} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={item.included}
                            onChange={(e) => updatePayrollItem(index, 'included', e.target.checked)}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{item.employeeName}</div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <input
                            type="number"
                            value={item.basicSalary}
                            onChange={(e) => updatePayrollItem(index, 'basicSalary', parseFloat(e.target.value) || 0)}
                            disabled={!item.included}
                            className="w-28 px-2 py-1 text-right border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                          />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <input
                            type="number"
                            value={item.allowances}
                            onChange={(e) => updatePayrollItem(index, 'allowances', parseFloat(e.target.value) || 0)}
                            disabled={!item.included}
                            className="w-28 px-2 py-1 text-right border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                          />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <input
                            type="number"
                            value={item.deductions}
                            onChange={(e) => updatePayrollItem(index, 'deductions', parseFloat(e.target.value) || 0)}
                            disabled={!item.included}
                            className="w-28 px-2 py-1 text-right border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                          />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="font-semibold text-gray-900">
                            ${item.netSalary.toFixed(2)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-300">
                      <td colSpan={5} className="py-3 px-4 text-right font-semibold text-gray-900">
                        Total Net Salary:
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="text-xl font-bold text-green-600">
                          ${totalNetSalary.toFixed(2)}
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={saving || payrollItems.filter(item => item.included).length === 0}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50"
              >
                <FiSave size={20} />
                {saving ? 'Generating...' : 'Generate Payroll'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/payroll')}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiX size={20} />
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </HRLayout>
  );
}
