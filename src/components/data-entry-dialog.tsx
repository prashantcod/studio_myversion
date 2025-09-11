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
import { ClipboardEdit, FileUp, Files, PenSquare } from 'lucide-react';

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
          <Button variant="outline" className="justify-start">
            <FileUp className="mr-2" />
            Upload a Single File
          </Button>
          <Button variant="outline" className="justify-start">
            <Files className="mr-2" />
            Upload Multiple Files
          </Button>
          <Button variant="outline" className="justify-start">
            <PenSquare className="mr-2" />
            Manual Entry
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
