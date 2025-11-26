"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { MobileNav } from "@/components/layout/MobileNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden lg:flex" />

        {/* Top Bar */}
        <TopBar showMenuButton />

        {/* Main Content */}
        <main className="lg:pl-64 pt-16 pb-20 lg:pb-6">
          <div className="p-4 lg:p-6">{children}</div>
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNav className="lg:hidden" />
      </div>
    </AuthGuard>
  );
}
