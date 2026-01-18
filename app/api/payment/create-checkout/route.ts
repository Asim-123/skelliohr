import { NextRequest, NextResponse } from 'next/server';
import dbConnectHR from '@/lib/mongodb-hr';
import Company from '@/models/Company';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { companyId, employeeCount, amount } = await request.json();

    // Validate employee count
    if (!employeeCount || employeeCount <= 10) {
      return NextResponse.json(
        { success: false, error: 'Payment not required for 10 or fewer employees' },
        { status: 400 }
      );
    }

    // Calculate amount ($5 per employee after the first 10 free ones)
    const paidEmployees = employeeCount - 10; // First 10 employees are free
    const calculatedAmount = amount || (paidEmployees * 5.00);

    await dbConnectHR();
    const company = await Company.findById(companyId);

    if (!company) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      );
    }

    // Create Payoneer checkout session
    const payoneerApiKey = process.env.PAYONEER_API_KEY;
    const payoneerApiSecret = process.env.PAYONEER_API_SECRET;
    const merchantCode = process.env.PAYONEER_MERCHANT_CODE;

    if (!payoneerApiKey || !payoneerApiSecret || !merchantCode) {
      console.warn('⚠️ Payoneer credentials not configured. Using mock session.');
      
      // Mock session for testing without Payoneer credentials
      const mockSession = {
        longId: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: calculatedAmount,
        currency: 'USD',
        status: 'pending',
        companyId: companyId,
      };

      return NextResponse.json({
        success: true,
        checkoutSession: mockSession,
        isMock: true,
      });
    }

    // Real Payoneer API integration
    const payoneerApiUrl = process.env.NEXT_PUBLIC_PAYONEER_ENV === 'live' 
      ? 'https://api.payoneer.com/v4/checkout'
      : 'https://api.sandbox.payoneer.com/v4/checkout';

    const checkoutPayload = {
      transactionId: `skellio_${companyId}_${Date.now()}`,
      callback: {
        returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
        notificationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/webhook`,
      },
      payment: {
        amount: calculatedAmount,
        currency: 'USD',
        reference: `Skellio HR - ${paidEmployees} employee${paidEmployees > 1 ? 's' : ''}`,
      },
      customer: {
        email: company.email,
        merchantCustomerId: companyId,
      },
      products: [
        {
          name: 'Skellio HR Growth Plan',
          description: `${paidEmployees} additional employee${paidEmployees > 1 ? 's' : ''} at $5/month each`,
          amount: calculatedAmount,
          quantity: 1,
          currency: 'USD',
        },
      ],
    };

    const authHeader = Buffer.from(`${merchantCode}:${payoneerApiKey}:${payoneerApiSecret}`).toString('base64');

    const response = await fetch(payoneerApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authHeader}`,
      },
      body: JSON.stringify(checkoutPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Payoneer API error:', data);
      return NextResponse.json(
        { success: false, error: 'Failed to create Payoneer checkout session', details: data },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      checkoutSession: {
        longId: data.links?.self || data.longId,
        amount: calculatedAmount,
        currency: 'USD',
        status: 'pending',
        companyId: companyId,
      },
    });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create checkout session', details: error.message },
      { status: 500 }
    );
  }
}
