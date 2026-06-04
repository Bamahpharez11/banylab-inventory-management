import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Banylab Inventory Management System',
  description: 'Manage lab supplies, suppliers, and customers efficiently.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
