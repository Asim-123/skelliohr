'use client';

import { useHRAuth } from '@/contexts/HRAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  FiUsers, 
  FiClock, 
  FiFileText, 
  FiDollarSign, 
  FiUserPlus, 
  FiCheckCircle, 
  FiAlertCircle,
  FiTrendingUp,
  FiCalendar,
  FiActivity
} from 'react-icons/fi';
import Link from 'next/link';
import HRLayout from '@/components/layout/HRLayout';

interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  presentToday: number;
  pendingLeaves: number;
  approvedLeaves: number;
  pendingPayroll: number;
  totalPayroll: number;
  newEmployeesThisMonth: number;
}

interface RecentActivity {
  type: 'employee' | 'leave' | 'attendance' | 'payroll';
  message: string;
  time: string;
  status?: 'success' | 'warning' | 'info';
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useHRAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    activeEmployees: 0,
    presentToday: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    pendingPayroll: 0,
    totalPayroll: 0,
    newEmployeesThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.companyId) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch employees
      const employeesRes = await fetch(`/api/employees?companyId=${user?.companyId}`);
      const employeesData = await employeesRes.json();
      
      
      const employees = employeesData.success ? employeesData.employees : [];
      const activeEmployees = employees.filter((emp: any) => emp.status === 'active');
      
      
      // Calculate new employees this month
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const newEmployees = employees.filter((emp: any) => 
        new Date(emp.createdAt) >= firstDayOfMonth
      );

      // Fetch attendance for today
      const today = new Date().toISOString().split('T')[0];
      const attendanceRes = await fetch(`/api/attendance?date=${today}&companyId=${user?.companyId}`);
      const attendanceData = await attendanceRes.json();
      const presentToday = attendanceData.success ? 
        attendanceData.attendance.filter((att: any) => att.status === 'present').length : 0;

      // Fetch leaves
      const leavesRes = await fetch('/api/leaves');
      const leavesData = await leavesRes.json();
      const leaves = leavesData.success ? leavesData.leaves : [];
      const pendingLeaves = leaves.filter((leave: any) => leave.status === 'pending').length;
      const approvedLeaves = leaves.filter((leave: any) => leave.status === 'approved').length;

      // Fetch payroll
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();
      const payrollRes = await fetch(`/api/payroll?month=${currentMonth}&year=${currentYear}&companyId=${user?.companyId}`);
      const payrollData = await payrollRes.json();
      const payrolls = payrollData.success ? payrollData.payrolls : [];
      const pendingPayroll = payrolls.filter((p: any) => p.status === 'pending').length;
      const totalPayroll = payrolls.reduce((sum: number, p: any) => sum + (p.totalSalary || 0), 0);

      setStats({
        totalEmployees: employees.length,
        activeEmployees: activeEmployees.length,
        presentToday,
        pendingLeaves,
        approvedLeaves,
        pendingPayroll,
        totalPayroll,
        newEmployeesThisMonth: newEmployees.length,
      });

      // Generate recent activities
      const activities: RecentActivity[] = [];
      
      if (newEmployees.length > 0) {
        activities.push({
          type: 'employee',
          message: `${newEmployees.length} new employee(s) joined this month`,
          time: 'This month',
          status: 'success'
        });
      }
      
      if (pendingLeaves > 0) {
        activities.push({
          type: 'leave',
          message: `${pendingLeaves} leave request(s) pending approval`,
          time: 'Pending',
          status: 'warning'
        });
      }
      
      if (pendingPayroll > 0) {
        activities.push({
          type: 'payroll',
          message: `${pendingPayroll} payroll(s) pending for this month`,
          time: 'This month',
          status: 'info'
        });
      }

      if (presentToday > 0) {
        activities.push({
          type: 'attendance',
          message: `${presentToday} employee(s) marked present today`,
          time: 'Today',
          status: 'success'
        });
      }

      setRecentActivities(activities);
      
      console.log('Dashboard stats updated:', {
        totalEmployees: employees.length,
        activeEmployees: activeEmployees.length,
        presentToday,
        pendingLeaves,
        approvedLeaves,
        pendingPayroll,
        totalPayroll,
        newEmployeesThisMonth: newEmployees.length,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <HRLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </HRLayout>
    );
  }

  if (!user) {
    return null;
  }

  const attendanceRate = stats.totalEmployees > 0 
    ? ((stats.presentToday / stats.activeEmployees) * 100).toFixed(1) 
    : 0;

  return (
    <HRLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Beta Notice */}
          <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">🚧</span>
              <div className="text-center">
                <p className="text-amber-900 font-bold text-lg">BETA - Platform in Development</p>
                <p className="text-amber-700 text-sm">Some features may be incomplete or under active development</p>
              </div>
              <span className="text-2xl">🚧</span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.displayName || user.email}! Here's what's happening today.</p>
            </div>
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <FiActivity className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Employees */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-white bg-opacity-20">
                  <FiUsers size={24} />
                </div>
                <span className="text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  {stats.activeEmployees} Active
                </span>
              </div>
              <p className="text-3xl font-bold mb-1">{stats.totalEmployees}</p>
              <p className="text-sm text-green-100">Total Employees</p>
              {stats.newEmployeesThisMonth > 0 && (
                <div className="mt-3 flex items-center gap-1 text-xs">
                  <FiTrendingUp size={14} />
                  <span>+{stats.newEmployeesThisMonth} this month</span>
                </div>
              )}
            </div>

            {/* Attendance */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                  <FiClock size={24} />
                </div>
                <span className="text-2xl font-bold text-blue-600">{attendanceRate}%</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.presentToday}</p>
              <p className="text-sm text-gray-600">Present Today</p>
              <p className="text-xs text-gray-500 mt-2">Out of {stats.activeEmployees} active employees</p>
            </div>

            {/* Leave Requests */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-orange-50 text-orange-600">
                  <FiFileText size={24} />
                </div>
                {stats.pendingLeaves > 0 && (
                  <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-1 rounded-full">
                    Action Required
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.pendingLeaves}</p>
              <p className="text-sm text-gray-600">Pending Leaves</p>
              <p className="text-xs text-gray-500 mt-2">{stats.approvedLeaves} approved this month</p>
            </div>

            {/* Payroll */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                  <FiDollarSign size={24} />
                </div>
                {stats.pendingPayroll > 0 && (
                  <span className="bg-purple-100 text-purple-600 text-xs font-semibold px-2 py-1 rounded-full">
                    {stats.pendingPayroll} Pending
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                ${(stats.totalPayroll / 1000).toFixed(1)}K
              </p>
              <p className="text-sm text-gray-600">Total Payroll</p>
              <p className="text-xs text-gray-500 mt-2">This month</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Quick Actions */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiActivity className="text-green-600" />
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/employees/new">
                    <div className="group p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                          <FiUserPlus size={20} />
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">Add Employee</h3>
                      <p className="text-xs text-gray-600">Onboard new team member</p>
                    </div>
                  </Link>

                  <Link href="/attendance">
                    <div className="group p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <FiCheckCircle size={20} />
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">Mark Attendance</h3>
                      <p className="text-xs text-gray-600">Record daily presence</p>
                    </div>
                  </Link>

                  <Link href="/payroll/generate">
                    <div className="group p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                          <FiDollarSign size={20} />
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">Generate Payroll</h3>
                      <p className="text-xs text-gray-600">Process monthly salaries</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiCalendar className="text-green-600" />
                  Recent Activity
                </h2>
                {recentActivities.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`p-2 rounded-lg ${
                          activity.status === 'success' ? 'bg-green-100 text-green-600' :
                          activity.status === 'warning' ? 'bg-orange-100 text-orange-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {activity.type === 'employee' && <FiUsers size={16} />}
                          {activity.type === 'leave' && <FiFileText size={16} />}
                          {activity.type === 'attendance' && <FiClock size={16} />}
                          {activity.type === 'payroll' && <FiDollarSign size={16} />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 font-medium">{activity.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FiAlertCircle size={48} className="mx-auto mb-3 opacity-50" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Pending Tasks */}
            <div className="space-y-6">
              {/* Pending Tasks */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiAlertCircle className="text-orange-600" />
                  Pending Tasks
                </h2>
                <div className="space-y-3">
                  {stats.pendingLeaves > 0 && (
                    <Link href="/leaves">
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-orange-900">Leave Requests</span>
                          <span className="bg-orange-200 text-orange-900 text-xs font-bold px-2 py-1 rounded-full">
                            {stats.pendingLeaves}
                          </span>
                        </div>
                        <p className="text-xs text-orange-700">Requires your approval</p>
                      </div>
                    </Link>
                  )}
                  
                  {stats.pendingPayroll > 0 && (
                    <Link href="/payroll">
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-purple-900">Payroll Processing</span>
                          <span className="bg-purple-200 text-purple-900 text-xs font-bold px-2 py-1 rounded-full">
                            {stats.pendingPayroll}
                          </span>
                        </div>
                        <p className="text-xs text-purple-700">Pending payment</p>
                      </div>
                    </Link>
                  )}

                  {stats.pendingLeaves === 0 && stats.pendingPayroll === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      <FiCheckCircle size={40} className="mx-auto mb-2 text-green-500" />
                      <p className="text-sm font-medium">All caught up!</p>
                      <p className="text-xs mt-1">No pending tasks</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
                <h3 className="text-lg font-bold mb-4">This Month</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">New Hires</span>
                    <span className="text-2xl font-bold">{stats.newEmployeesThisMonth}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Approved Leaves</span>
                    <span className="text-2xl font-bold">{stats.approvedLeaves}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Attendance Rate</span>
                    <span className="text-2xl font-bold">{attendanceRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HRLayout>
  );
}
