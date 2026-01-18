'use client';

import { useState, useEffect, useRef } from 'react';
import { FiX, FiCreditCard, FiLock } from 'react-icons/fi';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  employeeCount: number;
}

export default function PaymentModal({ isOpen, onClose, companyId, employeeCount }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPayoneerWidget, setShowPayoneerWidget] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const payoneerContainerRef = useRef<HTMLDivElement>(null);

  // Calculate pricing: $5 per employee after the first 10 free ones
  const paidEmployees = employeeCount > 10 ? employeeCount - 10 : 1;
  const monthlyAmount = paidEmployees * 5;

  // Load Payoneer widget when session ID is available
  useEffect(() => {
    if (!sessionId || !showPayoneerWidget || !payoneerContainerRef.current) return;

    const loadPayoneerWidget = async () => {
      try {
        // Dynamically import Payoneer SDK
        const { CheckoutWeb } = await import('@payoneer/checkout-web');
        
        // Initialize Payoneer Checkout
        // Use 'test' for sandbox/testing, 'live' for production
        const checkout = await CheckoutWeb({ 
          env: process.env.NEXT_PUBLIC_PAYONEER_ENV || 'test',
          longId: sessionId 
        });

        // Mount the payment widget
        const cardsComponent = checkout.dropIn('cards').mount(payoneerContainerRef.current);

        // Listen to payment events
        cardsComponent.on('onPaymentSuccess', (result: any) => {
          console.log('✅ Payment successful:', result);
          handlePaymentSuccess();
        });

        cardsComponent.on('onPaymentFailure', (error: any) => {
          console.error('❌ Payment failed:', error);
          setError('Payment failed. Please try again.');
          setLoading(false);
          setShowPayoneerWidget(false);
        });

        cardsComponent.on('onPaymentCancel', () => {
          console.log('Payment cancelled by user');
          setLoading(false);
          setShowPayoneerWidget(false);
        });

      } catch (err: any) {
        console.error('Error loading Payoneer widget:', err);
        setError('Failed to load payment widget. Please try again.');
        setLoading(false);
        setShowPayoneerWidget(false);
      }
    };

    loadPayoneerWidget();
  }, [sessionId, showPayoneerWidget]);

  if (!isOpen) return null;

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      // Create checkout session with Payoneer
      const response = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          employeeCount,
          amount: monthlyAmount,
        }),
      });

      const data = await response.json();

      if (data.success && data.checkoutSession?.longId) {
        // Set session ID and show Payoneer widget
        setSessionId(data.checkoutSession.longId);
        setShowPayoneerWidget(true);
      } else {
        setError(data.error || 'Failed to create checkout session');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed');
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setLoading(false);
    alert('Payment successful! You can now add unlimited employees.');
    window.location.reload(); // Reload to update subscription status
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">Upgrade to Growth Plan</h3>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="mb-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-green-600 mb-2">${monthlyAmount}</div>
                  <div className="text-gray-700 font-medium">per month</div>
                  <div className="text-sm text-gray-600 mt-2">
                    $5 × {paidEmployees} {paidEmployees === 1 ? 'employee' : 'employees'}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="text-sm text-gray-700 space-y-2">
                    <div className="flex justify-between">
                      <span>First 10 employees:</span>
                      <span className="font-semibold text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{paidEmployees} additional {paidEmployees === 1 ? 'employee' : 'employees'}:</span>
                      <span className="font-semibold">${monthlyAmount}/month</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">${monthlyAmount}/month</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="text-green-600">✓</span>
                    <span>Add unlimited employees</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="text-green-600">✓</span>
                    <span>Payroll processing</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="text-green-600">✓</span>
                    <span>Advanced analytics</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="text-green-600">✓</span>
                    <span>Priority support</span>
                  </div>
                </div>
              </div>
            </div>

            {!showPayoneerWidget ? (
              <>
                <div className="mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <FiLock className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <p className="text-sm font-semibold text-blue-900">Secure Payment</p>
                        <p className="text-xs text-blue-700 mt-1">
                          Powered by Payoneer. Your payment information is encrypted and secure.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Button */}
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl text-lg font-bold"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Loading Payment...</span>
                    </>
                  ) : (
                    <>
                      <FiCreditCard size={24} />
                      <span>Pay ${monthlyAmount}/month with Payoneer</span>
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-gray-500 mt-4">
                  Cancel anytime • 30-day money-back guarantee
                </p>
              </>
            ) : (
              <>
                {/* Payoneer Widget Container */}
                <div className="mb-6">
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-4 min-h-[400px]">
                    <div ref={payoneerContainerRef} id="payoneer-container"></div>
                    {loading && (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                        <p className="text-gray-600">Loading secure payment form...</p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowPayoneerWidget(false);
                    setSessionId(null);
                    setLoading(false);
                  }}
                  className="w-full py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                >
                  Cancel Payment
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
