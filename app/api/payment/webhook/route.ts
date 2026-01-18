import { NextRequest, NextResponse } from 'next/server';
import dbConnectHR from '@/lib/mongodb-hr';
import Company from '@/models/Company';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // In production, verify the webhook signature from Payoneer
    const payload = await request.json();
    
    const { event, data } = payload;

    await dbConnectHR();

    switch (event) {
      case 'payment.succeeded':
        // Update company subscription status
        await Company.findByIdAndUpdate(data.companyId, {
          subscriptionStatus: 'active',
          subscriptionPlan: 'growth',
          lastPaymentDate: new Date(),
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        });
        break;

      case 'payment.failed':
        // Handle failed payment
        await Company.findByIdAndUpdate(data.companyId, {
          subscriptionStatus: 'payment_failed',
        });
        break;

      case 'subscription.cancelled':
        // Handle subscription cancellation
        await Company.findByIdAndUpdate(data.companyId, {
          subscriptionStatus: 'cancelled',
          subscriptionPlan: 'free',
        });
        break;

      default:
        console.log(`Unhandled event type: ${event}`);
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
