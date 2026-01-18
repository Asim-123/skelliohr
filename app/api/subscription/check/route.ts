import { NextRequest, NextResponse } from 'next/server';
import dbConnectHR from '@/lib/mongodb-hr';
import Company from '@/models/Company';
import Employee from '@/models/Employee';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json(
        { success: false, error: 'Company ID is required' },
        { status: 400 }
      );
    }

    await dbConnectHR();

    // Get company details
    const company = await Company.findById(companyId);
    if (!company) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      );
    }

    // Count active employees
    const employeeCount = await Employee.countDocuments({ 
      companyId: companyId,
      status: 'active'
    });

    // Determine if payment is required
    const requiresPayment = employeeCount > 10;
    const subscriptionStatus = company.subscriptionStatus || 'free';
    const subscriptionPlan = company.subscriptionPlan || 'free';

    // Calculate amount ($5 per employee after the first 10 free ones)
    const paidEmployees = employeeCount > 10 ? employeeCount - 10 : 0;
    const amount = paidEmployees * 5.00;

    return NextResponse.json({
      success: true,
      subscription: {
        employeeCount,
        requiresPayment,
        status: subscriptionStatus,
        plan: subscriptionPlan,
        amount: amount,
        paidEmployees: paidEmployees,
        nextBillingDate: company.nextBillingDate,
        lastPaymentDate: company.lastPaymentDate,
      },
    });
  } catch (error: any) {
    console.error('Error checking subscription:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check subscription', details: error.message },
      { status: 500 }
    );
  }
}
