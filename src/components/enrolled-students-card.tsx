
'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { useDataStore } from '@/lib/data-store';
import { EnrolledStudentsDialog } from './enrolled-students-dialog';

export function EnrolledStudentsCard() {
  const { studentGroups } = useDataStore();

  const totalStudents = React.useMemo(() => {
    return studentGroups.reduce((total, group) => total + group.size, 0);
  }, [studentGroups]);

  return (
    <EnrolledStudentsDialog>
      <Card className="cursor-pointer hover:bg-muted/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Enrolled Students
          </CardTitle>
          <Users className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStudents}</div>
          <p className="text-xs text-muted-foreground">
            Across {studentGroups.length} groups
          </p>
        </CardContent>
      </Card>
    </EnrolledStudentsDialog>
  );
}
