import Navbar from '@/app/Navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Calendar Tracking',
  description:
    'Calendar Tracking is a simple web application that allows users to track events',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <div className='p-4 container'>{children}</div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
