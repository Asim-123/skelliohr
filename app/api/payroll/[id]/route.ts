import { NextRequest, NextResponse } from 'next/server';
import dbConnectHR from '@/lib/mongodb-hr';
import Payroll from '@/models/Payroll';

export const runtime = 'nodejs';

// PATCH update payroll status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnectHR();

    const body = await request.json();
    const { status, paymentDate } = body;

    const updateData: any = { status };

    if (paymentDate) {
      updateData.paymentDate = new Date(paymentDate);
    }

    const payroll = await Payroll.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('employeeId', 'employeeId firstName lastName department');

    if (!payroll) {
      return NextResponse.json(
        { success: false, error: 'Payroll not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      payroll,
    });
  } catch (error: any) {
    console.error('Error updating payroll:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update payroll' },
      { status: 500 }
    );
  }
}
