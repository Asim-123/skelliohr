import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHRUser extends Document {
  firebaseUid: string;
  email: string;
  displayName: string;
  role: 'hr_admin' | 'hr_manager' | 'hr_staff';
  companyId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const HRUserSchema = new Schema({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['hr_admin', 'hr_manager', 'hr_staff'], 
    default: 'hr_staff' 
  },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
}, { timestamps: true });

let HRUser: Model<IHRUser>;

try {
  HRUser = mongoose.model<IHRUser>('HRUser');
} catch {
  HRUser = mongoose.model<IHRUser>('HRUser', HRUserSchema);
}

export default HRUser;
