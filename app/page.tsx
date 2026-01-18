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
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-green-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-100 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-100 rounded-full opacity-20 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full text-green-700 text-sm font-medium mb-8">
              <FiCheckCircle size={16} />
              <span>Trusted by 500+ Companies Worldwide</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Enterprise HR Management
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 mt-2">
                Simplified & Powerful
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform your workforce management with an all-in-one platform designed for efficiency. 
              From onboarding to payroll, manage every aspect of your HR operations seamlessly.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/signup">
                <button className="group px-10 py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-xl hover:shadow-2xl text-lg font-semibold flex items-center gap-3 justify-center transform hover:scale-105">
                  Get Started Free
                  <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/login">
                <button className="px-10 py-5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:border-green-600 hover:text-green-600 transition-all text-lg font-semibold shadow-md hover:shadow-lg">
                  HR Admin Login
                </button>
              </Link>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
                <div className="text-gray-600 font-medium">Active Companies</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="text-4xl font-bold text-emerald-600 mb-2">50K+</div>
                <div className="text-gray-600 font-medium">Employees Managed</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="text-4xl font-bold text-teal-600 mb-2">99.9%</div>
                <div className="text-gray-600 font-medium">Uptime Guarantee</div>
              </div>
            </div>
            
            {/* Employee Login Link */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200 shadow-lg">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-left">
                    <p className="text-lg font-semibold text-gray-900 mb-1">
                      Employee Access Portal
                    </p>
                    <p className="text-gray-600">
                      Access your profile, attendance, payroll, and more
                    </p>
                  </div>
                  <Link href="/employee/login">
                    <button className="whitespace-nowrap px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold flex items-center gap-2">
                      Employee Login
                      <FiArrowRight size={18} />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
              COMPREHENSIVE FEATURES
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need in One Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful, integrated tools designed to streamline every aspect of HR management 
              and empower your workforce
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-green-300 group cursor-pointer transform hover:-translate-y-2"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
              SIMPLE PRICING
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Transparent Pricing That Scales With You
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start free with up to 10 employees. Only $5 per additional employee per month.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-200 p-8 hover:shadow-2xl transition-all">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                <p className="text-gray-600">Perfect for small teams</p>
              </div>
              <div className="text-center mb-8">
                <div className="text-5xl font-bold text-gray-900 mb-2">$0</div>
                <div className="text-gray-600">1 employee only</div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Up to 10 employees included</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Employee management</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Attendance tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Leave management</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Basic reporting</span>
                </li>
              </ul>
              <Link href="/signup">
                <button className="w-full py-3 px-6 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 transition-all font-semibold">
                  Get Started Free
                </button>
              </Link>
            </div>

            {/* Growth Plan */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-2xl border-2 border-green-500 p-8 relative transform scale-105 hover:scale-110 transition-all">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  MOST POPULAR
                </span>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Growth</h3>
                <p className="text-gray-600">For growing businesses</p>
              </div>
              <div className="text-center mb-8">
                <div className="text-5xl font-bold text-green-600 mb-2">$5</div>
                <div className="text-gray-600">per employee per month</div>
                <div className="text-sm text-gray-500 mt-1">(after first 10 free employees)</div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700 font-medium">Everything in Starter</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700 font-medium">Unlimited employees</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700 font-medium">Payroll processing</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700 font-medium">Advanced analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700 font-medium">Priority support</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700 font-medium">Custom reports</span>
                </li>
              </ul>
              <Link href="/signup">
                <button className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-semibold shadow-lg">
                  Start Growing
                </button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-200 p-8 hover:shadow-2xl transition-all">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <p className="text-gray-600">For large organizations</p>
              </div>
              <div className="text-center mb-8">
                <div className="text-5xl font-bold text-gray-900 mb-2">Custom</div>
                <div className="text-gray-600">Tailored to your needs</div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Everything in Growth</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Dedicated account manager</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Custom integrations</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">SLA guarantee</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">On-premise deployment</span>
                </li>
              </ul>
              <Link href="/contact">
                <button className="w-full py-3 px-6 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold">
                  Contact Sales
                </button>
              </Link>
            </div>
          </div>

          {/* Pricing Note */}
          <div className="mt-12 text-center">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 max-w-3xl mx-auto mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-3">💡 Pricing Example</h3>
              <div className="space-y-2 text-left text-gray-700">
                <div className="flex justify-between">
                  <span>• 1-10 employees:</span>
                  <span className="font-semibold text-green-600">$0/month (FREE)</span>
                </div>
                <div className="flex justify-between">
                  <span>• 11 employees:</span>
                  <span className="font-semibold">$5/month (1 × $5)</span>
                </div>
                <div className="flex justify-between">
                  <span>• 15 employees:</span>
                  <span className="font-semibold">$25/month (5 × $5)</span>
                </div>
                <div className="flex justify-between">
                  <span>• 20 employees:</span>
                  <span className="font-semibold">$50/month (10 × $5)</span>
                </div>
                <div className="flex justify-between">
                  <span>• 50 employees:</span>
                  <span className="font-semibold">$200/month (40 × $5)</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-lg">
              💳 Secure payments powered by <span className="font-semibold text-green-600">Payoneer</span>
            </p>
            <p className="text-gray-500 mt-2">
              All plans include 30-day money-back guarantee • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-200 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-6">
                WHY SKELLIO HR
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Built for Modern Businesses
              </h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Our platform combines enterprise-grade capabilities with an intuitive interface, 
                making complex HR operations simple and efficient for teams of all sizes.
              </p>
              <div className="space-y-5">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <FiCheckCircle className="text-white" size={16} />
                    </div>
                    <span className="text-gray-700 font-semibold text-lg group-hover:text-green-600 transition-colors">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Link href="/signup">
                  <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl text-lg font-semibold">
                    Start Your Free Trial
                  </button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-200 backdrop-blur-sm">
                <div className="space-y-8">
                  <div className="flex items-start gap-5 p-5 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 hover:shadow-lg transition-shadow">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <FiZap className="text-white" size={28} />
                    </div>
                    <div>
                      <div className="font-bold text-xl text-gray-900 mb-2">Lightning Fast Performance</div>
                      <div className="text-gray-600">Optimized for speed with real-time data processing and instant updates</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-5 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 hover:shadow-lg transition-shadow">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <FiShield className="text-white" size={28} />
                    </div>
                    <div>
                      <div className="font-bold text-xl text-gray-900 mb-2">Enterprise Security</div>
                      <div className="text-gray-600">Bank-level encryption with SOC 2 compliance and regular security audits</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-5 p-5 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 hover:shadow-lg transition-shadow">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <FiTrendingUp className="text-white" size={28} />
                    </div>
                    <div>
                      <div className="font-bold text-xl text-gray-900 mb-2">Infinitely Scalable</div>
                      <div className="text-gray-600">Grows seamlessly from 10 to 10,000+ employees without performance impact</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl opacity-20 blur-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-12 md:p-16 shadow-2xl overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-6">
                <FiZap size={16} />
                <span>Limited Time Offer</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Ready to Transform Your HR Operations?
              </h2>
              <p className="text-xl md:text-2xl text-green-50 mb-10 max-w-3xl mx-auto leading-relaxed">
                Join 500+ companies already using Skellio HR to streamline operations, 
                reduce costs, and empower their workforce
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/signup">
                  <button className="group px-10 py-5 bg-white text-green-600 rounded-xl hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl text-lg font-bold flex items-center gap-3 transform hover:scale-105">
                    Start Free 30-Day Trial
                    <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/login">
                  <button className="px-10 py-5 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all text-lg font-semibold backdrop-blur-sm">
                    Sign In to Dashboard
                  </button>
                </Link>
              </div>
              <p className="mt-8 text-green-100 text-sm">
                ✓ No credit card required  •  ✓ Full feature access  •  ✓ Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-2xl px-5 py-3 rounded-xl inline-block mb-6 shadow-lg">
                Skellio HR
              </div>
              <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                Enterprise-grade HR management platform designed to streamline operations 
                and empower modern businesses worldwide.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-green-600 flex items-center justify-center transition-colors">
                  <span className="text-xl">𝕏</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-green-600 flex items-center justify-center transition-colors">
                  <span className="text-xl">in</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-green-600 flex items-center justify-center transition-colors">
                  <span className="text-xl">f</span>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6 text-white">Quick Links</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/pricing" className="hover:text-green-400 transition-colors hover:translate-x-1 inline-block">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-green-400 transition-colors hover:translate-x-1 inline-block">
                    HR Login
                  </Link>
                </li>
                <li>
                  <Link href="/employee/login" className="hover:text-green-400 transition-colors hover:translate-x-1 inline-block">
                    Employee Login
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-green-400 transition-colors hover:translate-x-1 inline-block">
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-green-400 transition-colors hover:translate-x-1 inline-block">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6 text-white">Legal</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/privacy" className="hover:text-green-400 transition-colors hover:translate-x-1 inline-block">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-green-400 transition-colors hover:translate-x-1 inline-block">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@skellio.com" className="hover:text-green-400 transition-colors hover:translate-x-1 inline-block">
                    Support
                  </a>
                </li>
                <li>
                  <a href="mailto:legal@skellio.com" className="hover:text-green-400 transition-colors hover:translate-x-1 inline-block">
                    Legal Inquiries
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                &copy; 2026 Skellio HR. All rights reserved. Built with excellence.
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <FiShield size={16} className="text-green-500" />
                  SOC 2 Certified
                </span>
                <span className="flex items-center gap-2">
                  <FiCheckCircle size={16} className="text-green-500" />
                  GDPR Compliant
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
