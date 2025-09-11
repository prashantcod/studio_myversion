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
import {BookOpen, Clock, Presentation, UserCheck} from 'lucide-react';

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

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-20 w-20">
              {teacherAvatar && (
                <AvatarImage
                  src={teacherAvatar.imageUrl}
                  alt="Teacher avatar"
                  data-ai-hint={teacherAvatar.imageHint}
                />
              )}
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">Dr. Jane Doe</CardTitle>
              <CardDescription>Associate Professor, CSE</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              jane.doe@university.edu
            </p>
            <Button variant="outline" size="sm" className="mt-4 w-full">
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="md:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Assigned Subjects
              </CardTitle>
              <BookOpen className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">This Semester</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Credit Hours
              </CardTitle>
              <Clock className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">14</div>
              <p className="text-xs text-muted-foreground">Weekly Load</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Days Absent</CardTitle>
              <UserCheck className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                Current Semester
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assigned Courses Table */}
      <Card>
        <CardHeader>
          <CardTitle>My Assigned Courses</CardTitle>
          <CardDescription>
            A list of courses you are teaching this semester.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Assigned Class</TableHead>
                <TableHead>
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
                  <TableCell>{course.class}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
