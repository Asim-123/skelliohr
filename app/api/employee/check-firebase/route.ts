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

    // Find employee by email
    const employee = await Employee.findOne({ email });

    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      employee: {
        _id: employee._id,
        email: employee.email,
        firstName: employee.firstName,
        lastName: employee.lastName,
        firebaseUid: employee.firebaseUid || null,
        passwordChanged: employee.passwordChanged || false,
        status: employee.status,
      },
    });
  } catch (error: any) {
    console.error('Error checking employee:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to check employee' },
      { status: 500 }
    );
  }
}
