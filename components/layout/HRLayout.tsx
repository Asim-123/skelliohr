'use client';

import { useState, useEffect } from 'react';
import { useHRAuth } from '@/contexts/HRAuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  FiHome, FiUsers, FiClock, FiFileText, FiDollarSign, FiBriefcase, FiTrendingUp, FiSettings, FiChevronLeft, FiChevronRight, FiMenu, FiX, FiGrid, FiLogOut
} from 'react-icons/fi';

const navItems = [
  { name: 'Dashboard', icon: FiHome, href: '/dashboard' },
  { name: 'Employees', icon: FiUsers, href: '/employees' },
  { name: 'Attendance', icon: FiClock, href: '/attendance' },
  { name: 'Leave Management', icon: FiFileText, href: '/leaves' },
  { name: 'Payroll', icon: FiDollarSign, href: '/payroll' },
  { name: 'Recruitment', icon: FiBriefcase, href: '/recruitment' },
  { name: 'Performance', icon: FiTrendingUp, href: '/performance' },
  { name: 'Company', icon: FiGrid, href: '/company' },
  { name: 'Settings', icon: FiSettings, href: '/settings' },
];

interface HRLayoutProps {
  children: React.ReactNode;
}

export default function HRLayout({ children }: HRLayoutProps) {
  const { user, signOut } = useHRAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const userInitials = user?.displayName 
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase() 
    : user?.email?.[0]?.toUpperCase() || 'HR';

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
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-gradient-to-br from-green-700 to-emerald-700 text-white transition-all duration-300 ease-in-out
        ${isSidebarCollapsed ? 'w-20' : 'w-64'} ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className={`flex items-center p-4 h-16 border-b border-green-600 ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isSidebarCollapsed && (
            <Link href="/dashboard" className="text-2xl font-bold text-white">
              Skellio HR
            </Link>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 hidden lg:block"
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
          </button>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 lg:hidden"
            aria-label="Close menu"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link href={item.href} key={item.name}>
                <div
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200
                  ${isActive ? 'bg-green-600 text-white shadow-md' : 'hover:bg-green-600 hover:text-white'}
                  ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  onClick={() => {
                    if (isMobileMenuOpen) toggleMobileMenu();
                  }}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {!isSidebarCollapsed && <span className="text-sm font-medium">{item.name}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className={`p-4 border-t border-green-600 ${isSidebarCollapsed ? 'text-center' : ''}`}>
          <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-lg font-semibold">
              {userInitials}
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-semibold">{user?.displayName || user?.email}</p>
                <p className="text-xs text-green-200 capitalize">{user?.role?.replace('hr_', 'HR ')}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleSignOut}
            className={`mt-4 w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors duration-200
            hover:bg-green-600 hover:text-white ${isSidebarCollapsed ? 'justify-center' : ''}`}
          >
            <FiLogOut size={20} />
            {!isSidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Mobile Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-100 shadow-sm lg:hidden">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Open menu"
          >
            <FiMenu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Skellio HR</h1>
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-lg font-semibold text-white">
            {userInitials}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
