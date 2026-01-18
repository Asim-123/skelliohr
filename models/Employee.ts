import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEmployee extends Document {
  companyId: mongoose.Types.ObjectId;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  dateOfJoining: Date;
  dateOfBirth: Date;
  address: string;
  salary: number;
  status: 'active' | 'inactive' | 'terminated';
  firebaseUid?: string;
  passwordChanged?: boolean;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  documents: Array<{
    type: string;
    url: string;
    uploadedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  employeeId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  position: { type: String, required: true },
  dateOfJoining: { type: Date, required: true },
  dateOfBirth: { type: Date, required: true },
  address: { type: String, required: true },
  salary: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'terminated'], 
    default: 'active' 
  },
  firebaseUid: { type: String, sparse: true },
  passwordChanged: { type: Boolean, default: false },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
  },
  documents: [{
    type: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

let Employee: Model<IEmployee>;

try {
  Employee = mongoose.model<IEmployee>('Employee');
} catch {
  Employee = mongoose.model<IEmployee>('Employee', EmployeeSchema);
}

export default Employee;
