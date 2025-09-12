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
import { Users } from 'lucide-react';
import { getFaculty, Faculty } from '@/lib/data-store';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { placeholderImages } from '@/lib/placeholder-images.json';
import { Skeleton } from './ui/skeleton';

const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length > 1) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}


export function FacultyDialogCard() {
  const [allFaculty, setAllFaculty] = React.useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const teacherAvatar = placeholderImages.find(img => img.id === 'user-avatar');

  React.useEffect(() => {
    getFaculty().then(faculty => {
        setAllFaculty(faculty);
        setIsLoading(false);
    });
  }, []);


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faculty Members</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-7 w-12" /> : <div className="text-2xl font-bold">{allFaculty.length}</div>}
            <p className="text-xs text-muted-foreground">Click to view all faculty</p>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>All Faculty Members</DialogTitle>
          <DialogDescription>
            A complete list of all faculty in the system.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-96">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {isLoading ? Array.from({length: 4}).map((_, i) => (
                <Card key={i}>
                    <CardContent className="flex items-center gap-4 p-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div>
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="mt-2 h-3 w-32" />
                        </div>
                    </CardContent>
                </Card>
              )) : allFaculty.map(faculty => (
                <Card key={faculty.id}>
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
