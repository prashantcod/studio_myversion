
'use client';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
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
import { placeholderImages } from '@/lib/placeholder-images.json';
import { Badge } from '@/components/ui/badge';
import { useDataStore, Course } from '@/lib/data-store';
import { TimetableView } from '@/components/timetable-view';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Helper type for course with category
type CategorizedCourse = Course & { category: string };

export default function StudentDashboardPage() {
  const studentAvatar = placeholderImages.find(img => img.id === 'user-avatar');
  const { studentGroups, timetable, courses, loggedInStudent } = useDataStore();
  const router = useRouter();

  useEffect(() => {
    // If no student is logged in, redirect to login page
    if (!loggedInStudent) {
      router.replace('/student/login');
    }
  }, [loggedInStudent, router]);

  // Find the group the logged-in student belongs to
  const myGroup = studentGroups.find(group => group.name === loggedInStudent?.groupName);
  
  const myCourses = useMemo(() => 
    myGroup?.courses.map(courseCode => 
      courses.find(c => c.code === courseCode)
    ).filter(Boolean) as CategorizedCourse[] || [],
  [myGroup, courses]);

  const groupedCourses = useMemo(() => {
    return myCourses.reduce((acc, course) => {
      const category = course.category || 'Elective'; // Default to Elective if not specified
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(course);
      return acc;
    }, {} as Record<string, CategorizedCourse[]>);
  }, [myCourses]);


  const mySchedule = myGroup ? timetable.filter(entry => entry.studentGroup === myGroup.name) : [];
  
  // Display a loading/skeleton state if the user is not yet available
  if (!loggedInStudent || !myGroup) {
     return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading student data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-20 w-20">
              {studentAvatar && (
                <AvatarImage
                  src={studentAvatar.imageUrl}
                  alt="Student avatar"
                  data-ai-hint={studentAvatar.imageHint}
                />
              )}
              <AvatarFallback>{loggedInStudent?.name.substring(0,2) || 'S'}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{loggedInStudent?.name || 'Student'}</CardTitle>
              <CardDescription>{myGroup.name}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Roll Number: {loggedInStudent?.rollNumber || 'N/A'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle>My Enrolled Courses</CardTitle>
                <CardDescription>A list of all your subjects for this semester, categorized by type.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Tabs defaultValue="Major">
                    <TabsList>
                        {Object.keys(groupedCourses).map(category => (
                             <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
                        ))}
                    </TabsList>

                    {Object.entries(groupedCourses).map(([category, coursesInCategory]) => (
                        <TabsContent key={category} value={category}>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Credits</TableHead>
                                        <TableHead>Type</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {coursesInCategory.map((course) => course && (
                                        <TableRow key={course.code}>
                                            <TableCell className="font-medium">{course.code}</TableCell>
                                            <TableCell>{course.name}</TableCell>
                                            <TableCell>{course.credits}</TableCell>
                                            <TableCell>
                                                <Badge variant={course.type === 'Practical' ? 'default' : 'secondary'}>{course.type}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>My Weekly Timetable</CardTitle>
          <CardDescription>
            Your personalized class schedule for the week.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TimetableView schedule={mySchedule} />
        </CardContent>
      </Card>
    </div>
  );
}
