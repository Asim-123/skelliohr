import { NextRequest, NextResponse } from 'next/server';
import dbConnectHR from '@/lib/mongodb-hr';
import Employee from '@/models/Employee';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    await dbConnectHR();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if employee exists
    const employee = await Employee.findOne({ email, status: 'active' });

    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found or inactive' },
        { status: 404 }
      );
    }

    // Check if employee already has a Firebase account
    if (employee.firebaseUid) {
      return NextResponse.json(
        { success: false, error: 'Account already exists. Please sign in.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Employee found. You can proceed with account setup.',
    });
  } catch (error: any) {
    console.error('Error checking employee:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to check employee' },
      { status: 500 }
    );
  }
}
