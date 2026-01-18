import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILeave extends Document {
  employeeId: mongoose.Types.ObjectId;
  type: 'sick' | 'vacation' | 'personal' | 'maternity' | 'paternity';
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LeaveSchema = new Schema({
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  type: { 
    type: String, 
    enum: ['sick', 'vacation', 'personal', 'maternity', 'paternity'], 
    required: true 
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  days: { type: Number, required: true },
  reason: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'HRUser' },
  approvedAt: Date,
}, { timestamps: true });

let Leave: Model<ILeave>;

try {
  Leave = mongoose.model<ILeave>('Leave');
} catch {
  Leave = mongoose.model<ILeave>('Leave', LeaveSchema);
}

export default Leave;
