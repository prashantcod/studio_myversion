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
import { DoorOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AvailableRoomsCard() {
  const [filter, setFilter] = React.useState('All');
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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Available Rooms & Labs</DialogTitle>
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
        <div>
          <p className="p-4 text-center text-muted-foreground">
            Room details will be displayed here based on the selected filter.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
