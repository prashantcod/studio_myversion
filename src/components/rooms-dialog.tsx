
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
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DoorOpen, Computer, Presentation, ChevronLeft, Clock, Calendar, User, Book } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SidebarMenuButton, SidebarMenuItem } from './ui/sidebar';
import { useDataStore, ScheduleEntry } from '@/lib/data-store';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import { format, addDays, startOfWeek } from 'date-fns';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = ["09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "14:00-15:00", "15:00-16:00", "16:00-17:00"];

type Room = {
  id: number;
  name: string;
  type: 'Classroom' | 'Labs' | 'Seminar Hall';
  capacity: number;
};

// Function to generate a somewhat random schedule for a room
const generateInitialSchedule = () => {
    const schedule: (ScheduleEntry | null)[][] = [];
    return schedule;
};


const initialRoomsData: Room[] = [
  // Classrooms
  { id: 1, name: '327 A', type: 'Classroom', capacity: 70 },
  { id: 2, name: '327 B', type: 'Classroom', capacity: 70 },
  { id: 3, name: '401', type: 'Classroom', capacity: 70 },
  { id: 4, name: '402', type: 'Classroom', capacity: 70 },
  { id: 5, name: '403', type: 'Classroom', capacity: 70 },
  { id: 6, name: '511 A', type: 'Classroom', capacity: 70 },
  { id: 7, name: '511 B', type: 'Classroom', capacity: 70 },
  { id: 8, name: '512', type: 'Classroom', capacity: 70 },
  { id: 9, name: 'LH-1', type: 'Classroom', capacity: 150 },
  { id: 10, name: 'LH-2', type: 'Classroom', capacity: 150 },
  // Labs
  { id: 11, name: 'CSE Lab 1', type: 'Labs', capacity: 60 },
  { id: 12, name: 'CSE Lab 2', type: 'Labs', capacity: 60 },
  { id: 13, name: 'ECE Lab 1', type: 'Labs', capacity: 60 },
  { id: 14, name: 'ECE Lab 2', type: 'Labs', capacity: 60 },
  { id: 15, name: 'ME Lab', type: 'Labs', capacity: 60 },
  { id: 16, name: 'Civil Lab', type: 'Labs', capacity: 60 },
  { id: 17, name: 'EEE Lab', type: 'Labs', capacity: 60 },
  { id: 18, name: 'Physics Lab', type: 'Labs', capacity: 60 },
  { id: 19, name: 'Chemistry Lab', type: 'Labs', capacity: 60 },
  { id: 20, name: 'IT Lab 3', type: 'Labs', capacity: 60 },
  // Seminar Hall
  { id: 21, name: 'Main Seminar Hall', type: 'Seminar Hall', capacity: 200 },
];


const RoomIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'Classroom': return <DoorOpen className="size-5 text-muted-foreground" />;
    case 'Labs': return <Computer className="size-5 text-muted-foreground" />;
    case 'Seminar Hall': return <Presentation className="size-5 text-muted-foreground" />;
    default: return null;
  }
};

const RoomDetailView = ({ room, onBack, onOccupy, schedule }: { room: Room, onBack: () => void, onOccupy: (day: string, timeSlot: string) => void, schedule: ScheduleEntry[] }) => {
    const today = new Date();
    const startOfTheWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday

    const roomSchedule = schedule.filter(entry => entry.roomId === room.name);
    
    const getBookingForSlot = (day: string, timeSlot: string) => {
        return roomSchedule.find(entry => entry.day === day && entry.timeSlot === timeSlot);
    }

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <Button variant="ghost" size="icon" onClick={onBack}>
                    <ChevronLeft />
                </Button>
                <DialogTitle>Available Slots for {room.name}</DialogTitle>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-96 overflow-y-auto p-1">
                {DAYS.map((day, dayIndex) => (
                    <Card key={day}>
                        <CardContent className="p-4">
                            <h4 className="font-semibold">{day}</h4>
                            <p className="text-xs text-muted-foreground mb-2">{format(addDays(startOfTheWeek, dayIndex), 'do MMMM')}</p>
                            <div className="space-y-2">
                                {TIME_SLOTS.map(slot => {
                                    const booking = getBookingForSlot(day, slot);
                                    return (
                                        <div key={slot} className={cn("p-2 rounded-md", booking ? "bg-muted" : "bg-green-500/10")}>
                                             <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="size-4 text-muted-foreground" />
                                                    <span className="text-sm font-medium">{slot}</span>
                                                </div>
                                                {!booking && (
                                                    <Button size="sm" variant="secondary" onClick={() => onOccupy(day, slot)}>
                                                        Occupy
                                                    </Button>
                                                )}
                                            </div>
                                            {booking && (
                                                <div className='mt-2 text-xs pl-2 border-l-2 ml-2 space-y-1'>
                                                     <div className="flex items-center gap-2">
                                                        <User className="size-3 text-muted-foreground" />
                                                        <span>{booking.facultyName}</span>
                                                    </div>
                                                     <div className="flex items-center gap-2">
                                                        <Book className="size-3 text-muted-foreground" />
                                                        <span>{booking.courseName}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export function RoomsDialog({ children }: { children?: React.ReactNode }) {
  const [filter, setFilter] = React.useState('All');
  const [selectedRoom, setSelectedRoom] = React.useState<Room | null>(null);
  const { bookRoom, timetable } = useDataStore();
  const { toast } = useToast();

  const handleOccupy = (day: string, timeSlot: string) => {
    if (!selectedRoom) return;

    const booking: ScheduleEntry = {
        roomId: selectedRoom.name,
        day,
        timeSlot,
        facultyName: 'Dr. Jane Doe', // Hardcoded for demo
        courseCode: 'EXT-101', // Placeholder for extra class
        courseName: 'Extra Class',
        studentGroup: 'Ad-hoc'
    }
    
    bookRoom(booking);
    
    toast({
        title: "Room Occupied",
        description: `${selectedRoom.name} has been booked for ${day} at ${timeSlot}.`
    });

    // We don't need to manually update state as the data store change will trigger a re-render
  };

  const isRoomAvailableNow = (room: Room) => {
      // Simplified: checks if there's any free slot today.
      const today = DAYS[new Date().getDay() -1] || DAYS[0];
      const occupiedSlots = timetable.filter(entry => entry.roomId === room.name && entry.day === today).map(e => e.timeSlot);
      return TIME_SLOTS.some(slot => !occupiedSlots.includes(slot));
  }

  const filteredRooms = initialRoomsData.filter(room => filter === 'All' || room.type === filter);

  const onOpenChange = (open: boolean) => {
      if(!open) {
          setSelectedRoom(null);
      }
  };

  const trigger = children ? (
    <DialogTrigger asChild>{children}</DialogTrigger>
  ) : (
    <SidebarMenuItem>
      <SidebarMenuButton tooltip="Rooms">
        <DoorOpen />
        Rooms &amp; Labs
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Dialog onOpenChange={onOpenChange}>
      {trigger}
      <DialogContent className="sm:max-w-4xl">
        {!selectedRoom ? (
            <>
            <DialogHeader>
                <DialogTitle>Available Rooms &amp; Labs</DialogTitle>
                <DialogDescription>
                    Browse rooms. Click on a room to see its detailed schedule and book a slot.
                </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2 border-b pb-4">
            <Button variant={filter === 'All' ? 'secondary' : 'outline'} onClick={() => setFilter('All')}>All</Button>
            <Button variant={filter === 'Classroom' ? 'secondary' : 'outline'} onClick={() => setFilter('Classroom')}>Classroom</Button>
            <Button variant={filter === 'Labs' ? 'secondary' : 'outline'} onClick={() => setFilter('Labs')}>Labs</Button>
            <Button variant={filter === 'Seminar Hall' ? 'secondary' : 'outline'} onClick={() => setFilter('Seminar Hall')}>Seminar Hall</Button>
            </div>
            <div className="grid h-80 grid-cols-2 gap-4 overflow-y-auto p-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredRooms.map(room => (
                <Card key={room.id} className="relative flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-muted/50" onClick={() => setSelectedRoom(room)}>
                <RoomIcon type={room.type} />
                <p className="mt-2 text-center text-sm font-medium">{room.name}</p>
                <div
                    className={cn(
                    'absolute bottom-2 right-2 h-2 w-2 rounded-full',
                    isRoomAvailableNow(room) ? 'bg-green-500' : 'bg-red-500'
                    )}
                />
                </Card>
            ))}
            </div>
            </>
        ) : (
            <RoomDetailView room={selectedRoom} onBack={() => setSelectedRoom(null)} onOccupy={handleOccupy} schedule={timetable} />
        )}
      </DialogContent>
    </Dialog>
  );
}
