import { NextRequest, NextResponse } from 'next/server';
import dbConnectHR from '@/lib/mongodb-hr';
import HRUser from '@/models/HRUser';
import Company from '@/models/Company';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    await dbConnectHR();

    const { firebaseUid, email } = await request.json();

    if (!firebaseUid || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find user in HR database (no need to populate company)
    const user = await HRUser.findOne({ firebaseUid });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Please contact your administrator to set up your HR account.' },
        { status: 404 }
      );
    }

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
    console.error('Error syncing HR user:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
