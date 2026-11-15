import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'سهند لیزر | تجهیزات و ماشین‌آلات لیزری صنعتی',
  description: 'راهکارهای برش، جوش، حکاکی و تمیزکاری لیزری صنعتی سهند لیزر',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fa" dir="rtl" suppressHydrationWarning><body>{children}</body></html>;
}
