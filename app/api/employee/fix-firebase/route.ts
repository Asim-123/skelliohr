import { NextRequest, NextResponse } from 'next/server';
import dbConnectHR from '@/lib/mongodb-hr';
import Employee from '@/models/Employee';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    await dbConnectHR();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find employee by email
    const employee = await Employee.findOne({ email });

    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found in database' },
        { status: 404 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_HR_API_KEY;

    // Try to sign in with Firebase to get the UID
    const signInResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    const signInData = await signInResponse.json();

    if (signInData.error) {
      // Firebase account doesn't exist, create it
      console.log('Firebase account not found, creating new one');
      
      const createResponse = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true,
          }),
        }
      );

      const createData = await createResponse.json();

      if (createData.error) {
        return NextResponse.json(
          { success: false, error: `Failed to create Firebase account: ${createData.error.message}` },
          { status: 400 }
        );
      }

      // Update employee with Firebase UID
      employee.firebaseUid = createData.localId;
      employee.passwordChanged = false;
      await employee.save();

      return NextResponse.json({
        success: true,
        message: 'Firebase account created and linked to employee',
        firebaseUid: createData.localId,
        action: 'created',
      });
    }

    // Firebase account exists, just link it
    console.log('Firebase account found, linking to employee');
    employee.firebaseUid = signInData.localId;
    await employee.save();

    return NextResponse.json({
      success: true,
      message: 'Firebase account linked to employee',
      firebaseUid: signInData.localId,
      action: 'linked',
    });
  } catch (error: any) {
    console.error('Error fixing employee Firebase account:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fix Firebase account' },
      { status: 500 }
    );
  }
}
