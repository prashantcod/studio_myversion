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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DoorOpen, Computer, Presentation } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const roomsData = [
  // Classrooms
  { id: 1, name: '327 A', type: 'Classroom', isAvailable: true },
  { id: 2, name: '327 B', type: 'Classroom', isAvailable: false },
  { id: 3, name: '401', type: 'Classroom', isAvailable: true },
  { id: 4, name: '402', type: 'Classroom', isAvailable: false },
  { id: 5, name: '403', type: 'Classroom', isAvailable: true },
  { id: 6, name: '511 A', type: 'Classroom', isAvailable: true },
  { id: 7, name: '511 B', type: 'Classroom', isAvailable: false },
  { id: 8, name: '512', type: 'Classroom', isAvailable: true },
  { id: 9, name: 'LH-1', type: 'Classroom', isAvailable: true },
  { id: 10, name: 'LH-2', type: 'Classroom', isAvailable: false },
  // Labs
  { id: 11, name: 'CSE Lab 1', type: 'Labs', isAvailable: false },
  { id: 12, name: 'CSE Lab 2', type: 'Labs', isAvailable: true },
  { id: 13, name: 'ECE Lab 1', type: 'Labs', isAvailable: true },
  { id: 14, name: 'ECE Lab 2', type: 'Labs', isAvailable: false },
  { id: 15, name: 'ME Lab', type: 'Labs', isAvailable: true },
  { id: 16, name: 'Civil Lab', type: 'Labs', isAvailable: true },
  { id: 17, name: 'EEE Lab', type: 'Labs', isAvailable: false },
  { id: 18, name: 'Physics Lab', type: 'Labs', isAvailable: true },
  { id: 19, name: 'Chemistry Lab', type: 'Labs', isAvailable: false },
  { id: 20, name: 'IT Lab 3', type: 'Labs', isAvailable: true },
  // Seminar Hall
  { id: 21, name: 'Main Seminar Hall', type: 'Seminar Hall', isAvailable: true },
];


const RoomIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'Classroom':
      return <DoorOpen className="size-5 text-muted-foreground" />;
    case 'Labs':
      return <Computer className="size-5 text-muted-foreground" />;
    case 'Seminar Hall':
      return <Presentation className="size-5 text-muted-foreground" />;
    default:
      return null;
  }
};


export function AvailableRoomsCard() {
  const [filter, setFilter] = React.useState('All');
  const filteredRooms = roomsData.filter(room => filter === 'All' || room.type === filter);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Rooms</CardTitle>
            <DoorOpen className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35</div>
            <p className="text-xs text-muted-foreground">2 labs, 33 classrooms</p>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Available Rooms &amp; Labs</DialogTitle>
          <DialogDescription>
            Browse and filter available rooms, labs, and seminar halls.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 border-b pb-4">
          <Button
            variant={filter === 'All' ? 'secondary' : 'outline'}
            onClick={() => setFilter('All')}
          >
            All
          </Button>
          <Button
            variant={filter === 'Classroom' ? 'secondary' : 'outline'}
            onClick={() => setFilter('Classroom')}
          >
            Classroom
          </Button>
          <Button
            variant={filter === 'Labs' ? 'secondary' : 'outline'}
            onClick={() => setFilter('Labs')}
          >
            Labs
          </Button>
          <Button
            variant={filter === 'Seminar Hall' ? 'secondary' : 'outline'}
            onClick={() => setFilter('Seminar Hall')}
          >
            Seminar Hall
          </Button>
        </div>
        <div className="grid h-80 grid-cols-2 gap-4 overflow-y-auto p-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
           {filteredRooms.map(room => (
            <Card key={room.id} className="relative flex flex-col items-center justify-center p-4">
               <RoomIcon type={room.type} />
              <p className="mt-2 text-center text-sm font-medium">{room.name}</p>
              <div
                className={cn(
                  'absolute bottom-2 right-2 h-2 w-2 rounded-full',
                  room.isAvailable ? 'bg-green-500' : 'bg-red-500'
                )}
              />
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
