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
  Bell,
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
import { DataEntryDialog } from '@/components/data-entry-dialog';
import { FacultyDialog } from '@/components/faculty-dialog';
import { GenerateTimetableDialog } from '@/components/generate-timetable-dialog';
import { StudentDialog } from '@/components/student-dialog';
import { CoursesDialog } from '@/components/courses-dialog';
import { NepRulesDialog } from '@/components/nep-rules-dialog';
import { NotificationsDialog } from '@/components/notifications-dialog';
import { RoomsDialog } from '@/components/rooms-dialog';

export default function AdminLayout({children}: {children: React.ReactNode}) {
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
              <NotificationsDialog />
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="View Timetable">
                  <Link href="/timetable">
                    <Calendar />
                    View Timetable
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Guidelines</SidebarGroupLabel>
              <NepRulesDialog />
            </SidebarGroup>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center justify-between border-b bg-background px-3 sm:px-5">
            <SidebarTrigger className="md:hidden" />
            <div className="flex flex-1 items-center justify-end">
              <UserNav userType="admin" />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-3 sm:px-5">
            {children}
          </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
