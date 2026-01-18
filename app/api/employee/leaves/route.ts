import { NextRequest, NextResponse } from 'next/server';
import dbConnectHR from '@/lib/mongodb-hr';
import Leave from '@/models/Leave';

export const runtime = 'nodejs';

// GET employee's leave requests
export async function GET(request: NextRequest) {
  try {
    await dbConnectHR();

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');

    if (!employeeId) {
      return NextResponse.json(
        { success: false, error: 'Employee ID is required' },
        { status: 400 }
      );
    }

    const leaves = await Leave.find({ employeeId })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      leaves,
    });
  } catch (error: any) {
    console.error('Error fetching leaves:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch leaves' },
      { status: 500 }
    );
  }
}

// POST create leave request
export async function POST(request: NextRequest) {
  try {
    await dbConnectHR();

    const body = await request.json();
    const { employeeId, type, startDate, endDate, days, reason } = body;

    if (!employeeId || !type || !startDate || !endDate || !days || !reason) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const leave = await Leave.create({
      employeeId,
      type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      days,
      reason,
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      leave,
    });
  } catch (error: any) {
    console.error('Error creating leave:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create leave' },
      { status: 500 }
    );
  }
}
