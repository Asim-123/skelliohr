export interface HRUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role?: 'hr_admin' | 'hr_manager' | 'hr_staff';
  companyId?: string;
}

export interface Company {
  _id: string;
  name: string;
  industry: string;
  size: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
}

export interface Employee {
  _id: string;
  companyId: string;
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
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface Attendance {
  _id: string;
  employeeId: string;
  date: Date;
  checkIn: Date;
  checkOut?: Date;
  status: 'present' | 'absent' | 'late' | 'half_day';
  notes?: string;
}

export interface Leave {
  _id: string;
  employeeId: string;
  type: 'sick' | 'vacation' | 'personal' | 'maternity' | 'paternity';
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
}

export interface Payroll {
  _id: string;
  employeeId: string;
  month: number;
  year: number;
  baseSalary: number;
  allowances: number;
  deductions: number;
  bonus?: number;
  totalSalary: number;
  status: 'pending' | 'paid' | 'cancelled';
  paidAt?: Date;
}
