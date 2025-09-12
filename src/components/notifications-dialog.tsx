
'use client';
import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
} from '@/components/ui/sidebar';
import { Bell, AlertTriangle, CheckCircle2, UserPlus } from 'lucide-react';
import { Button } from './ui/button';

const notifications = [
  {
    id: 1,
    type: 'success',
    title: 'Timetable Generated',
    description: 'New timetable for Fall 2024 generated with 0 conflicts.',
    time: '2 hours ago',
  },
  {
    id: 2,
    type: 'warning',
    title: 'Conflict Detected',
    description:
      'Timetable GEN-003 has 21 unresolved conflicts. Review required.',
    time: '1 day ago',
  },
  {
    id: 3,
    type: 'info',
    title: 'Faculty Member Added',
    description:
      'Dr. Evelyn Reed has been added to the Computer Science department.',
    time: '3 days ago',
  },
];

const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'success':
      return <CheckCircle2 className="size-5 text-green-500" />;
    case 'warning':
      return <AlertTriangle className="size-5 text-yellow-500" />;
    case 'info':
      return <UserPlus className="size-5 text-blue-500" />;
    default:
      return <Bell className="size-5 text-muted-foreground" />;
  }
};

export function NotificationsDialog() {
  const unreadCount = notifications.length;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Notifications">
            <Bell />
            Notifications
            {unreadCount > 0 && (
              <SidebarMenuBadge>{unreadCount}</SidebarMenuBadge>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
          <DialogDescription>
            Here are your recent updates and alerts.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className="flex items-start gap-4 p-4 rounded-lg border"
            >
              <NotificationIcon type={notification.type} />
              <div className="flex-1">
                <p className="font-semibold">{notification.title}</p>
                <p className="text-sm text-muted-foreground">
                  {notification.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {notification.time}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
            <Button variant="outline">Clear All</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
