'use client';

import { UserPlus } from 'lucide-react';
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

export function TeacherEntryDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="justify-start">
          <UserPlus className="mr-2" />
          Add New Teacher
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Teacher</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new teacher.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" placeholder="e.g. Dr. Jane Doe" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" type="email" placeholder="e.g. jane.doe@university.edu" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input id="phone" placeholder="e.g. +1 234 567 890" className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="qualification" className="text-right">
              Qualification
            </Label>
            <Input id="qualification" placeholder="e.g. Ph.D. in AI" className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="experience" className="text-right">
              Experience
            </Label>
            <Input id="experience" placeholder="e.g. 10 years" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save Teacher</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
