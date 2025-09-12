
'use client';
import * as React from 'react';
import { ScheduleEntry } from '@/lib/timetable-generator';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Helper to get all unique time slots from the schedule and sort them
const getSortedTimeSlots = (schedule: ScheduleEntry[]): string[] => {
  const timeSlots = new Set<string>();
  schedule.forEach(entry => timeSlots.add(entry.timeSlot));
  return Array.from(timeSlots).sort((a, b) => {
    const aHour = parseInt(a.split(':')[0]);
    const bHour = parseInt(b.split(':')[0]);
    return aHour - bHour;
  });
};


type FormattedSchedule = {
    [timeSlot: string]: {
        [day: string]: ScheduleEntry[];
    };
};

const formatScheduleForGrid = (schedule: ScheduleEntry[], timeSlots: string[]): FormattedSchedule => {
    const grid: FormattedSchedule = timeSlots.reduce((acc, slot) => {
        acc[slot] = DAYS.reduce((dayAcc, day) => {
            dayAcc[day] = [];
            return dayAcc;
        }, {} as { [day: string]: ScheduleEntry[] });
        return acc;
    }, {} as FormattedSchedule);

    schedule.forEach(entry => {
        if (grid[entry.timeSlot] && grid[entry.timeSlot][entry.day]) {
            grid[entry.timeSlot][entry.day].push(entry);
        }
    });

    return grid;
};

const ClassCard = ({ entry }: { entry: ScheduleEntry }) => {
    const isPractical = entry.courseName.toLowerCase().includes('lab');

    return (
        <div className="flex h-full min-h-[100px] flex-col justify-between rounded-lg border bg-card p-2 shadow-sm">
            <div>
                 <div className="flex items-start justify-between">
                    <Badge variant={isPractical ? 'default' : 'secondary'} className={cn(isPractical ? 'bg-green-100 text-green-800' : '')}>
                        {isPractical ? 'Practical' : 'Theory'}
                    </Badge>
                    <span className="text-xs font-mono text-muted-foreground">{entry.courseCode}</span>
                </div>
                <h4 className="mt-1 font-bold">{entry.courseName}</h4>
            </div>
            <div>
                <p className="text-xs text-muted-foreground">{entry.facultyName}</p>
                <p className="text-xs text-muted-foreground">{entry.roomId}</p>
            </div>
        </div>
    );
};


export function TimetableView({ schedule }: { schedule: ScheduleEntry[] }) {
    const timeSlots = getSortedTimeSlots(schedule);
    const gridData = formatScheduleForGrid(schedule, timeSlots);

    return (
        <div className="w-full overflow-x-auto rounded-lg border">
            <div className="grid min-w-[1000px] grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr]">
                {/* Header */}
                <div className="sticky left-0 top-0 z-10 border-b border-r bg-card p-2 text-center text-sm font-semibold">Time</div>
                {DAYS.map(day => (
                    <div key={day} className="border-b p-2 text-center text-sm font-semibold">{day}</div>
                ))}

                {/* Body */}
                {timeSlots.map(timeSlot => (
                    <React.Fragment key={timeSlot}>
                        <div className="sticky left-0 z-10 border-r bg-card p-2 text-center text-sm font-medium">
                            {timeSlot}
                        </div>
                        {DAYS.map(day => (
                            <div key={`${day}-${timeSlot}`} className="border-b border-r p-1">
                                {gridData[timeSlot][day].length === 0 ? (
                                    <div className="flex h-full min-h-[100px] items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 p-2">
                                        <span className="text-xs text-muted-foreground">Free</span>
                                    </div>
                                ) : (
                                    <ScrollArea className="h-32">
                                        <div className="space-y-2 pr-2">
                                            {gridData[timeSlot][day].map((entry, index) => (
                                                <ClassCard key={index} entry={entry} />
                                            ))}
                                        </div>
                                    </ScrollArea>
                                )}
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
