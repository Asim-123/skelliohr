'use client';

import { useHRAuth } from '@/contexts/HRAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiFileText, FiCheck, FiX, FiClock, FiFilter } from 'react-icons/fi';
import HRLayout from '@/components/layout/HRLayout';

interface Leave {
  _id: string;
  employeeId: {
    _id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
  };
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvalDate?: string;
  rejectionReason?: string;
  createdAt: string;
}

export default function LeavesPage() {
  const { user, loading: authLoading } = useHRAuth();
  const router = useRouter();
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [processingLeaveId, setProcessingLeaveId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.companyId) {
      fetchLeaves();
    }
  }, [user]);

  const fetchLeaves = async () => {
    try {
      const response = await fetch('/api/leaves');
      const data = await response.json();
      if (data.success) {
        setLeaves(data.leaves);
      }
    } catch (error) {
      console.error('Error fetching leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (leaveId: string) => {
    setProcessingLeaveId(leaveId);
    try {
      const response = await fetch(`/api/leaves/${leaveId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'approved',
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchLeaves();
      } else {
        alert(`Error: ${data.error || 'Failed to approve leave'}`);
      }
    } catch (error) {
      console.error('Error approving leave:', error);
      alert('Failed to approve leave. Please try again.');
    } finally {
      setProcessingLeaveId(null);
    }
  };

  const handleReject = async (leaveId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    setProcessingLeaveId(leaveId);
    try {
      const response = await fetch(`/api/leaves/${leaveId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'rejected',
          rejectionReason: reason,
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchLeaves();
      } else {
        alert(`Error: ${data.error || 'Failed to reject leave'}`);
      }
    } catch (error) {
      console.error('Error rejecting leave:', error);
      alert('Failed to reject leave. Please try again.');
    } finally {
      setProcessingLeaveId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'sick': return 'bg-purple-100 text-purple-800';
      case 'casual': return 'bg-blue-100 text-blue-800';
      case 'annual': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const filteredLeaves = filter === 'all' ? leaves : leaves.filter(l => l.status === filter);

  if (authLoading || !user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <HRLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
            <p className="text-gray-600 mt-1">Review and manage employee leave requests</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-sm text-gray-500">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{leaves.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {leaves.filter(l => l.status === 'pending').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-2xl font-bold text-green-600">
                {leaves.filter(l => l.status === 'approved').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-2xl font-bold text-red-600">
                {leaves.filter(l => l.status === 'rejected').length}
              </p>
            </div>
          </div>

          {/* Filter */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex items-center gap-4">
              <FiFilter className="text-gray-400" size={20} />
              <div className="flex gap-2">
                {['all', 'pending', 'approved', 'rejected'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === f
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Leave Requests */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">Loading leave requests...</p>
              </div>
            ) : filteredLeaves.length === 0 ? (
              <div className="p-8 text-center">
                <FiFileText className="mx-auto text-5xl text-gray-300 mb-4" />
                <p className="text-gray-500">No leave requests found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredLeaves.map((leave) => (
                  <div key={leave._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {leave.employeeId.firstName} {leave.employeeId.lastName}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getLeaveTypeColor(leave.leaveType)}`}>
                            {leave.leaveType}
                          </span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(leave.status)}`}>
                            {leave.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          Employee ID: {leave.employeeId.employeeId}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-500">Duration</p>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                              <span className="text-gray-500 ml-2">
                                ({calculateDays(leave.startDate, leave.endDate)} days)
                              </span>
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Applied On</p>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(leave.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm text-gray-500">Reason</p>
                          <p className="text-sm text-gray-900">{leave.reason}</p>
                        </div>
                        {leave.rejectionReason && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-sm text-red-700">
                              <strong>Rejection Reason:</strong> {leave.rejectionReason}
                            </p>
                          </div>
                        )}
                      </div>
                      {leave.status === 'pending' && (
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleApprove(leave._id)}
                            disabled={processingLeaveId === leave._id}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processingLeaveId === leave._id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Processing...
                              </>
                            ) : (
                              <>
                                <FiCheck size={16} />
                                Approve
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleReject(leave._id)}
                            disabled={processingLeaveId === leave._id}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processingLeaveId === leave._id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Processing...
                              </>
                            ) : (
                              <>
                                <FiX size={16} />
                                Reject
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </HRLayout>
  );
}
