
import Link from 'next/link';
import {
  BookCopy,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Users,
  Wand2,
  DoorOpen,
  ClipboardEdit,
  Calendar,
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
import { DataEntryDialog } from '@/components/data-entry-dialog';
import { FacultyDialog } from '@/components/faculty-dialog';
import { GenerateTimetableDialog } from '@/components/generate-timetable-dialog';
import { StudentDialog } from '@/components/student-dialog';
import { CoursesDialog } from '@/components/courses-dialog';
import { RoomsDialog } from '@/components/rooms-dialog';

export default function AppLayout({children}: {children: React.ReactNode}) {
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
                href="/dashboard"
                asChild
                isActive
                tooltip="Dashboard"
              >
                <Link href="/dashboard">
                  <LayoutDashboard />
                  Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarGroup>
              <SidebarGroupLabel>Data Management</SidebarGroupLabel>
              <DataEntryDialog />
              <CoursesDialog />
              <FacultyDialog />
              <StudentDialog />
              <RoomsDialog />
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Core</SidebarGroupLabel>
              <GenerateTimetableDialog />
              <SidebarMenuItem>
                <SidebarMenuButton href="/timetable" asChild tooltip="View Timetable">
                  <Link href="/timetable">
                    <Calendar />
                    View Timetable
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
            <UserNav userType="admin" />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:px-6 sm:py-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
