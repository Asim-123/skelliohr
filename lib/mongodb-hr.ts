import mongoose from 'mongoose';

const MONGODB_HR_URI = process.env.MONGODB_HR_URI!;

if (!MONGODB_HR_URI) {
  throw new Error('Please define the MONGODB_HR_URI environment variable inside .env.local');
}

interface MongooseHRCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseHR: MongooseHRCache | undefined;
}

let cached: MongooseHRCache = global.mongooseHR || { conn: null, promise: null };

if (!global.mongooseHR) {
  global.mongooseHR = cached;
}

async function dbConnectHR() {
  if (cached.conn) {
    console.log('✅ Using cached MongoDB HR connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('🔄 Connecting to MongoDB HR...');
    console.log('📍 URI:', MONGODB_HR_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')); // Hide password

    cached.promise = mongoose.connect(MONGODB_HR_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB HR connected successfully!');
      console.log('📊 Database:', mongoose.connection.db.databaseName);
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    console.error('❌ MongoDB HR connection failed:', e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnectHR;
