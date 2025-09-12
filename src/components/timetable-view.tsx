
'use client';
import * as React from 'react';
import { ScheduleEntry } from '@/lib/timetable-generator';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS_NEW = ['1:00 - 2:30 PM', '2:30 - 4:00 PM', '4:00 - 5:30 PM'];

// Map your original time slots to the new format
const mapTimeToNewSlot = (time: string): string => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 9 && hour < 13) return TIME_SLOTS_NEW[0];
    if (hour >= 13 && hour < 16) return TIME_SLOTS_NEW[1];
    return TIME_SLOTS_NEW[2];
};


type FormattedSchedule = {
    [timeSlot: string]: {
        [day: string]: ScheduleEntry[];
    };
};

const formatScheduleForGrid = (schedule: ScheduleEntry[]): FormattedSchedule => {
    const grid: FormattedSchedule = TIME_SLOTS_NEW.reduce((acc, slot) => {
        acc[slot] = DAYS.reduce((dayAcc, day) => {
            dayAcc[day] = [];
            return dayAcc;
        }, {} as { [day: string]: ScheduleEntry[] });
        return acc;
    }, {} as FormattedSchedule);

    schedule.forEach(entry => {
        const newSlot = mapTimeToNewSlot(entry.timeSlot);
        if (grid[newSlot] && grid[newSlot][entry.day]) {
            grid[newSlot][entry.day].push(entry);
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
    const gridData = formatScheduleForGrid(schedule);

    return (
        <div className="w-full overflow-x-auto rounded-lg border">
            <div className="grid min-w-[1000px] grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr]">
                {/* Header */}
                <div className="sticky left-0 top-0 z-10 border-b border-r bg-card p-2 text-center text-sm font-semibold">Time</div>
                {DAYS.map(day => (
                    <div key={day} className="border-b p-2 text-center text-sm font-semibold">{day}</div>
                ))}

                {/* Body */}
                {TIME_SLOTS_NEW.map(timeSlot => (
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
