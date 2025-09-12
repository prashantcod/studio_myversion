
'use client';
import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Wand2, Loader2, FileText, AlertTriangle, Lightbulb } from 'lucide-react';
import {
  generateDraftTimetable,
  GenerateDraftTimetableOutput,
} from '@/ai/flows/generate-draft-timetable';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

export function GenerateTimetableDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<GenerateDraftTimetableOutput | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      // Mock data for the flow input
      const input = {
        courseData: 'CSE101, CSE102, ECE101',
        facultyAvailability: 'Prof A: Mon-Wed, Prof B: Wed-Fri',
        studentPreferences: 'Student 1: CSE101, Student 2: ECE101',
        roomAvailability: 'Room 101: all week, Room 102: Mon, Wed',
      };
      const response = await generateDraftTimetable(input);
      setResult(response);
    } catch (error) {
      console.error('Error generating timetable:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'An unexpected error occurred while generating the timetable.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset state when closing
      setIsLoading(false);
      setResult(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Generate Timetable">
            <Wand2 />
            Generate Timetable
          </SidebarMenuButton>
        </SidebarMenuItem>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Generate AI-Powered Timetable</DialogTitle>
          <DialogDescription>
            Initiate the AI to generate a draft timetable based on the current data.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {!result && !isLoading && (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/50 p-12 text-center">
              <Wand2 className="size-12 text-primary" />
              <h3 className="text-lg font-semibold">Ready to Generate</h3>
              <p className="text-sm text-muted-foreground">
                Click the button below to start the AI generation process.
              </p>
              <Button onClick={handleGenerate}>
                <Wand2 className="mr-2" />
                Generate Now
              </Button>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
              <Loader2 className="size-12 animate-spin text-primary" />
              <h3 className="text-lg font-semibold">Generating Timetable...</h3>
              <p className="text-sm text-muted-foreground">
                The AI is analyzing constraints and creating an optimized schedule. This may take a moment.
              </p>
            </div>
          )}

          {result && (
            <ScrollArea className="h-[60vh]">
              <div className="grid grid-cols-1 gap-6 p-1 md:grid-cols-2">
                <Card>
                  <CardHeader className="flex flex-row items-center gap-2">
                    <FileText className="size-5 text-primary" />
                    <CardTitle>Timetable Draft</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap rounded-md bg-muted p-4 text-xs">{result.timetableDraft}</pre>
                  </CardContent>
                </Card>
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center gap-2">
                      <AlertTriangle className="size-5 text-destructive" />
                      <CardTitle>Detected Conflicts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{result.conflicts || 'No conflicts detected.'}</p>
                    </CardContent>
                  </Card>
                   <Card>
                    <CardHeader className="flex flex-row items-center gap-2">
                      <Lightbulb className="size-5 text-yellow-500" />
                      <CardTitle>Suggestions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{result.suggestions}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </ScrollArea>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          {result && (
            <Button onClick={handleGenerate} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 animate-spin" />
                  Regenerating...
                </>
              ) : (
                'Regenerate'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
