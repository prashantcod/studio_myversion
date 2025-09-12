
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
import { BookCopy } from 'lucide-react';
import { useDataStore, Course } from '@/lib/data-store';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { SidebarMenuButton, SidebarMenuItem } from './ui/sidebar';

export function CoursesDialog() {
  const { courses: allCourses } = useDataStore();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Courses">
            <BookCopy />
            Courses
          </SidebarMenuButton>
        </SidebarMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>All Courses</DialogTitle>
          <DialogDescription>
            A complete list of all courses available in the system.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-96">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Department</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {allCourses.map((course) => (
                <TableRow key={course.code}>
                    <TableCell className="font-medium">{course.code}</TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.credits}</TableCell>
                    <TableCell>
                        <Badge variant={course.type === 'Practical' ? 'default' : 'secondary'}>{course.type}</Badge>
                    </TableCell>
                    <TableCell>{course.department}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
