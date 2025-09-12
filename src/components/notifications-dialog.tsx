
'use client';
import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
} from '@/components/ui/sidebar';
import { Bell, User, Calendar, MessageSquare, Check, X, ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { useDataStore, LeaveRequest, ScheduleEntry } from '@/lib/data-store';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { generateTimetable } from '@/lib/timetable-generator';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const LeaveRequestDetail = ({ request, onBack, onApprove }: { request: LeaveRequest; onBack: () => void; onApprove: (id: string) => void; }) => {
    const { timetable } = generateTimetable(); // Using the synchronous mock
    
    const affectedClasses = timetable.filter(
        entry => entry.facultyName === request.facultyName
    );

    const classesByCourse = affectedClasses.reduce((acc, entry) => {
        if (!acc[entry.courseName]) {
            acc[entry.courseName] = 0;
        }
        acc[entry.courseName]++;
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.keys(classesByCourse).map(key => ({
        name: key,
        value: classesByCourse[key]
    }));

  return (
    <div>
        <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
                <ChevronLeft />
            </Button>
            <DialogTitle>Leave Request Details</DialogTitle>
        </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Request Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="flex items-center gap-3">
                        <User className="size-4 text-muted-foreground" />
                        <span><strong>From:</strong> {request.facultyName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Calendar className="size-4 text-muted-foreground" />
                        <span><strong>Dates:</strong> {format(request.startDate, 'PPP')} to {format(request.endDate, 'PPP')}</span>
                    </div>
                    <div className="flex items-start gap-3">
                        <MessageSquare className="size-4 text-muted-foreground mt-1" />
                        <div className="flex-1">
                            <strong>Reason:</strong>
                            <p className="text-muted-foreground">{request.reason}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
             <div className="mt-4 flex gap-2">
                <Button className="w-full" onClick={() => onApprove(request.id)}>
                    <Check className="mr-2" />Approve
                </Button>
                <Button variant="destructive" className="w-full">
                    <X className="mr-2" />Reject
                </Button>
            </div>
        </div>
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Impact on Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                    {affectedClasses.length > 0 ? (
                        <>
                         <p className="text-sm text-muted-foreground mb-4">This leave will affect {affectedClasses.length} classes.</p>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                        </>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-12">This faculty member has no scheduled classes during this period.</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};


export function NotificationsDialog() {
  const { leaveRequests, updateLeaveRequestStatus } = useDataStore();
  const [selectedRequest, setSelectedRequest] = React.useState<LeaveRequest | null>(null);
  const { toast } = useToast();

  const pendingRequests = leaveRequests.filter(lr => lr.status === 'pending');
  const unreadCount = pendingRequests.length;
  
  const handleApprove = (id: string) => {
    updateLeaveRequestStatus(id, 'approved');
    toast({
        title: "Leave Approved",
        description: "The teacher's leave has been approved. Regenerate the timetable to apply changes.",
    });
    setSelectedRequest(null); // Go back to the list
  }
  
  const onOpenChange = (open: boolean) => {
    if (!open) {
        setSelectedRequest(null);
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange}>
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
      <DialogContent className={selectedRequest ? "sm:max-w-3xl" : "sm:max-w-md"}>
        {!selectedRequest ? (
          <>
            <DialogHeader>
              <DialogTitle>Notifications</DialogTitle>
              <DialogDescription>
                {unreadCount > 0
                  ? `You have ${unreadCount} new leave requests to review.`
                  : 'No new notifications.'}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              {pendingRequests.length > 0 ? pendingRequests.map(request => (
                <div
                  key={request.id}
                  className="flex items-start gap-4 p-4 rounded-lg border cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedRequest(request)}
                >
                  <Calendar className="size-5 text-blue-500" />
                  <div className="flex-1">
                    <p className="font-semibold">Leave Request from {request.facultyName}</p>
                    <p className="text-sm text-muted-foreground">
                      For dates: {format(request.startDate, 'MMM d')} - {format(request.endDate, 'MMM d')}
                    </p>
                  </div>
                </div>
              )) : (
                 <div className="text-center text-muted-foreground py-12">
                    <Bell className="mx-auto size-12" />
                    <p className="mt-4">All caught up!</p>
                </div>
              )}
            </div>
            <DialogFooter>
                <Button variant="outline">Clear All</Button>
            </DialogFooter>
          </>
        ) : (
          <LeaveRequestDetail request={selectedRequest} onBack={() => setSelectedRequest(null)} onApprove={handleApprove} />
        )}
      </DialogContent>
    </Dialog>
  );
}
