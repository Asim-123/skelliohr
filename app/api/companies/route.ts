import { NextRequest, NextResponse } from 'next/server';
import dbConnectHR from '@/lib/mongodb-hr';
import Company from '@/models/Company';

export const runtime = 'nodejs';

// GET all companies
export async function GET(request: NextRequest) {
  try {
    await dbConnectHR();

    const companies = await Company.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      companies,
    });
  } catch (error: any) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// POST create new company
export async function POST(request: NextRequest) {
  try {
    await dbConnectHR();

    const data = await request.json();

    const company = await Company.create(data);

    return NextResponse.json({
      success: true,
      company,
    });
  } catch (error: any) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
