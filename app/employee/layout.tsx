import { EmployeeAuthProvider } from '@/contexts/EmployeeAuthContext';

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EmployeeAuthProvider>
      {children}
    </EmployeeAuthProvider>
  );
}
