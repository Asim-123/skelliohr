import { NextRequest, NextResponse } from 'next/server';
import dbConnectHR from '@/lib/mongodb-hr';
import Attendance from '@/models/Attendance';
import Employee from '@/models/Employee';

export const runtime = 'nodejs';

// GET attendance records
export async function GET(request: NextRequest) {
  try {
    await dbConnectHR();

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const companyId = searchParams.get('companyId');

    if (!date) {
      return NextResponse.json(
        { success: false, error: 'Date is required' },
        { status: 400 }
      );
    }

    // Get attendance for the specific date
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    let query: any = {
      date: { $gte: startDate, $lte: endDate },
    };

    // If companyId is provided, filter by company's employees
    if (companyId) {
      const companyEmployees = await Employee.find({ companyId }).select('_id');
      const employeeIds = companyEmployees.map(emp => emp._id);
      query.employeeId = { $in: employeeIds };
    }

    const attendance = await Attendance.find(query)
      .populate('employeeId', 'employeeId firstName lastName department companyId')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      attendance,
    });
  } catch (error: any) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch attendance' },
      { status: 500 }
    );
  }
}

// POST mark attendance
export async function POST(request: NextRequest) {
  try {
    await dbConnectHR();

    const body = await request.json();
    const { employeeId, date, checkIn, checkOut, status, notes } = body;

    // Validate required fields
    if (!employeeId || !date || !checkIn || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if attendance already exists for this employee on this date
    const existingAttendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
        $lte: new Date(new Date(date).setHours(23, 59, 59, 999)),
      },
    });

    if (existingAttendance) {
      return NextResponse.json(
        { success: false, error: 'Attendance already marked for this date' },
        { status: 400 }
      );
    }

    // Create attendance record
    const attendance = await Attendance.create({
      employeeId,
      date: new Date(date),
      checkIn: new Date(checkIn),
      checkOut: checkOut ? new Date(checkOut) : undefined,
      status,
      notes,
    });

    return NextResponse.json({
      success: true,
      attendance,
    });
  } catch (error: any) {
    console.error('Error marking attendance:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to mark attendance' },
      { status: 500 }
    );
  }
}
