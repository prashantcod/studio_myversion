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
              <SidebarMenuItem>
                <SidebarMenuButton href="/dashboard" asChild tooltip="Data Entry">
                  <Link href="/dashboard">
                    <ClipboardEdit />
                    Data Entry
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/dashboard" asChild tooltip="Courses">
                  <Link href="/dashboard">
                    <BookCopy />
                    Courses
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/teacher/dashboard" asChild tooltip="Faculty">
                  <Link href="/teacher/dashboard">
                    <Users />
                    Faculty
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/dashboard" asChild tooltip="Students">
                  <Link href="/dashboard">
                    <GraduationCap />
                    Students
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/dashboard" asChild tooltip="Rooms">
                  <Link href="/dashboard">
                    <DoorOpen />
                    Rooms & Labs
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Core</SidebarGroupLabel>
              <SidebarMenuItem>
                <SidebarMenuButton href="/dashboard" asChild tooltip="Generate">
                  <Link href="/dashboard">
                    <Wand2 />
                    Generate Timetable
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
            <UserNav />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:px-6 sm:py-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
