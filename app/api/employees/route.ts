import { NextRequest, NextResponse } from 'next/server';
import dbConnectHR from '@/lib/mongodb-hr';
import Employee from '@/models/Employee';

export const runtime = 'nodejs';

// GET all employees
export async function GET(request: NextRequest) {
  try {
    await dbConnectHR();

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json(
        { success: false, error: 'Company ID is required' },
        { status: 400 }
      );
    }

    const employees = await Employee.find({ companyId }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      employees,
    });
  } catch (error: any) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

// POST create new employee
export async function POST(request: NextRequest) {
  try {
    await dbConnectHR();

    const body = await request.json();
    const {
      companyId,
      employeeId,
      firstName,
      lastName,
      email,
      phone,
      department,
      position,
      dateOfJoining,
      dateOfBirth,
      address,
      salary,
      emergencyContact,
      status = 'active',
    } = body;

    // Validate required fields
    if (!companyId || !employeeId || !firstName || !lastName || !email || !phone || !department || !position || !dateOfJoining) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if employee ID already exists
    const existingEmployee = await Employee.findOne({ companyId, employeeId });
    if (existingEmployee) {
      return NextResponse.json(
        { success: false, error: 'Employee ID already exists' },
        { status: 400 }
      );
    }

    // Create new employee
    const employee = await Employee.create({
      companyId,
      employeeId,
      firstName,
      lastName,
      email,
      phone,
      department,
      position,
      dateOfJoining,
      dateOfBirth,
      address,
      salary,
      emergencyContact,
      status,
    });

    return NextResponse.json({
      success: true,
      employee,
    });
  } catch (error: any) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create employee' },
      { status: 500 }
    );
  }
}
