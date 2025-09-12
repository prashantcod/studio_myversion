
import Link from 'next/link';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  FileText
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
} from '@/components/ui/sidebar';
import {Button} from '@/components/ui/button';
import {UserNav} from '@/components/user-nav';
import {Logo} from '@/components/logo';

export default function StudentLayout({children}: {children: React.ReactNode}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Button variant="ghost" className="-ml-2 flex items-center gap-2">
            <Logo className="text-primary" />
            <span className="font-headline text-lg font-semibold">
              NEP Timetable AI
            </span>
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/student/dashboard"
                asChild
                isActive
                tooltip="Dashboard"
              >
                <Link href="/student/dashboard">
                  <LayoutDashboard />
                  Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarGroup>
                 <SidebarMenuItem>
                    <SidebarMenuButton href="/student/dashboard" asChild tooltip="View Timetable">
                        <Link href="/student/dashboard">
                            <Calendar />
                            My Timetable
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton href="/student/dashboard" asChild tooltip="View Materials">
                        <Link href="/student/dashboard">
                            <FileText />
                            Materials
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
             </SidebarGroup>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-background p-4 sm:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex flex-1 items-center justify-end">
            <UserNav userType="student" />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:px-6 sm:py-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
