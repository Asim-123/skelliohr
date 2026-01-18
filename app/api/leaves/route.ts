import { NextRequest, NextResponse } from 'next/server';
import dbConnectHR from '@/lib/mongodb-hr';
import Leave from '@/models/Leave';

export const runtime = 'nodejs';

// GET all leave requests
export async function GET(request: NextRequest) {
  try {
    await dbConnectHR();

    const leaves = await Leave.find()
      .populate('employeeId', 'employeeId firstName lastName')
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
    const { employeeId, leaveType, startDate, endDate, reason } = body;

    // Validate required fields
    if (!employeeId || !leaveType || !startDate || !endDate || !reason) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create leave request
    const leave = await Leave.create({
      employeeId,
      leaveType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      leave,
    });
  } catch (error: any) {
    console.error('Error creating leave request:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create leave request' },
      { status: 500 }
    );
  }
}
