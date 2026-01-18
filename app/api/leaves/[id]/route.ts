import { NextRequest, NextResponse } from 'next/server';
import dbConnectHR from '@/lib/mongodb-hr';
import Leave from '@/models/Leave';

export const runtime = 'nodejs';

// PATCH update leave status (approve/reject)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnectHR();

    const { id } = params;
    const body = await request.json();
    const { status, approvedBy, rejectionReason } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      );
    }

    const updateData: any = {
      status,
    };

    // Only add approvedBy if it's a valid ObjectId
    if (approvedBy && approvedBy.length === 24) {
      updateData.approvedBy = approvedBy;
    }

    if (status === 'approved') {
      updateData.approvedAt = new Date();
    }

    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const leave = await Leave.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!leave) {
      return NextResponse.json(
        { success: false, error: 'Leave request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      leave,
    });
  } catch (error: any) {
    console.error('Error updating leave:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update leave' },
      { status: 500 }
    );
  }
}

// DELETE leave request
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnectHR();

    const { id } = params;

    const leave = await Leave.findByIdAndDelete(id);

    if (!leave) {
      return NextResponse.json(
        { success: false, error: 'Leave request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Leave request deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting leave:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete leave' },
      { status: 500 }
    );
  }
}
