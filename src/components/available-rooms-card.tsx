
'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DoorOpen } from 'lucide-react';
import { RoomsDialog } from './rooms-dialog';

export function AvailableRoomsCard() {

  return (
    <RoomsDialog>
        <Card className="cursor-pointer hover:bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Availability</CardTitle>
            <DoorOpen className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35</div>
            <p className="text-xs text-muted-foreground">2 labs, 33 classrooms</p>
          </CardContent>
        </Card>
    </RoomsDialog>
  );
}
