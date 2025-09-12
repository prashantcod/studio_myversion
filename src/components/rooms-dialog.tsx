
'use client';
import *https://www.php8.ltd:/HostLocMJJ/https://github.com/../react';
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
import { DoorOpen, Computer, Presentation, ChevronLeft, Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SidebarMenuButton, SidebarMenuItem } from './ui/sidebar';
import { useDataStore } from '@/lib/data-store';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import { format, addDays, startOfWeek } from 'date-fns';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = ["09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "14:00-15:00", "15:00-16:00", "16:00-17:00"];

type Room = {
  id: number;
  name: string;
  type: 'Classroom' | 'Labs' | 'Seminar Hall';
  schedule: {
    [day: string]: {
      [timeSlot: string]: boolean; // true if occupied, false if free
    }
  }
};

// Function to generate a somewhat random schedule for a room
const generateInitialSchedule = () => {
    const schedule: Room['schedule'] = {};
    DAYS.forEach(day => {
        schedule[day] = {};
        TIME_SLOTS.forEach(slot => {
            schedule[day][slot] = Math.random() > 0.7; // ~30% chance of being occupied
        });
    });
    return schedule;
};


const initialRoomsData: Room[] = [
  // Classrooms
  { id: 1, name: '327 A', type: 'Classroom', schedule: generateInitialSchedule() },
  { id: 2, name: '327 B', type: 'Classroom', schedule: generateInitialSchedule() },
  { id: 3, name: '401', type: 'Classroom', schedule: generateInitialSchedule() },
  { id: 4, name: '402', type: 'Classroom', schedule: generateInitialSchedule() },
  { id: 5, name: '403', type: 'Classroom', schedule: generateInitialSchedule() },
  { id: 6, name: '511 A', type: 'Classroom', schedule: generateInitialSchedule() },
  { id: 7, name: '511 B', type: 'Classroom', schedule: generateInitialSchedule() },
  { id: 8, name: '512', type: 'Classroom', schedule: generateInitialSchedule() },
  { id: 9, name: 'LH-1', type: 'Classroom', schedule: generateInitialSchedule() },
  { id: 10, name: 'LH-2', type: 'Classroom', schedule: generateInitialSchedule() },
  // Labs
  { id: 11, name: 'CSE Lab 1', type: 'Labs', schedule: generateInitialSchedule() },
  { id: 12, name: 'CSE Lab 2', type: 'Labs', schedule: generateInitialSchedule() },
  { id: 13, name: 'ECE Lab 1', type: 'Labs', schedule: generateInitialSchedule() },
  { id: 14, name: 'ECE Lab 2', type: 'Labs', schedule: generateInitialSchedule() },
  { id: 15, name: 'ME Lab', type: 'Labs', schedule: generateInitialSchedule() },
  { id: 16, name: 'Civil Lab', type: 'Labs', schedule: generateInitialSchedule() },
  { id: 17, name: 'EEE Lab', type: 'Labs', schedule: generateInitialSchedule() },
  { id: 18, name: 'Physics Lab', type: 'Labs', schedule: generateInitialSchedule() },
  { id: 19, name: 'Chemistry Lab', type: 'Labs', schedule: generateInitialSchedule() },
  { id: 20, name: 'IT Lab 3', type: 'Labs', schedule: generateInitialSchedule() },
  // Seminar Hall
  { id: 21, name: 'Main Seminar Hall', type: 'Seminar Hall', schedule: generateInitialSchedule() },
];


const RoomIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'Classroom': return <DoorOpen className="size-5 text-muted-foreground" />;
    case 'Labs': return <Computer className="size-5 text-muted-foreground" />;
    case 'Seminar Hall': return <Presentation className="size-5 text-muted-foreground" />;
    default: return null;
  }
};

const RoomDetailView = ({ room, onBack, onOccupy }: { room: Room, onBack: () => void, onOccupy: (day: string, timeSlot: string) => void }) => {
    const today = new Date();
    const startOfTheWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday

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
                                    const isOccupied = room.schedule[day][slot];
                                    return (
                                        <div key={slot} className={cn("flex items-center justify-between p-2 rounded-md", isOccupied ? "bg-muted" : "bg-green-500/10")}>
                                            <div className="flex items-center gap-2">
                                                <Clock className="size-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">{slot}</span>
                                            </div>
                                            {!isOccupied && (
                                                <Button size="sm" variant="secondary" onClick={() => onOccupy(day, slot)}>
                                                    Occupy
                                                </Button>
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
  const [roomsData, setRoomsData] = React.useState(initialRoomsData);
  const [selectedRoom, setSelectedRoom] = React.useState<Room | null>(null);
  const { bookRoom } = useDataStore();
  const { toast } = useToast();

  const handleOccupy = (day: string, timeSlot: string) => {
    if (!selectedRoom) return;

    // Update the local state to show the change immediately
    setRoomsData(prevRooms => 
      prevRooms.map(r => 
        r.id === selectedRoom.id 
          ? { ...r, schedule: { ...r.schedule, [day]: { ...r.schedule[day], [timeSlot]: true } } }
          : r
      )
    );

    // Call the data store to make the change persistent for the session
    bookRoom({
        roomId: selectedRoom.name,
        day,
        timeSlot,
        facultyName: 'Dr. Jane Doe', // Hardcoded for demo
        courseCode: 'EXT-101', // Placeholder for extra class
        courseName: 'Extra Class',
        studentGroup: 'Ad-hoc'
    });
    
    toast({
        title: "Room Occupied",
        description: `${selectedRoom.name} has been booked for ${day} at ${timeSlot}.`
    });
  };

  const isRoomAvailableNow = (room: Room) => {
      // Simplified: checks if there's any free slot today.
      const today = DAYS[new Date().getDay() -1] || DAYS[0];
      return Object.values(room.schedule[today]).some(isOccupied => !isOccupied);
  }

  const filteredRooms = roomsData.filter(room => filter === 'All' || room.type === filter);

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
            <RoomDetailView room={selectedRoom} onBack={() => setSelectedRoom(null)} onOccupy={handleOccupy} />
        )}
      </DialogContent>
    </Dialog>
  );
}
