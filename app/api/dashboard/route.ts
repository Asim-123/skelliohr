import { NextRequest, NextResponse } from 'next/server';
import dbConnectHR from '@/lib/mongodb-hr';
import Employee from '@/models/Employee';
import Attendance from '@/models/Attendance';
import Leave from '@/models/Leave';
import Payroll from '@/models/Payroll';

export const runtime = 'nodejs';

// GET dashboard statistics
export async function GET(request: NextRequest) {
  try {
    await dbConnectHR();

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Get total employees
    const totalEmployees = await Employee.countDocuments({ 
      companyId,
      status: 'active'
    });

    // Get today's attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const presentToday = await Attendance.countDocuments({
      date: { $gte: today, $lt: tomorrow },
      status: 'present'
    });

    // Get pending leaves
    const pendingLeaves = await Leave.countDocuments({
      status: 'pending'
    });

    // Get pending payroll
    const pendingPayroll = await Payroll.countDocuments({
      status: 'pending'
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalEmployees,
        presentToday,
        pendingLeaves,
        pendingPayroll,
      },
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
