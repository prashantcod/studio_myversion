
'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { ClipboardEdit, Files, PenSquare } from 'lucide-react';
import { StudentEntryDialog } from './student-entry-dialog';
import { TeacherEntryDialog } from './teacher-entry-dialog';
import { FileUploadDialog } from './file-upload-dialog';

function ManualEntryDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="justify-start">
          <PenSquare className="mr-2" />
          Manual Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manual Entry</DialogTitle>
          <DialogDescription>
            Select the type of data you want to enter manually.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <StudentEntryDialog />
          <TeacherEntryDialog />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DataEntryDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <ClipboardEdit />
            Data Entry
          </SidebarMenuButton>
        </SidebarMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Data Entry Options</DialogTitle>
          <DialogDescription>
            Choose how you would like to input data into the system.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <FileUploadDialog />
          <ManualEntryDialog />
        </div>
      </DialogContent>
    </Dialog>
  );
}
