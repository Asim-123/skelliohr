import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAttendance extends Document {
  employeeId: mongoose.Types.ObjectId;
  date: Date;
  checkIn: Date;
  checkOut?: Date;
  status: 'present' | 'absent' | 'late' | 'half_day';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new Schema({
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, required: true },
  checkIn: { type: Date, required: true },
  checkOut: Date,
  status: { 
    type: String, 
    enum: ['present', 'absent', 'late', 'half_day'], 
    default: 'present' 
  },
  notes: String,
}, { timestamps: true });

let Attendance: Model<IAttendance>;

try {
  Attendance = mongoose.model<IAttendance>('Attendance');
} catch {
  Attendance = mongoose.model<IAttendance>('Attendance', AttendanceSchema);
}

export default Attendance;
