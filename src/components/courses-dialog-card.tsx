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
  Card,
  CardContent,
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
import { BookCopy, FileText } from 'lucide-react';
import { useDataStore, Course } from '@/lib/data-store';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';

export function CoursesDialogCard() {
  const { getCourses } = useDataStore();
  const [allCourses, setAllCourses] = React.useState<Course[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const courses = getCourses();
    setAllCourses(courses);
    setIsLoading(false);
  }, [getCourses]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookCopy className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-7 w-12" /> : <div className="text-2xl font-bold">{allCourses.length}</div> }
            <p className="text-xs text-muted-foreground">Click to view all courses</p>
          </CardContent>
        </Card>
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
