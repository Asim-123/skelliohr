import { NextRequest, NextResponse } from 'next/server';
import dbConnectHR from '@/lib/mongodb-hr';
import Company from '@/models/Company';
import HRUser from '@/models/HRUser';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing database connection...');
    
    // Test connection
    const connection = await dbConnectHR();
    
    // Check if database connection is available
    if (!connection.connection.db) {
      throw new Error('Database connection not established');
    }
    
    // Get database stats
    const dbName = connection.connection.db.databaseName;
    const collections = await connection.connection.db.listCollections().toArray();
    
    // Count documents
    const companyCount = await Company.countDocuments();
    const userCount = await HRUser.countDocuments();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      database: {
        name: dbName,
        host: connection.connection.host,
        port: connection.connection.port,
        collections: collections.map(c => c.name),
        stats: {
          companies: companyCount,
          hrUsers: userCount,
        }
      }
    });
  } catch (error: any) {
    console.error('❌ Database test failed:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Database connection failed', 
        details: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}
