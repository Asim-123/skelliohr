import { NextRequest, NextResponse } from 'next/server';
import dbConnectHR from '@/lib/mongodb-hr';
import Payroll from '@/models/Payroll';
import Employee from '@/models/Employee';

export const runtime = 'nodejs';

// GET payroll records
export async function GET(request: NextRequest) {
  try {
    await dbConnectHR();

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const companyId = searchParams.get('companyId');

    if (!month || !year) {
      return NextResponse.json(
        { success: false, error: 'Month and year are required' },
        { status: 400 }
      );
    }

    let query: any = {
      month: parseInt(month),
      year: parseInt(year),
    };

    // If companyId is provided, filter by company's employees
    if (companyId) {
      const companyEmployees = await Employee.find({ companyId }).select('_id');
      const employeeIds = companyEmployees.map(emp => emp._id);
      query.employeeId = { $in: employeeIds };
    }

    const payrolls = await Payroll.find(query)
      .populate('employeeId', 'employeeId firstName lastName department companyId')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      payrolls,
    });
  } catch (error: any) {
    console.error('Error fetching payrolls:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch payrolls' },
      { status: 500 }
    );
  }
}

// POST create payroll (single or batch)
export async function POST(request: NextRequest) {
  try {
    await dbConnectHR();

    const body = await request.json();

    // Check if this is a batch request
    if (body.payrollRecords && Array.isArray(body.payrollRecords)) {
      // Batch creation
      const results = [];
      const errors = [];

      for (const record of body.payrollRecords) {
        const {
          employeeId,
          month,
          year,
          basicSalary,
          allowances = 0,
          deductions = 0,
          bonus = 0,
          paymentDate,
          notes,
        } = record;

        // Validate required fields
        if (!employeeId || !month || !year || basicSalary === undefined) {
          errors.push({ employeeId, error: 'Missing required fields' });
          continue;
        }

        // Check if payroll already exists
        const existingPayroll = await Payroll.findOne({
          employeeId,
          month,
          year,
        });

        if (existingPayroll) {
          errors.push({ employeeId, error: 'Payroll already exists for this period' });
          continue;
        }

        // Calculate total salary
        const totalSalary = basicSalary + allowances + bonus - deductions;

        // Create payroll data
        const payrollData = {
          employeeId,
          month,
          year,
          baseSalary: basicSalary,
          allowances,
          deductions,
          bonus,
          totalSalary,
          status: 'pending' as const,
          paidAt: paymentDate ? new Date(paymentDate) : undefined,
        };

        console.log('Creating payroll with data:', payrollData);

        const payroll = await Payroll.create(payrollData);

        results.push(payroll);
      }

      return NextResponse.json({
        success: true,
        message: `Created ${results.length} payroll records`,
        payrolls: results,
        errors: errors.length > 0 ? errors : undefined,
      });
    } else {
      // Single creation
      const {
        employeeId,
        month,
        year,
        basicSalary,
        allowances = 0,
        deductions = 0,
        bonus = 0,
        paymentDate,
      } = body;

      // Validate required fields
      if (!employeeId || !month || !year || !basicSalary) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields' },
          { status: 400 }
        );
      }

      // Check if payroll already exists for this employee in this month/year
      const existingPayroll = await Payroll.findOne({
        employeeId,
        month,
        year,
      });

      if (existingPayroll) {
        return NextResponse.json(
          { success: false, error: 'Payroll already exists for this period' },
          { status: 400 }
        );
      }

      // Calculate total salary
      const totalSalary = basicSalary + allowances + bonus - deductions;

      // Create payroll
      const payroll = await Payroll.create({
        employeeId,
        month,
        year,
        baseSalary: basicSalary,
        allowances,
        deductions,
        bonus,
        totalSalary,
        status: 'pending',
        paidAt: paymentDate ? new Date(paymentDate) : undefined,
      });

      return NextResponse.json({
        success: true,
        payroll,
      });
    }
  } catch (error: any) {
    console.error('Error creating payroll:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create payroll' },
      { status: 500 }
    );
  }
}
