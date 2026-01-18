import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  industry: string;
  size: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  subscriptionStatus?: string;
  subscriptionPlan?: string;
  lastPaymentDate?: Date;
  nextBillingDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema({
  name: { type: String, required: true },
  industry: { type: String, required: true },
  size: { 
    type: String, 
    enum: ['1-10', '11-50', '51-200', '201-500', '500+'], 
    required: true 
  },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  website: String,
  logo: String,
  subscriptionStatus: { 
    type: String, 
    enum: ['free', 'active', 'payment_failed', 'cancelled'], 
    default: 'free' 
  },
  subscriptionPlan: { 
    type: String, 
    enum: ['free', 'growth', 'enterprise'], 
    default: 'free' 
  },
  lastPaymentDate: Date,
  nextBillingDate: Date,
}, { timestamps: true });

let Company: Model<ICompany>;

try {
  Company = mongoose.model<ICompany>('Company');
} catch {
  Company = mongoose.model<ICompany>('Company', CompanySchema);
}

export default Company;
