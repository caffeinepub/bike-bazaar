import { type ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import ProfileSetup from './ProfileSetup';
import ProfileCompletionBanner from './ProfileCompletionBanner';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ProfileCompletionBanner />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <ProfileSetup />
    </div>
  );
}
