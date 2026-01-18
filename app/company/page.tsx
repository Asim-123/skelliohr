'use client';

import { useHRAuth } from '@/contexts/HRAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiGrid, FiUsers, FiMapPin, FiPhone, FiMail, FiEdit } from 'react-icons/fi';
import HRLayout from '@/components/layout/HRLayout';

interface Company {
  _id: string;
  name: string;
  industry?: string;
  size?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  createdAt: string;
}

export default function CompanyPage() {
  const { user, loading: authLoading } = useHRAuth();
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [employeeCount, setEmployeeCount] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.companyId) {
      fetchCompany();
      fetchEmployeeCount();
    }
  }, [user]);

  const fetchCompany = async () => {
    try {
      const response = await fetch(`/api/companies/${user?.companyId}`);
      const data = await response.json();
      if (data.success) {
        setCompany(data.company);
      }
    } catch (error) {
      console.error('Error fetching company:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeCount = async () => {
    try {
      const response = await fetch(`/api/employees?companyId=${user?.companyId}`);
      const data = await response.json();
      if (data.success) {
        setEmployeeCount(data.employees.length);
      }
    } catch (error) {
      console.error('Error fetching employee count:', error);
    }
  };

  if (authLoading || !user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <HRLayout>
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
                <p className="text-gray-600 mt-1">Manage your company information</p>
              </div>
              <button
                onClick={() => router.push('/company/edit')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all"
              >
                <FiEdit size={20} />
                Edit Profile
              </button>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <p className="text-gray-500">Loading company information...</p>
            </div>
          ) : !company ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <FiGrid className="mx-auto text-5xl text-gray-300 mb-4" />
              <p className="text-gray-500">Company information not found</p>
            </div>
          ) : (
            <>
            {/* Company Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-3xl font-bold">
                  {company.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{company.name}</h2>
                  {company.industry && (
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Industry:</span> {company.industry}
                    </p>
                  )}
                  {company.size && (
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Company Size:</span> {company.size}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    Member since {new Date(company.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <FiUsers size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Employees</p>
                    <p className="text-2xl font-bold text-gray-900">{employeeCount}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <FiGrid size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Departments</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <FiUsers size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">1</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-4">
                {company.address && (
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
                      <FiMapPin size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-gray-900">{company.address}</p>
                    </div>
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
                      <FiPhone size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-gray-900">{company.phone}</p>
                    </div>
                  </div>
                )}
                {company.email && (
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
                      <FiMail size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900">{company.email}</p>
                    </div>
                  </div>
                )}
                {company.website && (
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
                      <FiGrid size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700"
                      >
                        {company.website}
                      </a>
                    </div>
                  </div>
                )}
                {!company.address && !company.phone && !company.email && !company.website && (
                  <p className="text-gray-500 text-center py-4">
                    No contact information available. Click "Edit Profile" to add details.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
        </div>
      </div>
    </HRLayout>
  );
}
