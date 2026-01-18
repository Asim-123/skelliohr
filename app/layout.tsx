import { HRAuthProvider } from '@/contexts/HRAuthContext';
import './globals.css';

export const metadata = {
  title: 'HR Management System - Skellio',
  description: 'Human Resources Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        
        <HRAuthProvider>
          {children}
        </HRAuthProvider>
      </body>
    </html>
  );
}
