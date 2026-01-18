import { NextRequest, NextResponse } from 'next/server';
import dbConnectHR from '@/lib/mongodb-hr';
import Employee from '@/models/Employee';
import { adminAuth } from '@/lib/firebase-admin';

export const runtime = 'nodejs';

// GET single employee
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnectHR();

    const employee = await Employee.findById(params.id);

    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      employee,
    });
  } catch (error: any) {
    console.error('Error fetching employee:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch employee' },
      { status: 500 }
    );
  }
}

// PATCH update employee
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnectHR();

    const body = await request.json();

    const employee = await Employee.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      employee,
    });
  } catch (error: any) {
    console.error('Error updating employee:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update employee' },
      { status: 500 }
    );
  }
}

// DELETE employee
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnectHR();

    // First, get the employee to retrieve their Firebase UID
    const employee = await Employee.findById(params.id);

    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Delete from Firebase Authentication if firebaseUid exists
    if (employee.firebaseUid) {
      try {
        await adminAuth.deleteUser(employee.firebaseUid);
        console.log(`✅ Deleted Firebase user: ${employee.firebaseUid}`);
      } catch (firebaseError: any) {
        console.error('Error deleting Firebase user:', firebaseError);
        // Continue with database deletion even if Firebase deletion fails
        // This prevents orphaned database records
      }
    }

    // Delete from database
    await Employee.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Employee deleted successfully from database and Firebase',
    });
  } catch (error: any) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete employee' },
      { status: 500 }
    );
  }
}
