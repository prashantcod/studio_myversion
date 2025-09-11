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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ChevronLeft, BookOpen, Clock, CalendarOff, FileText, Download } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarMenuButton, SidebarMenuItem } from './ui/sidebar';
import { placeholderImages } from '@/lib/placeholder-images.json';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

const facultyData = [
  { id: 1, name: 'Suresh Kumar', initials: 'SK', credits: 16, module: 'Advanced AI', leaveDays: 3, documents: [{ name: 'PhD_Thesis.pdf' }, { name: 'Joining_Report.pdf' }] },
  { id: 2, name: 'Basha', initials: 'B', credits: 14, module: 'Data Structures', leaveDays: 1, documents: [] },
  { id: 3, name: 'Swapna', initials: 'S', credits: 15, module: 'Web Development', leaveDays: 5, documents: [{ name: 'Conference_Paper.pdf' }] },
  { id: 4, name: 'Ambika', initials: 'A', credits: 12, module: 'Database Systems', leaveDays: 2, documents: [] },
  { id: 5, name: 'Maruthi', initials: 'M', credits: 18, module: 'Machine Learning', leaveDays: 0, documents: [{ name: 'Research_Proposal.pdf' }] },
  { id: 6, name: 'Jyanath', initials: 'J', credits: 14, module: 'Operating Systems', leaveDays: 4, documents: [] },
];

export function FacultyDialog() {
  const [selectedFaculty, setSelectedFaculty] = React.useState<typeof facultyData[0] | null>(null);
  const teacherAvatar = placeholderImages.find(img => img.id === 'user-avatar');

  const handleFacultySelect = (faculty: typeof facultyData[0]) => {
    setSelectedFaculty(faculty);
  };

  const handleBack = () => {
    setSelectedFaculty(null);
  };

  return (
    <Dialog onOpenChange={() => setSelectedFaculty(null)}>
      <DialogTrigger asChild>
        <SidebarMenuItem>
           <SidebarMenuButton tooltip="Faculty">
             <Users />
            Faculty
          </SidebarMenuButton>
        </SidebarMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          {selectedFaculty ? (
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ChevronLeft />
              </Button>
              <DialogTitle className="text-2xl">{selectedFaculty.name}'s Profile</DialogTitle>
            </div>
          ) : (
            <>
              <DialogTitle>Faculty Names</DialogTitle>
              <DialogDescription>Select a faculty member to view their details.</DialogDescription>
            </>
          )}
        </DialogHeader>
        <div className="py-4">
          {selectedFaculty ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="md:col-span-1">
                 <Card>
                  <CardHeader className="items-center text-center">
                    <Avatar className="size-24">
                      {teacherAvatar && <AvatarImage src={`https://picsum.photos/seed/${selectedFaculty.initials}/128/128`} data-ai-hint="teacher profile photo" />}
                      <AvatarFallback className="text-3xl">{selectedFaculty.initials}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="pt-2">{selectedFaculty.name}</CardTitle>
                    <CardDescription>{selectedFaculty.module} Module Lead</CardDescription>
                  </CardHeader>
                </Card>
              </div>
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Academic Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                        <Clock className="size-5 text-muted-foreground" />
                        <span className="font-medium">Credit Hours (NEP)</span>
                      </div>
                      <Badge variant="secondary">{selectedFaculty.credits} / 20</Badge>
                    </div>
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                        <BookOpen className="size-5 text-muted-foreground" />
                        <span className="font-medium">Current Module</span>
                      </div>
                      <span className="text-muted-foreground">{selectedFaculty.module}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CalendarOff className="size-5 text-muted-foreground" />
                        <span className="font-medium">Leave Days (Semester)</span>
                      </div>
                      <Badge variant="destructive">{selectedFaculty.leaveDays} days</Badge>
                    </div>
                  </CardContent>
                </Card>
                <Card className="mt-6">
                   <CardHeader>
                    <CardTitle>Submitted Documents</CardTitle>
                    <CardDescription>Documents personally submitted to the admin.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedFaculty.documents.length > 0 ? (
                      <ul className="space-y-2">
                        {selectedFaculty.documents.map(doc => (
                          <li key={doc.name} className="flex items-center justify-between">
                            <div className='flex items-center gap-2'>
                              <FileText className="size-4 text-muted-foreground" />
                              <span>{doc.name}</span>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Download className="size-4" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No documents submitted.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {facultyData.map(faculty => (
                <Card key={faculty.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleFacultySelect(faculty)}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <Avatar>
                      {teacherAvatar && <AvatarImage src={`https://picsum.photos/seed/${faculty.initials}/40/40`} data-ai-hint="teacher profile photo" />}
                      <AvatarFallback>{faculty.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{faculty.name}</p>
                      <p className="text-sm text-muted-foreground">{faculty.module}</p>
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
