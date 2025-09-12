
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
import { useDataStore } from '@/lib/data-store';
import { Student } from '@/lib/data/students.json';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';

type StudentWithDetails = Student & {
  groupName: string;
  courses: string[];
  email: string;
  phone: string;
};

export function EnrolledStudentsDialog({ children }: { children: React.ReactNode }) {
  const { studentGroups, courses: allCourses } = useDataStore();

  const allStudents = React.useMemo(() => {
    const students: StudentWithDetails[] = [];
    studentGroups.forEach(group => {
      // The `students` property can be undefined, so we need to check for it.
      if (group.students) {
        group.students.forEach((student, index) => {
          // Simple hashing function to generate somewhat unique-looking phone numbers
          const phoneSeed = parseInt(student.rollNumber.replace(/\D/g, '').slice(-4)) + index;
          const phoneNumber = `987-654-${(phoneSeed % 10000).toString().padStart(4, '0')}`;

          students.push({
            ...student,
            groupName: group.name,
            courses: group.courses,
            email: `${student.name.toLowerCase().replace(/\s/g, '.').replace(/[^a-z.]/g, '')}@university.edu`,
            phone: phoneNumber,
          });
        });
      }
    });
    return students;
  }, [studentGroups]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>All Enrolled Students</DialogTitle>
          <DialogDescription>
            A complete list of all students across all groups. Found {allStudents.length} students.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[70vh] rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Courses</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allStudents.map(student => (
                <TableRow key={student.rollNumber}>
                  <TableCell className="font-medium">{student.rollNumber}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>{student.groupName}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {student.courses.map(courseCode => (
                        <Badge key={courseCode} variant="secondary">
                          {allCourses.find(c => c.code === courseCode)?.name || courseCode}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
