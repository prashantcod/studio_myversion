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
  User,
  BookOpen,
  Scale,
  FileText,
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

export default function TeacherLayout({children}: {children: React.ReactNode}) {
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
          <SidebarMenu className="TeacherSection">
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/teacher/dashboard"
                asChild
                isActive
                tooltip="Dashboard"
              >
                <Link href="/teacher/dashboard">
                  <LayoutDashboard />
                  Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarGroup>
              <SidebarGroupLabel>My Profile</SidebarGroupLabel>
              <SidebarMenuItem>
                <SidebarMenuButton
                  href="/teacher/dashboard"
                  asChild
                  tooltip="Basic Info"
                >
                  <Link href="/teacher/dashboard">
                    <User />
                    Basic Info
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Academics</SidebarGroupLabel>
              <SidebarMenuItem>
                <SidebarMenuButton
                  href="/teacher/dashboard"
                  asChild
                  tooltip="My Courses"
                >
                  <Link href="/teacher/dashboard">
                    <BookOpen />
                    My Courses
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  href="/teacher/dashboard"
                  asChild
                  tooltip="Materials"
                >
                  <Link href="/teacher/dashboard">
                    <FileText />
                    Materials
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Guidelines</SidebarGroupLabel>
              <SidebarMenuItem>
                <SidebarMenuButton
                  href="/teacher/dashboard"
                  asChild
                  tooltip="NEP Rules"
                >
                  <Link href="/teacher/dashboard">
                    <Scale />
                    NEP Rules
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
            <UserNav userType="teacher" />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:px-6 sm:py-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
