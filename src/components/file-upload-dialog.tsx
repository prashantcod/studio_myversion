
'use client';

import * as React from 'react';
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
import { FileUp, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDataStore } from '@/lib/data-store';
import { useRouter } from 'next/navigation';

export function FileUploadDialog() {
  const [file, setFile] = React.useState<File | null>(null);
  const dataStore = useDataStore();
  const { toast } = useToast();
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv') {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a CSV file.',
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        let teachersAdded = 0;
        let studentsAdded = 0;

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            const row: any = {};
            headers.forEach((header, index) => {
                row[header] = values[index].trim();
            });

            if (row.expertise) { // Heuristic: if it has expertise, it's a teacher
                dataStore.addFaculty({
                    name: row.name,
                    expertise: row.expertise.split(';'),
                    availability: { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [] } // Default availability
                });
                teachersAdded++;
            } else if (row.size && row.courses) { // Heuristic: if it has size and courses, it's a student group
                dataStore.addStudentGroup({
                    name: row.name,
                    size: parseInt(row.size, 10),
                    courses: row.courses.split(';')
                });
                studentsAdded++;
            }
        }
        
        toast({
            title: 'Upload Successful',
            description: `Added ${teachersAdded} teachers and ${studentsAdded} student groups.`,
        });

        setFile(null); // Reset file input
        router.refresh(); // Re-render to show new data
    };
    reader.readAsText(file);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="justify-start">
          <FileUp className="mr-2" />
          Upload User Data (CSV)
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload User Data</DialogTitle>
          <DialogDescription>
            Upload a CSV file with student group or faculty data. The system will add them to the dataset.
          </DialogDescription>
        </DialogHeader>

        {!file ? (
            <div className="flex w-full items-center justify-center py-12">
                 <Label htmlFor="user-file" className="flex cursor-pointer flex-col items-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/50 p-12 text-center hover:bg-muted/50">
                    <FileUp className="size-10 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Click to select a file</span>
                    <span className="text-xs text-muted-foreground">Supports: .csv</span>
                </Label>
                <Input id="user-file" type="file" className="sr-only" onChange={handleFileChange} accept=".csv" />
            </div>
        ) : (
             <div className="flex flex-col items-center gap-4 py-8 text-center">
                <p className="font-medium">File selected: <span className="font-normal text-muted-foreground">{file.name}</span></p>
                <p className="text-sm text-muted-foreground">Ready to process and upload.</p>
            </div>
        )}

        <DialogFooter>
          {file && (
             <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
            </DialogClose>
          )}
           {file && (
            <Button onClick={handleUpload}>
              <ArrowRight className="mr-2" />
              Confirm and Upload
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
