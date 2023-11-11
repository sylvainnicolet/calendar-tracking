import Navbar from '@/app/Navbar';
import { ThemeProvider } from '@/components/theme-provider';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Calendar events App',
  description: 'Display events from a calendar',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <div className='p-4 container'>{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
