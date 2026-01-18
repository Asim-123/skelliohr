import { NextRequest, NextResponse } from 'next/server';
import dbConnectHR from '@/lib/mongodb-hr';
import Payroll from '@/models/Payroll';

export const runtime = 'nodejs';

// GET employee's payroll records
export async function GET(request: NextRequest) {
  try {
    await dbConnectHR();

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    if (!employeeId) {
      return NextResponse.json(
        { success: false, error: 'Employee ID is required' },
        { status: 400 }
      );
    }

    let query: any = { employeeId };

    if (month && year) {
      query.month = parseInt(month);
      query.year = parseInt(year);
    }

    const payrolls = await Payroll.find(query).sort({ year: -1, month: -1 });

    return NextResponse.json({
      success: true,
      payrolls,
    });
  } catch (error: any) {
    console.error('Error fetching payroll:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch payroll' },
      { status: 500 }
    );
  }
}
