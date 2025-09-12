
'use client';

import * as React from 'react';
import {CalendarIcon, CalendarOff} from 'lucide-react';
import {format} from 'date-fns';
import {DateRange} from 'react-day-picker';

import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {Calendar} from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {SidebarMenuButton, SidebarMenuItem} from '@/components/ui/sidebar';
import { Textarea } from './ui/textarea';
import { useDataStore } from '@/lib/data-store';
import { useToast } from '@/hooks/use-toast';
import { Label } from './ui/label';

export function OnLeaveDialog() {
  const [date, setDate] = React.useState<DateRange | undefined>();
  const [reason, setReason] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const { addLeaveRequest } = useDataStore();
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!date?.from || !reason) {
        toast({
            variant: 'destructive',
            title: 'Missing Information',
            description: 'Please select a date range and provide a reason.',
        });
        return;
    }
    
    // In a real app, you'd get the faculty ID from the logged-in user session
    addLeaveRequest({
        facultyId: 'F002', // Hardcoded Dr. Grace Hopper for demo
        facultyName: 'Dr. Grace Hopper',
        startDate: date.from,
        endDate: date.to || date.from,
        reason,
    });

    toast({
        title: 'Leave Request Submitted',
        description: 'Your request has been sent to the administrator for approval.',
    });

    setIsOpen(false);
  };
  
  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
        setDate(undefined);
        setReason('');
    }
  }


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <SidebarMenuItem>
            <SidebarMenuButton>
                <CalendarOff />
                On Leave
            </SidebarMenuButton>
        </SidebarMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Leave</DialogTitle>
          <DialogDescription>
            Select the date(s) you will be on leave and provide a reason.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Leave Dates</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, 'LLL dd, y')} -{' '}
                        {format(date.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(date.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
          </div>
           <div className="space-y-2">
             <Label htmlFor="reason">Reason for Leave</Label>
            <Textarea id="reason" placeholder="e.g., Attending a conference" value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit}>Submit Leave Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
