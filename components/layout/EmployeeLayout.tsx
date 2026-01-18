'use client';

import { useState, useEffect } from 'react';
import { useEmployeeAuth } from '@/contexts/EmployeeAuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  FiHome, FiUser, FiClock, FiFileText, FiDollarSign, FiLogOut, FiChevronLeft, FiChevronRight, FiMenu, FiX
} from 'react-icons/fi';

const navItems = [
  { name: 'Dashboard', icon: FiHome, href: '/employee/dashboard' },
  { name: 'My Profile', icon: FiUser, href: '/employee/profile' },
  { name: 'Attendance', icon: FiClock, href: '/employee/attendance' },
  { name: 'Leave Requests', icon: FiFileText, href: '/employee/leaves' },
  { name: 'Payroll', icon: FiDollarSign, href: '/employee/payroll' },
];

interface EmployeeLayoutProps {
  children: React.ReactNode;
}

export default function EmployeeLayout({ children }: EmployeeLayoutProps) {
  const { user, signOut } = useEmployeeAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/employee/login');
    }
  }, [user, router]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/employee/login');
  };

  if (!user) {
    return null;
  }

  const userInitials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-gradient-to-br from-blue-600 to-indigo-700 text-white transition-all duration-300 ease-in-out
        ${isSidebarCollapsed ? 'w-20' : 'w-64'} ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className={`flex items-center p-4 h-16 border-b border-blue-500 ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isSidebarCollapsed && (
            <Link href="/employee/dashboard" className="text-2xl font-bold text-white">
              Employee Portal
            </Link>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 hidden lg:block"
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
          </button>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-full hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 lg:hidden"
            aria-label="Close menu"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link href={item.href} key={item.name}>
              <div
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200
                ${pathname === item.href ? 'bg-blue-500 text-white shadow-md' : 'hover:bg-blue-500 hover:text-white'}
                ${isSidebarCollapsed ? 'justify-center' : ''}`}
                onClick={() => {
                  if (isMobileMenuOpen) toggleMobileMenu();
                }}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {!isSidebarCollapsed && <span className="text-sm font-medium">{item.name}</span>}
              </div>
            </Link>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className={`p-4 border-t border-blue-500 ${isSidebarCollapsed ? 'text-center' : ''}`}>
          <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-lg font-semibold">
              {userInitials}
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-semibold">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-blue-200">{user.position}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleSignOut}
            className={`mt-4 w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors duration-200
            hover:bg-blue-500 hover:text-white ${isSidebarCollapsed ? 'justify-center' : ''}`}
          >
            <FiLogOut size={20} />
            {!isSidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Header for mobile */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-100 shadow-sm lg:hidden">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Open menu"
          >
            <FiMenu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Employee Portal</h1>
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-lg font-semibold text-white">
            {userInitials}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
