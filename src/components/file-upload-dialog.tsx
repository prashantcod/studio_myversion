
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
import { FileUp, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadDataAction } from '@/app/actions/upload-data';
import { useRouter } from 'next/navigation';

export function FileUploadDialog() {
  const [file, setFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
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

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
        const content = e.target?.result as string;
        const result = await uploadDataAction(content);
        
        setIsUploading(false);

        if (result.success) {
            toast({
                title: 'Upload Successful',
                description: result.message,
            });
            setFile(null);
            // Trigger a re-render of the current route to fetch new data
            router.refresh(); 
        } else {
             toast({
                variant: 'destructive',
                title: 'Upload Failed',
                description: result.message,
            });
        }
    };

    reader.onerror = () => {
        setIsUploading(false);
        toast({
            variant: 'destructive',
            title: 'File Read Error',
            description: 'Could not read the selected file.',
        });
    };

    reader.readAsText(file);
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setFile(null);
      setIsUploading(false);
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange}>
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
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading && <Loader2 className="mr-2 animate-spin" />}
              {isUploading ? 'Uploading...' : 'Confirm and Upload'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
