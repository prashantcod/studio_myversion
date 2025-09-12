
'use client';
import {
  Activity,
  ArrowUpRight,
  BookCopy,
  DoorOpen,
  GraduationCap,
  Users,
} from 'lucide-react';
import {Bar, BarChart, ResponsiveContainer, XAxis, YAxis} from 'recharts';
import Link from 'next/link';

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
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import { AvailableRoomsCard } from '@/components/available-rooms-card';
import { CoursesDialogCard } from '@/components/courses-dialog-card';
import { FacultyDialogCard } from '@/components/faculty-dialog-card';
import { EnrolledStudentsCard } from '@/components/enrolled-students-card';

const chartData = [
  {name: 'CSE', conflicts: 12},
  {name: 'ECE', conflicts: 8},
  {name: 'MECH', conflicts: 5},
  {name: 'CIVIL', conflicts: 3},
  {name: 'EEE', conflicts: 9},
  {name: 'IT', conflicts: 7},
  {name: 'B.Ed', conflicts: 15},
];

const recentGenerations = [
  {
    id: 'GEN-001',
    date: '2024-07-20',
    status: 'Completed',
    conflicts: 3,
  },
  {
    id: 'GEN-002',
    date: '2024-07-19',
    status: 'Completed',
    conflicts: 0,
  },
  {
    id: 'GEN-003',
    date: '2024-07-18',
    status: 'Failed',
    conflicts: 21,
  },
  {
    id: 'GEN-004',
    date: '2024-07-17',
    status: 'Completed',
    conflicts: 1,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <CoursesDialogCard />
        <FacultyDialogCard />
        <EnrolledStudentsCard />
        <AvailableRoomsCard />
      </div>
      <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Recent Timetable Generations</CardTitle>
            <CardDescription>
              An overview of the latest timetable generation tasks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Conflicts</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentGenerations.map(gen => (
                  <TableRow key={gen.id}>
                    <TableCell className="font-medium">{gen.id}</TableCell>
                    <TableCell>{gen.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          gen.status === 'Completed'
                            ? 'default'
                            : 'destructive'
                        }
                        className={
                          gen.status === 'Completed'
                            ? 'bg-green-600/20 text-green-700'
                            : ''
                        }
                      >
                        {gen.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{gen.conflicts}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link href="/timetable">View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Conflict Overview</CardTitle>
            <CardDescription>
              A summary of unresolved conflicts by department.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={value => `${value}`}
                />
                <Bar
                  dataKey="conflicts"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
