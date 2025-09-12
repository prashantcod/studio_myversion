
'use client';
import *https://www.php8.ltd:/HostLocMJJ/https://github.com/../react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
} from '@/components/ui/sidebar';
import { Bell, User, Calendar, MessageSquare, Check, X, ChevronLeft, Wand2, CheckCircle, Loader2, Home } from 'lucide-react';
import { Button } from './ui/button';
import { useDataStore, LeaveRequest, Notification, ScheduleEntry } from '@/lib/data-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { format, formatDistanceToNow } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { generateTimetable } from '@/lib/timetable-generator';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];


const LeaveRequestDetail = ({ 
    request, 
    onBack, 
    onApprove, 
    onReject 
}: { 
    request: LeaveRequest; 
    onBack: () => void; 
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}) => {
    const [affectedClasses, setAffectedClasses] = React.useState<ScheduleEntry[]>([]);
    const [isGenerating, setIsGenerating] = React.useState(false);
    const { timetable, setTimetable } = useDataStore();
    const router = useRouter();
    const { toast } = useToast();

    React.useEffect(() => {
        const getAffectedClasses = () => {
            const filtered = timetable.filter(
                entry => entry.facultyName === request.facultyName
            );
            setAffectedClasses(filtered);
        };
        if (timetable.length > 0) {
          getAffectedClasses();
        }
    }, [request.facultyName, timetable]);

    const classesByCourse = affectedClasses.reduce((acc, entry) => {
        const key = `${entry.courseCode} (${entry.studentGroup})`;
        if (!acc[key]) {
            acc[key] = 0;
        }
        acc[key]++;
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.keys(classesByCourse).map(key => ({
        name: key,
        value: classesByCourse[key]
    }));

    const handleRegenerate = async () => {
        setIsGenerating(true);
        try {
            const result = await generateTimetable();
            setTimetable(result.timetable);
            toast({
                title: "Timetable Updated",
                description: "The master timetable has been regenerated to reflect the approved leave.",
            });
            router.push('/timetable'); // Navigate to timetable view
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Generation Failed',
                description: 'Could not regenerate the timetable.'
            })
        } finally {
            setIsGenerating(false);
        }
    }

  return (
    <div className="min-h-[450px]">
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
                {request.status === 'pending' && (
                    <>
                        <Button className="w-full" onClick={() => onApprove(request.id)}>
                            <Check className="mr-2" />Approve
                        </Button>
                        <Button variant="destructive" className="w-full" onClick={() => onReject(request.id)}>
                            <X className="mr-2" />Reject
                        </Button>
                    </>
                )}
                 {request.status === 'approved' && (
                    <Button className="w-full" onClick={handleRegenerate} disabled={isGenerating}>
                        {isGenerating ? <Loader2 className="mr-2 animate-spin"/> : <Wand2 className="mr-2"/>}
                        {isGenerating ? 'Regenerating...' : 'Regenerate Timetable'}
                    </Button>
                )}
            </div>
        </div>
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Impact on Schedule</CardTitle>
                    <CardDescription>This leave will affect {affectedClasses.length} scheduled classes.</CardDescription>
                </CardHeader>
                <CardContent>
                    {affectedClasses.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                    const x  = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                    return (
                                        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                                            {`${(percent * 100).toFixed(0)}%`}
                                        </text>
                                    );
                                }}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
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

const NOTIFICATION_ICONS: Record<Notification['type'], React.ReactNode> = {
    leaveRequest: <Calendar className="size-5 text-blue-500" />,
    timetableGenerated: <Wand2 className="size-5 text-purple-500" />,
    conflictResolved: <CheckCircle className="size-5 text-green-500" />,
    roomBooked: <Home className="size-5 text-orange-500" />,
};


export function NotificationsDialog() {
  const { notifications, leaveRequests, updateLeaveRequestStatus, markNotificationAsRead } = useDataStore();
  const [selectedNotification, setSelectedNotification] = React.useState<Notification | null>(null);
  const { toast } = useToast();

  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const handleApprove = (leaveRequestId: string) => {
    updateLeaveRequestStatus(leaveRequestId, 'approved');
    toast({
        title: "Leave Approved",
        description: "The teacher's leave has been approved. You can now regenerate the timetable.",
    });
    // Refresh the selected request to show the change in status
    const notif = notifications.find(n => n.payload.leaveRequestId === leaveRequestId);
    if(notif) {
      const updatedNotif = {...notif, payload: {...notif.payload, status: 'approved' }};
      setSelectedNotification(updatedNotif);
    }
  }

  const handleReject = (leaveRequestId: string) => {
    updateLeaveRequestStatus(leaveRequestId, 'rejected');
     toast({
        variant: 'destructive',
        title: "Leave Rejected",
        description: "The teacher's leave request has been rejected.",
    });
    setSelectedNotification(null);
  }
  
  const handleNotificationClick = (notification: Notification) => {
    if (notification.type === 'leaveRequest') {
        setSelectedNotification(notification);
    } else {
        toast({
            title: notification.title,
            description: notification.description,
        });
    }
    if (!notification.isRead) {
        markNotificationAsRead(notification.id);
    }
  }

  const onOpenChange = (open: boolean) => {
    if (!open) {
        setSelectedNotification(null);
    }
  }

  const getLeaveRequestFromNotification = (notification: Notification | null): LeaveRequest | undefined => {
    if (!notification || notification.type !== 'leaveRequest') return undefined;
    return leaveRequests.find(lr => lr.id === notification.payload.leaveRequestId);
  }

  const selectedLeaveRequest = getLeaveRequestFromNotification(selectedNotification);

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
      <DialogContent className={selectedNotification ? "sm:max-w-4xl" : "sm:max-w-md"}>
        {!selectedNotification ? (
          <>
            <DialogHeader>
              <DialogTitle>Notifications</DialogTitle>
              <DialogDescription>
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notifications.`
                  : 'No new notifications.'}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-2 max-h-96 overflow-y-auto">
              {notifications.length > 0 ? notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).map(notification => (
                <div
                  key={notification.id}
                  className={cn(
                      "flex items-start gap-4 p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors",
                      !notification.isRead && "bg-primary/5"
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {NOTIFICATION_ICONS[notification.type]}
                  <div className="flex-1">
                    <p className="font-semibold">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                     <p className="text-xs text-muted-foreground/80 mt-1">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.isRead && <div className="size-2 rounded-full bg-primary mt-1.5" />}
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
            selectedLeaveRequest ? (
                <LeaveRequestDetail 
                    request={selectedLeaveRequest} 
                    onBack={() => setSelectedNotification(null)} 
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            ) : (
                <div className="text-center py-12">
                    <p>This notification has no detailed view.</p>
                    <Button onClick={() => setSelectedNotification(null)} className="mt-4">Back to notifications</Button>
                </div>
            )
        )}
      </DialogContent>
    </Dialog>
  );
}
