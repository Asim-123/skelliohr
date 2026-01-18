import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPayroll extends Document {
  employeeId: mongoose.Types.ObjectId;
  month: number;
  year: number;
  baseSalary: number;
  allowances: number;
  deductions: number;
  bonus?: number;
  totalSalary: number;
  status: 'pending' | 'paid' | 'cancelled';
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PayrollSchema = new Schema({
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  month: { type: Number, required: true, min: 1, max: 12 },
  year: { type: Number, required: true },
  baseSalary: { type: Number, required: true },
  allowances: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  bonus: Number,
  totalSalary: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'cancelled'], 
    default: 'pending' 
  },
  paidAt: Date,
}, { timestamps: true });

// Delete the model if it exists to avoid caching issues
if (mongoose.models.Payroll) {
  delete mongoose.models.Payroll;
}

const Payroll = mongoose.model<IPayroll>('Payroll', PayrollSchema);

export default Payroll;
