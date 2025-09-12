
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
import { useDataStore } from '@/lib/data-store';

type Faculty = ReturnType<typeof useDataStore>['faculty'][0];

const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length > 1) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

export function FacultyDialog() {
  const [selectedFaculty, setSelectedFaculty] = React.useState<Faculty | null>(null);
  const teacherAvatar = placeholderImages.find(img => img.id === 'user-avatar');
  const { getFaculty } = useDataStore();
  const facultyData = getFaculty();

  const handleFacultySelect = (faculty: Faculty) => {
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
              <DialogTitle>Faculty Members</DialogTitle>
              <DialogDescription>Select a faculty member to view their details. {facultyData.length} members found.</DialogDescription>
            </>
          )}
        </DialogHeader>
        <div className="py-4 min-h-[300px]">
          {selectedFaculty ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="md:col-span-1">
                 <Card>
                  <CardHeader className="items-center text-center">
                    <Avatar className="size-24">
                      {teacherAvatar && <AvatarImage src={teacherAvatar.imageUrl} data-ai-hint="teacher profile photo" />}
                      <AvatarFallback className="text-3xl">{getInitials(selectedFaculty.name)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="pt-2">{selectedFaculty.name}</CardTitle>
                    <CardDescription>Expertise: {selectedFaculty.expertise.join(', ')}</CardDescription>
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
                        <span className="font-medium">Total Availability Slots</span>
                      </div>
                      <Badge variant="secondary">{Object.values(selectedFaculty.availability || {}).flat().length} slots</Badge>
                    </div>
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                        <BookOpen className="size-5 text-muted-foreground" />
                        <span className="font-medium">Expert In</span>
                      </div>
                      <span className="text-muted-foreground">{selectedFaculty.expertise.length} courses</span>
                    </div>
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
                      {teacherAvatar && <AvatarImage src={teacherAvatar.imageUrl} data-ai-hint="teacher profile photo" />}
                      <AvatarFallback>{getInitials(faculty.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{faculty.name}</p>
                      <p className="text-sm text-muted-foreground">{faculty.expertise.join(', ')}</p>
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
