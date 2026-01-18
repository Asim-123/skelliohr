'use client';

import { useEmployeeAuth } from '@/contexts/EmployeeAuthContext';
import { useEffect, useState } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiBriefcase, FiLock } from 'react-icons/fi';
import EmployeeLayout from '@/components/layout/EmployeeLayout';

interface EmployeeProfile {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  dateOfJoining: string;
  dateOfBirth: string;
  address: string;
  salary: number;
  status: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export default function EmployeeProfilePage() {
  const { user } = useEmployeeAuth();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/employees/${user?._id}`);
      const data = await response.json();
      if (data.success) {
        setProfile(data.employee);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError('Please enter your current password');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setUpdatingPassword(true);

    try {
      const response = await fetch('/api/employee/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          currentPassword: currentPassword,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to update password');
      }

      setPasswordSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowPasswordForm(false);
        setPasswordSuccess('');
      }, 2000);
    } catch (error: any) {
      setPasswordError(error.message || 'Failed to update password');
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <EmployeeLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </EmployeeLayout>
    );
  }

  if (!profile) {
    return (
      <EmployeeLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600">Profile not found</p>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">View your personal information</p>
          </div>

          {/* Profile Card */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-8 mb-6 text-white">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-4xl font-bold">
                {profile.firstName[0]}{profile.lastName[0]}
              </div>
              <div>
                <h2 className="text-3xl font-bold">{profile.firstName} {profile.lastName}</h2>
                <p className="text-blue-100 text-lg">{profile.position}</p>
                <p className="text-blue-200 text-sm mt-1">{profile.department} Department</p>
                <p className="text-blue-200 text-sm">Employee ID: {profile.employeeId}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiUser className="text-blue-600" />
                Personal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Full Name</label>
                  <p className="text-gray-900 font-medium">{profile.firstName} {profile.lastName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 flex items-center gap-2">
                    <FiMail size={14} />
                    Email
                  </label>
                  <p className="text-gray-900 font-medium">{profile.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 flex items-center gap-2">
                    <FiPhone size={14} />
                    Phone
                  </label>
                  <p className="text-gray-900 font-medium">{profile.phone}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 flex items-center gap-2">
                    <FiCalendar size={14} />
                    Date of Birth
                  </label>
                  <p className="text-gray-900 font-medium">
                    {new Date(profile.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 flex items-center gap-2">
                    <FiMapPin size={14} />
                    Address
                  </label>
                  <p className="text-gray-900 font-medium">{profile.address}</p>
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiBriefcase className="text-blue-600" />
                Employment Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Employee ID</label>
                  <p className="text-gray-900 font-medium">{profile.employeeId}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Department</label>
                  <p className="text-gray-900 font-medium">{profile.department}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Position</label>
                  <p className="text-gray-900 font-medium">{profile.position}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Date of Joining</label>
                  <p className="text-gray-900 font-medium">
                    {new Date(profile.dateOfJoining).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <p className="text-gray-900 font-medium capitalize">{profile.status}</p>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Emergency Contact</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Name</label>
                  <p className="text-gray-900 font-medium">{profile.emergencyContact.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Relationship</label>
                  <p className="text-gray-900 font-medium">{profile.emergencyContact.relationship}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 flex items-center gap-2">
                    <FiPhone size={14} />
                    Phone
                  </label>
                  <p className="text-gray-900 font-medium">{profile.emergencyContact.phone}</p>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiLock className="text-blue-600" />
                Security
              </h3>
              
              {!showPasswordForm ? (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Change Password
                </button>
              ) : (
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  {passwordError && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded text-sm">
                      {passwordError}
                    </div>
                  )}
                  {passwordSuccess && (
                    <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded text-sm">
                      {passwordSuccess}
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter current password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter new password"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={updatingPassword}
                      className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {updatingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordError('');
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}
