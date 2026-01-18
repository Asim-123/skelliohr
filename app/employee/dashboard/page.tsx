'use client';

import { useEmployeeAuth } from '@/contexts/EmployeeAuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiClock, FiFileText, FiDollarSign, FiCalendar, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import EmployeeLayout from '@/components/layout/EmployeeLayout';
import Link from 'next/link';

interface DashboardStats {
  presentDays: number;
  absentDays: number;
  totalWorkingDays: number;
  attendanceRate: number;
  pendingLeaves: number;
  approvedLeaves: number;
  rejectedLeaves: number;
  currentMonthSalary: number;
  lastPayrollDate: string;
}

export default function EmployeeDashboardPage() {
  const { user } = useEmployeeAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    presentDays: 0,
    absentDays: 0,
    totalWorkingDays: 0,
    attendanceRate: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
    currentMonthSalary: 0,
    lastPayrollDate: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch attendance stats
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      // Fetch leaves
      const leavesRes = await fetch(`/api/employee/leaves?employeeId=${user?._id}`);
      const leavesData = await leavesRes.json();
      const leaves = leavesData.success ? leavesData.leaves : [];
      
      const pendingLeaves = leaves.filter((leave: any) => leave.status === 'pending').length;
      const approvedLeaves = leaves.filter((leave: any) => leave.status === 'approved').length;
      const rejectedLeaves = leaves.filter((leave: any) => leave.status === 'rejected').length;

      // Fetch payroll
      const payrollRes = await fetch(`/api/employee/payroll?employeeId=${user?._id}&month=${now.getMonth() + 1}&year=${now.getFullYear()}`);
      const payrollData = await payrollRes.json();
      const payroll = payrollData.success && payrollData.payrolls.length > 0 ? payrollData.payrolls[0] : null;

      // Fetch attendance
      const attendanceRes = await fetch(`/api/employee/attendance?employeeId=${user?._id}&month=${now.getMonth() + 1}&year=${now.getFullYear()}`);
      const attendanceData = await attendanceRes.json();
      const attendance = attendanceData.success ? attendanceData.attendance : [];
      
      const presentDays = attendance.filter((att: any) => att.status === 'present').length;
      const absentDays = attendance.filter((att: any) => att.status === 'absent').length;
      const totalWorkingDays = now.getDate();
      const attendanceRate = totalWorkingDays > 0 ? (presentDays / totalWorkingDays) * 100 : 0;

      setStats({
        presentDays,
        absentDays,
        totalWorkingDays,
        attendanceRate,
        pendingLeaves,
        approvedLeaves,
        rejectedLeaves,
        currentMonthSalary: payroll ? payroll.totalSalary : 0,
        lastPayrollDate: payroll ? new Date(payroll.paidAt || payroll.createdAt).toLocaleDateString() : 'N/A',
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <EmployeeLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user?.firstName}!</h1>
            <p className="text-gray-600">Here's your overview for today</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Attendance */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                  <FiClock size={24} />
                </div>
                <span className="text-2xl font-bold text-blue-600">{stats.attendanceRate.toFixed(1)}%</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.presentDays}</p>
              <p className="text-sm text-gray-600">Days Present</p>
              <p className="text-xs text-gray-500 mt-2">Out of {stats.totalWorkingDays} working days</p>
            </div>

            {/* Leaves */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-orange-50 text-orange-600">
                  <FiFileText size={24} />
                </div>
                {stats.pendingLeaves > 0 && (
                  <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-1 rounded-full">
                    {stats.pendingLeaves} Pending
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.approvedLeaves}</p>
              <p className="text-sm text-gray-600">Approved Leaves</p>
              <p className="text-xs text-gray-500 mt-2">This month</p>
            </div>

            {/* Salary */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-white bg-opacity-20">
                  <FiDollarSign size={24} />
                </div>
              </div>
              <p className="text-3xl font-bold mb-1">
                ${(stats.currentMonthSalary / 1000).toFixed(1)}K
              </p>
              <p className="text-sm text-green-100">Current Month Salary</p>
              <p className="text-xs text-green-200 mt-2">Last paid: {stats.lastPayrollDate}</p>
            </div>

            {/* Quick Action */}
            <Link href="/employee/leaves">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white cursor-pointer hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-white bg-opacity-20">
                    <FiCalendar size={24} />
                  </div>
                </div>
                <p className="text-2xl font-bold mb-1">Apply for Leave</p>
                <p className="text-sm text-purple-100">Request time off</p>
                <p className="text-xs text-purple-200 mt-2">Click to apply →</p>
              </div>
            </Link>
          </div>

          {/* Recent Activity & Quick Links */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Leaves */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiFileText className="text-orange-600" />
                Recent Leave Requests
              </h2>
              {stats.pendingLeaves > 0 || stats.approvedLeaves > 0 ? (
                <div className="space-y-3">
                  {stats.pendingLeaves > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                      <FiAlertCircle className="text-orange-600 mt-1" size={20} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium">
                          {stats.pendingLeaves} leave request(s) pending approval
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Awaiting HR review</p>
                      </div>
                    </div>
                  )}
                  {stats.approvedLeaves > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <FiCheckCircle className="text-green-600 mt-1" size={20} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium">
                          {stats.approvedLeaves} leave(s) approved this month
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Enjoy your time off!</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FiFileText size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No leave requests yet</p>
                </div>
              )}
              <Link href="/employee/leaves">
                <button className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  View All Leaves
                </button>
              </Link>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h2>
              <div className="space-y-3">
                <Link href="/employee/profile">
                  <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all cursor-pointer">
                    <h3 className="font-semibold text-gray-900 mb-1">My Profile</h3>
                    <p className="text-xs text-gray-600">View and update your personal information</p>
                  </div>
                </Link>
                <Link href="/employee/attendance">
                  <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all cursor-pointer">
                    <h3 className="font-semibold text-gray-900 mb-1">Attendance History</h3>
                    <p className="text-xs text-gray-600">Check your attendance records</p>
                  </div>
                </Link>
                <Link href="/employee/payroll">
                  <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all cursor-pointer">
                    <h3 className="font-semibold text-gray-900 mb-1">Salary Slips</h3>
                    <p className="text-xs text-gray-600">Download your payroll documents</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}
