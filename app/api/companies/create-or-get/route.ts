import { NextRequest, NextResponse } from 'next/server';
import dbConnectHR from '@/lib/mongodb-hr';
import Company from '@/models/Company';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    await dbConnectHR();

    const { name, industry, size, phone, address, email, website } = await request.json();

    if (!name || !industry || !size) {
      return NextResponse.json(
        { error: 'Missing required fields (name, industry, size)' },
        { status: 400 }
      );
    }

    // Check if company with this name already exists
    let company = await Company.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } // Case-insensitive match
    });

    if (company) {
      // Company exists, return it
      return NextResponse.json({
        success: true,
        company,
        message: 'Company already exists',
      });
    }

    // Create new company
    company = await Company.create({
      name: name.trim(),
      industry,
      size,
      phone: phone || '+0000000000',
      address: address || 'Not provided',
      email: email || 'info@company.com',
      website: website || '',
    });

    return NextResponse.json({
      success: true,
      company,
      message: 'Company created successfully',
    });
  } catch (error: any) {
    console.error('Error creating/getting company:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
