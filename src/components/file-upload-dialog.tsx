
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// This is a mock function simulating a call to your backend's Gemini mapping feature.
const getGeminiColumnMappingMock = async (fileHeaders: string[]) => {
  // In a real app, this would be a fetch call to your FastAPI backend:
  // const response = await fetch('/api/admin/get_mapping', { method: 'POST', body: JSON.stringify({ headers: fileHeaders }) });
  // const mapping = await response.json();
  // return mapping;

  console.log('Simulating Gemini mapping for headers:', fileHeaders);
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Pre-defined mock response based on your backend description
  const mockMapping = {
    userId: 'USER ID',
    name: 'Full Name',
    email: 'Email Address',
    role: 'Role',
    department: 'Department',
  };

  // Create a dynamic mapping based on found headers
  const resultingMapping: { dbField: string; fileColumn: string | null }[] = [];
  const dbSchema = ['userId', 'name', 'email', 'role', 'department'];

  dbSchema.forEach(field => {
    let foundColumn = null;
    // A very simple matching logic for the mock
    for (const header of fileHeaders) {
      if (header.toLowerCase().includes(field.toLowerCase())) {
        foundColumn = header;
        break;
      }
    }
    // Try to find a match in the mock mapping if not found by simple logic
    if (!foundColumn) {
      const mappedHeader = mockMapping[field as keyof typeof mockMapping];
      if (fileHeaders.includes(mappedHeader)) {
        foundColumn = mappedHeader;
      }
    }

    resultingMapping.push({ dbField: field, fileColumn: foundColumn });
  });

  return resultingMapping;
};

export function FileUploadDialog() {
  const [file, setFile] = React.useState<File | null>(null);
  const [fileHeaders, setFileHeaders] = React.useState<string[]>([]);
  const [mapping, setMapping] = React.useState<{ dbField: string; fileColumn: string | null }[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Basic validation for file type (can be expanded)
      if (!['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(selectedFile.type)) {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a CSV or Excel file.',
        });
        return;
      }
      setFile(selectedFile);
      // Mock header extraction
      // In a real app, you might use a library like 'papaparse' or 'xlsx' on the client
      // or send the file to the backend to get headers.
      const mockHeaders = ['USER ID', 'Full Name', 'Email Address', 'Role', 'Department', 'Start Date'];
      setFileHeaders(mockHeaders);
    }
  };

  const handleFetchMapping = async () => {
    if (!file) return;
    setIsLoading(true);
    try {
      const result = await getGeminiColumnMappingMock(fileHeaders);
      setMapping(result);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Mapping Failed',
        description: 'Could not get column mapping from the AI.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);
    // In a real application, you would now send the file to '/admin/upload_users'
    // const formData = new FormData();
    // formData.append('file', file);
    // await fetch('/admin/upload_users', { method: 'POST', body: formData });

    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsUploading(false);
    setFile(null);
    setMapping([]);
    setFileHeaders([]);
    
    toast({
      title: 'Upload Successful',
      description: 'The user data has been processed and added to the database.',
    });
  };

  // Reset state when dialog is closed
  const onOpenChange = (open: boolean) => {
    if (!open) {
      setFile(null);
      setFileHeaders([]);
      setMapping([]);
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="justify-start">
          <FileUp className="mr-2" />
          Upload a Single File
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload User Data</DialogTitle>
          <DialogDescription>
            Upload an Excel or CSV file with user data. The system will use AI to automatically map the columns.
          </DialogDescription>
        </DialogHeader>

        {!file && (
            <div className="flex w-full items-center justify-center py-12">
                 <Label htmlFor="user-file" className="flex cursor-pointer flex-col items-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/50 p-12 text-center hover:bg-muted/50">
                    <FileUp className="size-10 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Click to select a file or drag and drop</span>
                    <span className="text-xs text-muted-foreground">Supports: CSV, XLS, XLSX</span>
                </Label>
                <Input id="user-file" type="file" className="sr-only" onChange={handleFileChange} accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
            </div>
        )}

        {file && !mapping.length && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
                <p className="font-medium">File selected: <span className="font-normal text-muted-foreground">{file.name}</span></p>
                <p className="text-sm text-muted-foreground">File headers detected: {fileHeaders.join(', ')}</p>
                 <Button onClick={handleFetchMapping} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 animate-spin" />}
                    {isLoading ? 'Analyzing...' : 'Get AI Column Mapping'}
                 </Button>
            </div>
        )}
        
        {mapping.length > 0 && (
          <div className='py-4'>
            <h3 className="mb-2 font-semibold">Confirm Data Mapping</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Our AI has suggested the following column mappings. Please review them before uploading.
            </p>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Your File Column</TableHead>
                    <TableHead className="w-8"></TableHead>
                    <TableHead>Database Field</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mapping.map(({ dbField, fileColumn }) => (
                    <TableRow key={dbField}>
                      <TableCell>
                        {fileColumn ? (
                          <span className="rounded-md bg-muted px-2 py-1 text-sm font-medium">{fileColumn}</span>
                        ) : (
                          <span className="rounded-md bg-destructive/10 px-2 py-1 text-sm font-medium text-destructive">Not Found</span>
                        )}
                      </TableCell>
                      <TableCell className="px-0">
                        <ArrowRight className="size-4 text-muted-foreground" />
                      </TableCell>
                       <TableCell className="font-mono text-sm">{dbField}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}


        <DialogFooter>
          {mapping.length > 0 && (
             <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
            </DialogClose>
          )}
           {mapping.length > 0 && (
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
