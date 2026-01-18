'use client';

import Link from 'next/link';
import { FiArrowLeft, FiShield, FiLock, FiEye, FiDatabase, FiUsers, FiCheckCircle } from 'react-icons/fi';

export default function PrivacyPolicyPage() {
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
            <FiShield size={16} />
            <span>Your Privacy Matters</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Last Updated: January 18, 2026
          </p>
          <p className="text-lg text-gray-600">
            At Skellio HR, we take your privacy seriously. This policy outlines how we collect, 
            use, and protect your personal information.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 md:p-12">
            
            {/* Information We Collect */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center">
                  <FiDatabase className="text-white" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Information We Collect</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="space-y-3 ml-6">
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span><strong>Account Information:</strong> Name, email address, phone number, and company details</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span><strong>Employee Data:</strong> Information you input about your employees, including personal details, attendance, and payroll data</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span><strong>Usage Information:</strong> How you interact with our platform, including pages visited and features used</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                  <FiUsers className="text-white" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">How We Use Your Information</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  We use the information we collect to:
                </p>
                <ul className="space-y-3 ml-6">
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span>Provide, maintain, and improve our HR management services</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span>Process transactions and send related information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span>Send technical notices, updates, and security alerts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span>Respond to your comments, questions, and customer service requests</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span>Monitor and analyze trends, usage, and activities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span>Detect, prevent, and address technical issues and fraudulent activity</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Data Security */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                  <FiLock className="text-white" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Data Security</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  We implement industry-standard security measures to protect your data:
                </p>
                <ul className="space-y-3 ml-6">
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span><strong>Encryption:</strong> All data is encrypted in transit using SSL/TLS and at rest using AES-256</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span><strong>Access Controls:</strong> Strict role-based access controls and authentication mechanisms</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span><strong>Regular Audits:</strong> Periodic security assessments and vulnerability testing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span><strong>Compliance:</strong> SOC 2 Type II certified and GDPR compliant</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Data Sharing */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                  <FiEye className="text-white" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Data Sharing and Disclosure</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  We do not sell your personal information. We may share your information only in the following circumstances:
                </p>
                <ul className="space-y-3 ml-6">
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span><strong>With Your Consent:</strong> When you explicitly authorize us to share information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span><strong>Service Providers:</strong> With trusted third-party service providers who assist in operating our platform</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Your Rights */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Rights</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  You have the right to:
                </p>
                <ul className="space-y-3 ml-6">
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span>Access, update, or delete your personal information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span>Object to processing of your personal information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span>Request restriction of processing your personal information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span>Request transfer of your personal information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span>Withdraw consent at any time</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> privacy@skellio.com</p>
                <p><strong>Address:</strong> Skellio HR, 123 Business Street, Tech City, TC 12345</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
