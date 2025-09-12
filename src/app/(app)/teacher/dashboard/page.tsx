
'use client';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {placeholderImages} from '@/lib/placeholder-images.json';
import {BookOpen, Calendar, Clock, DoorOpen, FileText, UserCheck} from 'lucide-react';
import { RoomsDialog } from '@/components/rooms-dialog';

const assignedCourses = [
  {
    courseCode: 'CSE-301',
    courseName: 'Advanced Algorithms',
    credits: 4,
    class: 'B.Tech CSE 3rd Year',
  },
  {
    courseCode: 'CSE-205',
    courseName: 'Data Structures',
    credits: 4,
    class: 'B.Tech CSE 2nd Year',
  },
  {
    courseCode: 'ITC-402',
    courseName: 'Cryptography',
    credits: 3,
    class: 'B.Tech IT 4th Year',
  },
  {
    courseCode: 'GEN-101',
    courseName: 'Intro to Programming',
    credits: 3,
    class: 'FYUP Batch 1',
  },
];

export default function TeacherDashboardPage() {
  const teacherAvatar = placeholderImages.find(
    img => img.id === 'user-avatar'
  );

  // Mock data for today's classes
  const todaysClasses = [
    { time: '10:00 - 11:30', course: 'CSE-301', room: 'Room 405', status: 'upcoming' },
    { time: '13:00 - 14:30', course: 'CSE-205', room: 'Lab 2', status: 'upcoming' }
  ];

  return (
    <div className="flex flex-col gap-3 py-2">
      {/* Welcome section with quick actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome, Dr. Jane Doe</h1>
          <p className="text-muted-foreground">Here's your teaching overview for today</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Clock className="mr-1 size-4" /> Request Leave
          </Button>
          <Button size="sm">
            <BookOpen className="mr-1 size-4" /> View Timetable
          </Button>
        </div>
      </div>

      {/* Stats cards in a compact row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-3">
            <CardTitle className="text-xs font-medium sm:text-sm">Subjects</CardTitle>
            <BookOpen className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-xl font-bold sm:text-2xl">4</div>
            <p className="text-xs text-muted-foreground">This Semester</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-3">
            <CardTitle className="text-xs font-medium sm:text-sm">Credit Hours</CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-xl font-bold sm:text-2xl">14</div>
            <p className="text-xs text-muted-foreground">Weekly Load</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-3">
            <CardTitle className="text-xs font-medium sm:text-sm">Days Absent</CardTitle>
            <UserCheck className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-xl font-bold sm:text-2xl">2</div>
            <p className="text-xs text-muted-foreground">Current Semester</p>
          </CardContent>
        </Card>
        
        <RoomsDialog>
          <Card className="cursor-pointer hover:bg-muted/50">
            <CardHeader className="flex flex-row items-center justify-between p-3">
              <CardTitle className="text-xs font-medium sm:text-sm">Rooms Available</CardTitle>
              <DoorOpen className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-xl font-bold sm:text-2xl">35</div>
              <p className="text-xs text-muted-foreground">2 labs, 33 classrooms</p>
            </CardContent>
          </Card>
        </RoomsDialog>
      </div>

      {/* Today's Schedule */}
      <Card className="mt-1">
        <CardHeader className="pb-2 pt-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Today's Schedule</CardTitle>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
              <Calendar className="size-3.5" /> View Full Week
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          {todaysClasses.length > 0 ? (
            <div className="space-y-3">
              {todaysClasses.map((cls, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border p-2.5">
                  <div className="flex flex-col">
                    <span className="font-medium">{cls.time}</span>
                    <span className="text-sm text-muted-foreground">{cls.course}: {cls.room}</span>
                  </div>
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    View Class
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground">No classes scheduled for today</p>
          )}
        </CardContent>
      </Card>

      {/* Assigned Courses Table */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2 pt-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">My Assigned Courses</CardTitle>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
              <FileText className="size-3.5" /> Upload Materials
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Course Code</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead className="w-[80px]">Credits</TableHead>
                  <TableHead className="hidden md:table-cell">Assigned Class</TableHead>
                  <TableHead className="w-[100px]">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedCourses.map(course => (
                  <TableRow key={course.courseCode}>
                    <TableCell className="font-medium">
                      {course.courseCode}
                    </TableCell>
                    <TableCell>{course.courseName}</TableCell>
                    <TableCell>{course.credits}</TableCell>
                    <TableCell className="hidden md:table-cell">{course.class}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
