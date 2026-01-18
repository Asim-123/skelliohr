'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useHRAuth } from '@/contexts/HRAuthContext';
import Link from 'next/link';
import { 
  FiUsers, 
  FiClock, 
  FiFileText, 
  FiDollarSign, 
  FiTrendingUp, 
  FiShield,
  FiZap,
  FiCheckCircle,
  FiArrowRight
} from 'react-icons/fi';

export default function HomePage() {
  const { user, loading } = useHRAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  const features = [
    {
      icon: FiUsers,
      title: 'Employee Management',
      description: 'Efficiently manage your workforce with comprehensive employee profiles and records.',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: FiClock,
      title: 'Attendance Tracking',
      description: 'Monitor employee attendance with real-time tracking and automated reporting.',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: FiFileText,
      title: 'Leave Management',
      description: 'Streamline leave requests and approvals with an intuitive workflow system.',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: FiDollarSign,
      title: 'Payroll Processing',
      description: 'Automate salary calculations and manage payroll with ease and accuracy.',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: FiTrendingUp,
      title: 'Performance Reviews',
      description: 'Track employee performance and conduct comprehensive evaluations.',
      color: 'from-red-500 to-rose-600'
    },
    {
      icon: FiShield,
      title: 'Secure & Compliant',
      description: 'Enterprise-grade security with full compliance to data protection regulations.',
      color: 'from-indigo-500 to-blue-600'
    }
  ];

  const benefits = [
    'Real-time analytics and reporting',
    'Mobile-friendly interface',
    'Automated workflows',
    'Customizable dashboards',
    'Multi-location support',
    'Integration capabilities'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-2xl px-4 py-2 rounded-lg">
                Skellio HR
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <button className="px-6 py-2 text-gray-700 hover:text-green-600 font-medium transition-colors">
                  Sign In
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Modern HR Management
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600 mt-2">
                Made Simple
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline your HR operations with our comprehensive platform. Manage employees, 
              track attendance, process payroll, and more—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl text-lg font-semibold flex items-center gap-2 justify-center">
                  Start Free Trial
                  <FiArrowRight size={20} />
                </button>
              </Link>
              <Link href="/login">
                <button className="px-8 py-4 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-all text-lg font-semibold">
                  HR Admin Sign In
                </button>
              </Link>
            </div>
            
            {/* Employee Login Link */}
            <div className="mt-8 p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto border-2 border-blue-200">
              <p className="text-center text-gray-700 mb-3">
                <strong>Are you an employee?</strong>
              </p>
              <Link href="/employee/login">
                <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-semibold">
                  Employee Portal Login
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Your Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to simplify HR management and boost productivity
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 group"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose Skellio HR?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Built for modern businesses, our platform combines powerful features with 
                an intuitive interface to make HR management effortless.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <FiCheckCircle className="text-white" size={16} />
                    </div>
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                      <FiZap className="text-white" size={24} />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Lightning Fast</div>
                      <div className="text-sm text-gray-500">Optimized performance</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center">
                      <FiShield className="text-white" size={24} />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Secure & Reliable</div>
                      <div className="text-sm text-gray-500">Enterprise-grade security</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                      <FiTrendingUp className="text-white" size={24} />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Scalable Solution</div>
                      <div className="text-sm text-gray-500">Grows with your business</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your HR Management?
            </h2>
            <p className="text-xl text-green-50 mb-8">
              Join hundreds of companies already using Skellio HR to streamline their operations
            </p>
            <Link href="/signup">
              <button className="px-8 py-4 bg-white text-green-600 rounded-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl text-lg font-semibold">
                Get Started for Free
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-2xl px-4 py-2 rounded-lg inline-block mb-4">
                Skellio HR
              </div>
              <p className="text-gray-400">
                Modern HR management for modern businesses
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Skellio HR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
