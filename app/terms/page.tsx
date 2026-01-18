'use client';

import Link from 'next/link';
import { FiArrowLeft, FiFileText, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function TermsPage() {
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
            <FiFileText size={16} />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Terms and Conditions
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Last Updated: January 18, 2026
          </p>
          <p className="text-lg text-gray-600">
            Please read these terms and conditions carefully before using Skellio HR services.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 md:p-12">
            
            {/* Acceptance of Terms */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Acceptance of Terms</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  By accessing and using Skellio HR ("the Service"), you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to these terms, please do not use our Service.
                </p>
                <p>
                  These Terms and Conditions govern your use of our HR management platform, including all features, 
                  content, and services offered through our website and applications.
                </p>
              </div>
            </div>

            {/* Use of Service */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Use of Service</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-lg font-semibold">You agree to:</p>
                <ul className="space-y-3 ml-6">
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span>Provide accurate, current, and complete information during registration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span>Maintain the security of your account credentials</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span>Use the Service only for lawful purposes and in accordance with these Terms</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span>Not attempt to gain unauthorized access to any part of the Service</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span>Not use the Service to transmit any malicious code or harmful content</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* User Accounts */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">3. User Accounts</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  When you create an account with us, you must provide information that is accurate, complete, 
                  and current at all times. Failure to do so constitutes a breach of the Terms.
                </p>
                <p>
                  You are responsible for safeguarding the password that you use to access the Service and for 
                  any activities or actions under your password. You agree not to disclose your password to any 
                  third party and to notify us immediately upon becoming aware of any breach of security or 
                  unauthorized use of your account.
                </p>
              </div>
            </div>

            {/* Subscription and Billing */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Subscription and Billing</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  Skellio HR offers various subscription plans. By subscribing to our Service, you agree to:
                </p>
                <ul className="space-y-3 ml-6">
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span>Pay all fees associated with your chosen subscription plan</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span>Provide accurate and complete billing information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span>Authorize automatic renewal of your subscription unless cancelled</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span>Accept that fees are non-refundable except as required by law</span>
                  </li>
                </ul>
                <p className="mt-4">
                  We reserve the right to change our subscription fees upon 30 days' notice. Your continued use 
                  of the Service after the price change constitutes your agreement to pay the modified fees.
                </p>
              </div>
            </div>

            {/* Data Ownership */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Data Ownership and Usage</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  You retain all rights to the data you input into Skellio HR. We claim no ownership over your content.
                </p>
                <p>
                  By using our Service, you grant us a limited license to host, store, and process your data solely 
                  for the purpose of providing the Service to you. We will not use your data for any other purpose 
                  without your explicit consent.
                </p>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Intellectual Property</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  The Service and its original content, features, and functionality are and will remain the 
                  exclusive property of Skellio HR and its licensors.
                </p>
                <p>
                  Our trademarks and trade dress may not be used in connection with any product or service 
                  without our prior written consent.
                </p>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Limitation of Liability</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  To the maximum extent permitted by applicable law, Skellio HR shall not be liable for any 
                  indirect, incidental, special, consequential, or punitive damages, or any loss of profits or 
                  revenues, whether incurred directly or indirectly.
                </p>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                  <div className="flex items-start gap-3">
                    <FiAlertCircle className="text-yellow-600 mt-1 flex-shrink-0" size={24} />
                    <div>
                      <p className="font-semibold text-yellow-900">Important Notice</p>
                      <p className="text-yellow-800 mt-1">
                        The Service is provided "as is" without warranties of any kind, either express or implied.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Termination */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Termination</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  We may terminate or suspend your account and access to the Service immediately, without prior 
                  notice or liability, for any reason, including without limitation if you breach the Terms.
                </p>
                <p>
                  Upon termination, your right to use the Service will immediately cease. If you wish to terminate 
                  your account, you may simply discontinue using the Service or contact us to request account deletion.
                </p>
              </div>
            </div>

            {/* Changes to Terms */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">9. Changes to Terms</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, 
                  we will provide at least 30 days' notice prior to any new terms taking effect.
                </p>
                <p>
                  Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
                </p>
              </div>
            </div>

            {/* Governing Law */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">10. Governing Law</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  These Terms shall be governed and construed in accordance with the laws of the jurisdiction in 
                  which Skellio HR operates, without regard to its conflict of law provisions.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Terms?</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> legal@skellio.com</p>
                <p><strong>Address:</strong> Skellio HR, 123 Business Street, Tech City, TC 12345</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
