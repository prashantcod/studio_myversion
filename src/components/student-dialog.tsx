
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
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Users, ChevronLeft, BookOpen } from 'lucide-react';
import { SidebarMenuButton, SidebarMenuItem } from './ui/sidebar';
import { useDataStore } from '@/lib/data-store';
import { StudentGroup, Student } from '@/lib/data/students.json';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ScrollArea } from './ui/scroll-area';

const StudentDetailView = ({ group }: { group: StudentGroup }) => {
    return (
        <Card>
            <CardContent className="p-6 space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="size-5 text-muted-foreground" />
                        <span className="font-medium">Group Size</span>
                    </div>
                    <Badge variant="secondary">{group.size} students</Badge>
                </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BookOpen className="size-5 text-muted-foreground" />
                        <span className="font-medium">Courses Enrolled</span>
                    </div>
                    <span className="text-muted-foreground">{group.courses.length} courses</span>
                </div>
                <div className="space-y-2 pt-2">
                    <h4 className="font-medium">Student Roster</h4>
                     <ScrollArea className="h-64 rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Roll Number</TableHead>
                                    <TableHead>Name</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {group.students?.map((student: Student) => (
                                    <TableRow key={student.rollNumber}>
                                        <TableCell className="font-medium">{student.rollNumber}</TableCell>
                                        <TableCell>{student.name}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </div>
            </CardContent>
        </Card>
    );
};


export function StudentDialog() {
  const [selectedGroup, setSelectedGroup] = React.useState<StudentGroup | null>(null);
  const { studentGroups } = useDataStore();

  const handleGroupSelect = (group: StudentGroup) => {
    setSelectedGroup(group);
  };

  const handleBack = () => {
    setSelectedGroup(null);
  };

  const onOpenChange = (open: boolean) => {
     if(!open) {
        setSelectedGroup(null)
     }
  }

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <SidebarMenuItem>
           <SidebarMenuButton tooltip="Students">
             <GraduationCap />
            Students
          </SidebarMenuButton>
        </SidebarMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          {selectedGroup ? (
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ChevronLeft />
              </Button>
              <DialogTitle className="text-2xl">{selectedGroup.name}</DialogTitle>
            </div>
          ) : (
            <>
              <DialogTitle>Student Groups</DialogTitle>
              <DialogDescription>Select a group to view its details. {studentGroups.length} groups found.</DialogDescription>
            </>
          )}
        </DialogHeader>
        <div className="py-4 min-h-[300px]">
          {selectedGroup ? (
            <StudentDetailView group={selectedGroup} />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {studentGroups.map(group => (
                <Card key={group.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleGroupSelect(group)}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                        <GraduationCap />
                    </div>
                    <div>
                      <p className="font-semibold">{group.name}</p>
                      <p className="text-sm text-muted-foreground">{group.size} students</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
