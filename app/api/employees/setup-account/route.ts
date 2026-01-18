import { NextRequest, NextResponse } from 'next/server';
import dbConnectHR from '@/lib/mongodb-hr';
import Employee from '@/models/Employee';

export const runtime = 'nodejs';

// Generate a random temporary password
function generateTemporaryPassword(): string {
  const length = 10;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

export async function POST(request: NextRequest) {
  try {
    await dbConnectHR();

    const { employeeId, email, password } = await request.json();

    if (!employeeId || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify employee exists
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Use provided password or generate temporary one
    const accountPassword = password || generateTemporaryPassword();

    // Create Firebase account using Admin SDK would be ideal here
    // But since we're using client SDK, we'll return the password
    // and let the client create the account
    
    // For now, we'll use a workaround: call Firebase Admin API
    // or use the client SDK from a server action
    
    // Alternative: Store the temporary password in the database
    // and let the employee use it on first login
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.NEXT_PUBLIC_FIREBASE_HR_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: accountPassword,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return NextResponse.json(
        { success: false, error: data.error.message || 'Failed to create Firebase account' },
        { status: 400 }
      );
    }

    // Update employee with Firebase UID
    employee.firebaseUid = data.localId;
    await employee.save();

    return NextResponse.json({
      success: true,
      password: accountPassword,
      message: 'Employee account created successfully',
    });
  } catch (error: any) {
    console.error('Error setting up employee account:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to setup employee account' },
      { status: 500 }
    );
  }
}
