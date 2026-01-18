import { NextRequest, NextResponse } from 'next/server';
import dbConnectHR from '@/lib/mongodb-hr';
import Employee from '@/models/Employee';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    await dbConnectHR();

    const { email, newPassword, currentPassword, idToken } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Email and new password are required' },
        { status: 400 }
      );
    }

    // Find employee by email
    const employee = await Employee.findOne({ email });

    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_HR_API_KEY;

    // If employee doesn't have firebaseUid, we'll get it from Firebase when we sign in
    // This handles the case where the employee was created but Firebase setup failed

    // If we have an idToken, use it to update the password
    if (idToken) {
      console.log('Updating password using provided idToken');
      
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idToken: idToken,
            password: newPassword,
            returnSecureToken: true,
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        console.error('Firebase password update error:', data.error);
        return NextResponse.json(
          { success: false, error: data.error.message || 'Failed to update password in Firebase' },
          { status: 400 }
        );
      }

      // Mark password as changed in database
      employee.passwordChanged = true;
      await employee.save();

      return NextResponse.json({
        success: true,
        message: 'Password updated successfully',
        newIdToken: data.idToken,
      });
    }

    // If we have current password, sign in first to get idToken
    if (currentPassword) {
      const signInResponse = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            password: currentPassword,
            returnSecureToken: true,
          }),
        }
      );

      const signInData = await signInResponse.json();

      if (signInData.error) {
        return NextResponse.json(
          { success: false, error: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      // If employee doesn't have firebaseUid, save it now
      if (!employee.firebaseUid && signInData.localId) {
        employee.firebaseUid = signInData.localId;
        await employee.save();
      }

      // Now update the password
      const updateResponse = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idToken: signInData.idToken,
            password: newPassword,
            returnSecureToken: true,
          }),
        }
      );

      const updateData = await updateResponse.json();

      if (updateData.error) {
        return NextResponse.json(
          { success: false, error: updateData.error.message || 'Failed to update password' },
          { status: 400 }
        );
      }

      // Mark password as changed in database
      employee.passwordChanged = true;
      await employee.save();

      return NextResponse.json({
        success: true,
        message: 'Password updated successfully',
        newIdToken: updateData.idToken,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Either idToken or currentPassword is required' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error updating password:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update password' },
      { status: 500 }
    );
  }
}
