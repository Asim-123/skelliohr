import { NextRequest, NextResponse } from 'next/server';
import dbConnectHR from '@/lib/mongodb-hr';
import HRUser from '@/models/HRUser';
import Company from '@/models/Company';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    await dbConnectHR();

    const { firebaseUid, email, displayName, companyId } = await request.json();

    if (!firebaseUid || !email || !displayName || !companyId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await HRUser.findOne({ firebaseUid });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Verify company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return NextResponse.json(
        { error: 'Invalid company ID' },
        { status: 400 }
      );
    }

    // Create new HR user with default role
    const user = await HRUser.create({
      firebaseUid,
      email,
      displayName,
      role: 'hr_staff', // Default role, can be changed by admin later
      companyId,
    });

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        companyId: user.companyId,
      },
    });
  } catch (error: any) {
    console.error('Error registering HR user:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
