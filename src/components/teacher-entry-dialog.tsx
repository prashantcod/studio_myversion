
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
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useDataStore } from '@/lib/data-store';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export function TeacherEntryDialog() {
    const dataStore = useDataStore();
    const router = useRouter();
    const [name, setName] = useState('');
    const [expertise, setExpertise] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();

    const handleSubmit = () => {
        if (!name || !expertise) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please fill out all fields.',
            });
            return;
        }

        dataStore.addFaculty({
            name,
            expertise: expertise.split(',').map(e => e.trim()),
            availability: { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [] }
        });
        
        toast({
            title: 'Teacher Added',
            description: `${name} has been added to the faculty.`,
        });

        router.refresh();
        setName('');
        setExpertise('');
        setIsOpen(false);
    }

    const onOpenChange = (open: boolean) => {
        setIsOpen(open);
        if(!open) {
            setName('');
            setExpertise('');
        }
    }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
            <Input id="name" placeholder="e.g. Dr. Jane Doe" className="col-span-3" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expertise" className="text-right">
              Expertise
            </Label>
            <Input id="expertise" placeholder="e.g. CSE101,PHY101" className="col-span-3" value={expertise} onChange={e => setExpertise(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
            </DialogClose>
          <Button type="submit" onClick={handleSubmit}>Save Teacher</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
