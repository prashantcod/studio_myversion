import Link from 'next/link';
import {
  BookOpen,
  CalendarOff,
  FileText,
  LayoutDashboard,
  Scale,
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
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import {Button} from '@/components/ui/button';
import {UserNav} from '@/components/user-nav';
import {Logo} from '@/components/logo';
import {OnLeaveDialog} from '@/components/on-leave-dialog';
import { NepRulesDialog } from '@/components/nep-rules-dialog';
import AuthGuard from '@/components/auth-guard';

export default function TeacherLayout({children}: {children: React.ReactNode}) {
  return (
    <SidebarProvider>
      <AuthGuard allowedRole="teacher">
        <Sidebar>
          <SidebarHeader className="h-12 px-3">
            <Button variant="ghost" className="-ml-2 flex h-8 items-center gap-1.5 px-2">
              <Logo className="h-5 text-primary" />
              <span className="font-headline text-sm font-semibold">
                NEP Timetable AI
              </span>
            </Button>
          </SidebarHeader>
          <SidebarContent className="py-1.5">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive
                  tooltip="Dashboard"
                  className="gap-2.5 py-1.5"
                >
                  <Link href="/teacher/dashboard">
                    <LayoutDashboard className="size-4" />
                    <span className="text-sm">Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarGroup>
                <SidebarGroupLabel className="py-1.5 text-xs">Academics</SidebarGroupLabel>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip="My Courses"
                    className="gap-2.5 py-1.5"
                  >
                    <Link href="/teacher/dashboard">
                      <BookOpen className="size-4" />
                      <span className="text-sm">My Courses</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip="Materials"
                    className="gap-2.5 py-1.5"
                  >
                    <Link href="/teacher/dashboard">
                      <FileText className="size-4" />
                      <span className="text-sm">Materials</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <OnLeaveDialog />
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel className="py-1.5 text-xs">Guidelines</SidebarGroupLabel>
                <NepRulesDialog />
              </SidebarGroup>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-12 items-center justify-between border-b bg-background px-3 sm:px-5">
            <SidebarTrigger className="md:hidden" />
            <div className="flex flex-1 items-center justify-end">
              <UserNav userType="teacher" />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-3 sm:px-5">
            {children}
          </main>
        </SidebarInset>
      </AuthGuard>
    </SidebarProvider>
  );
}
