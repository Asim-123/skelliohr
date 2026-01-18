import { NextRequest, NextResponse } from 'next/server';
import dbConnectHR from '@/lib/mongodb-hr';
import Employee from '@/models/Employee';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    await dbConnectHR();

    const { firebaseUid, employeeId } = await request.json();

    if (!firebaseUid && !employeeId) {
      return NextResponse.json(
        { success: false, error: 'Firebase UID or Employee ID is required' },
        { status: 400 }
      );
    }

    // Find employee by firebaseUid or employeeId
    let employee;
    if (firebaseUid) {
      employee = await Employee.findOne({ firebaseUid });
    } else if (employeeId) {
      employee = await Employee.findById(employeeId);
    }

    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }

    employee.passwordChanged = true;
    await employee.save();

    return NextResponse.json({
      success: true,
      message: 'Password change recorded',
      employee: {
        _id: employee._id,
        passwordChanged: employee.passwordChanged,
      },
    });
  } catch (error: any) {
    console.error('Error marking password as changed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update record' },
      { status: 500 }
    );
  }
}
