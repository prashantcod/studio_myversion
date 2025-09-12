
'use client';

import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDataStore } from '@/lib/data-store';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function StudentEntryDialog() {
  const { addStudentGroup } = useDataStore();
  const router = useRouter();
  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [courses, setCourses] = useState('');

  const handleSubmit = () => {
    addStudentGroup({
        name,
        size: parseInt(size, 10) || 0,
        courses: courses.split(',').map(c => c.trim()),
    });
    router.refresh();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="justify-start">
          <GraduationCap className="mr-2" />
          Add New Student Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Student Group</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new student group.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Group Name
            </Label>
            <Input id="name" placeholder="e.g. B.Tech IT 1st Year" className="col-span-3" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="size" className="text-right">
              Group Size
            </Label>
            <Input id="size" type="number" placeholder="e.g. 60" className="col-span-3" value={size} onChange={(e) => setSize(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="courses" className="text-right">
              Courses
            </Label>
            <Input id="courses" placeholder="e.g. CSE101,PHY101" className="col-span-3" value={courses} onChange={(e) => setCourses(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Save Group</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
