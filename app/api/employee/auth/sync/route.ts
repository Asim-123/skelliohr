import { NextRequest, NextResponse } from 'next/server';
import dbConnectHR from '@/lib/mongodb-hr';
import Employee from '@/models/Employee';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    await dbConnectHR();

    const { firebaseUid, email } = await request.json();

    if (!firebaseUid || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find employee by email and firebaseUid
    let employee = await Employee.findOne({ email, firebaseUid });

    if (!employee) {
      // If not found by firebaseUid, try to find by email only (for first-time login)
      employee = await Employee.findOne({ email });
      
      if (employee) {
        // Update employee with firebaseUid
        employee.firebaseUid = firebaseUid;
        await employee.save();
      } else {
        return NextResponse.json(
          { success: false, error: 'Employee not found. Please contact HR.' },
          { status: 404 }
        );
      }
    }

    // Check if employee is active
    if (employee.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Employee account is not active' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      employee: {
        _id: employee._id,
        employeeId: employee.employeeId,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        department: employee.department,
        position: employee.position,
        companyId: employee.companyId,
        passwordChanged: employee.passwordChanged || false,
      },
    });
  } catch (error: any) {
    console.error('Error syncing employee:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to sync employee' },
      { status: 500 }
    );
  }
}
