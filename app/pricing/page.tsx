'use client';

import Link from 'next/link';
import { FiArrowLeft, FiCheckCircle, FiDollarSign } from 'react-icons/fi';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-2xl px-4 py-2 rounded-lg cursor-pointer hover:shadow-lg transition-shadow">
                Skellio HR
              </div>
            </Link>
            <Link href="/">
              <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 font-medium transition-colors">
                <FiArrowLeft size={20} />
                <span>Back to Home</span>
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-6">
            <FiDollarSign size={16} />
            <span>Simple & Transparent</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Pricing That Grows With You
          </h1>
          <p className="text-xl text-gray-600">
            Start free with up to 10 employees. Only $5 per additional employee per month. No hidden fees.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 p-10 hover:shadow-2xl transition-all">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-3">Starter</h3>
                <p className="text-gray-600 text-lg">Perfect for small teams</p>
              </div>
              <div className="text-center mb-10">
                <div className="text-6xl font-bold text-gray-900 mb-3">$0</div>
                <div className="text-gray-600 text-lg">1 employee only</div>
                <div className="text-sm text-gray-500 mt-2">Forever free</div>
              </div>
              <ul className="space-y-5 mb-10">
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={24} />
                  <span className="text-gray-700 text-lg">1 employee included</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={24} />
                  <span className="text-gray-700 text-lg">Employee management</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={24} />
                  <span className="text-gray-700 text-lg">Attendance tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={24} />
                  <span className="text-gray-700 text-lg">Leave management</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={24} />
                  <span className="text-gray-700 text-lg">Basic reporting</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={24} />
                  <span className="text-gray-700 text-lg">Email support</span>
                </li>
              </ul>
              <Link href="/signup">
                <button className="w-full py-4 px-6 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 transition-all font-semibold text-lg">
                  Get Started Free
                </button>
              </Link>
            </div>

            {/* Growth Plan - Most Popular */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-2xl border-4 border-green-500 p-10 relative transform md:scale-110 hover:scale-115 transition-all">
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  MOST POPULAR
                </span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-3">Growth</h3>
                <p className="text-gray-600 text-lg">For growing businesses</p>
              </div>
              <div className="text-center mb-10">
                <div className="text-6xl font-bold text-green-600 mb-3">$5</div>
                <div className="text-gray-700 text-lg font-medium">per employee per month</div>
                <div className="text-sm text-gray-600 mt-2">After first 10 free employees</div>
              </div>
              <ul className="space-y-5 mb-10">
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" size={24} />
                  <span className="text-gray-700 text-lg font-medium">Everything in Starter</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" size={24} />
                  <span className="text-gray-700 text-lg font-medium">Unlimited employees</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" size={24} />
                  <span className="text-gray-700 text-lg font-medium">Payroll processing</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" size={24} />
                  <span className="text-gray-700 text-lg font-medium">Advanced analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" size={24} />
                  <span className="text-gray-700 text-lg font-medium">Priority support</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" size={24} />
                  <span className="text-gray-700 text-lg font-medium">Custom reports</span>
                </li>
              </ul>
              <Link href="/signup">
                <button className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-bold text-lg shadow-xl">
                  Start Growing Now
                </button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 p-10 hover:shadow-2xl transition-all">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-3">Enterprise</h3>
                <p className="text-gray-600 text-lg">For large organizations</p>
              </div>
              <div className="text-center mb-10">
                <div className="text-6xl font-bold text-gray-900 mb-3">Custom</div>
                <div className="text-gray-600 text-lg">Tailored pricing</div>
                <div className="text-sm text-gray-500 mt-2">Contact for quote</div>
              </div>
              <ul className="space-y-5 mb-10">
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={24} />
                  <span className="text-gray-700 text-lg">Everything in Growth</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={24} />
                  <span className="text-gray-700 text-lg">Dedicated account manager</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={24} />
                  <span className="text-gray-700 text-lg">Custom integrations</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={24} />
                  <span className="text-gray-700 text-lg">99.9% SLA guarantee</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={24} />
                  <span className="text-gray-700 text-lg">On-premise deployment</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={24} />
                  <span className="text-gray-700 text-lg">24/7 phone support</span>
                </li>
              </ul>
              <Link href="/contact">
                <button className="w-full py-4 px-6 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold text-lg">
                  Contact Sales
                </button>
              </Link>
            </div>
          </div>

          {/* Payment Info */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  💳 Secure Payments Powered by Payoneer
                </h3>
                <p className="text-gray-700 text-lg mb-6">
                  All transactions are encrypted and secure. We accept all major payment methods.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <FiCheckCircle className="text-green-600" size={18} />
                    30-day money-back guarantee
                  </span>
                  <span className="flex items-center gap-2">
                    <FiCheckCircle className="text-green-600" size={18} />
                    Cancel anytime
                  </span>
                  <span className="flex items-center gap-2">
                    <FiCheckCircle className="text-green-600" size={18} />
                    No setup fees
                  </span>
                  <span className="flex items-center gap-2">
                    <FiCheckCircle className="text-green-600" size={18} />
                    No hidden charges
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  How does the pricing work?
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  You can use Skellio HR completely free for up to 10 employees. Each additional employee costs $5 per month. 
                  For example: 11 employees = $5/month, 15 employees = $25/month, 20 employees = $50/month. 
                  It's that simple!
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  We accept all major credit cards, debit cards, and bank transfers through our secure 
                  payment partner, Payoneer. All transactions are encrypted and PCI-compliant.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Can I cancel anytime?
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Yes! You can cancel your subscription at any time with no penalties or cancellation fees. 
                  You'll continue to have access until the end of your billing period.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  What happens if I go back to 1 employee?
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  If your employee count drops back to 1, you'll automatically return to the free plan 
                  at the end of your current billing period. No action needed!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
