
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
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { generateTimetable, TimetableResult } from '@/lib/timetable-generator';

export function GenerateTimetableDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<TimetableResult | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      // This now calls our local, deterministic generator
      const response = await generateTimetable();
      setResult(response);
      toast({
        title: 'Timetable Generated Successfully',
        description: `${response.timetable.length} classes scheduled with ${response.conflicts.length} conflicts.`,
      });
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
          <DialogTitle>Generate Timetable</DialogTitle>
          <DialogDescription>
            Initiate the timetable generation based on the mock data.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {!result && !isLoading && (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/50 p-12 text-center">
              <Wand2 className="size-12 text-primary" />
              <h3 className="text-lg font-semibold">Ready to Generate</h3>
              <p className="text-sm text-muted-foreground">
                Click the button below to start the generation process.
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
                The algorithm is analyzing constraints and creating a schedule.
              </p>
            </div>
          )}

          {result && (
            <ScrollArea className="h-[60vh]">
              <div className="grid grid-cols-1 gap-6 p-1 md:grid-cols-2">
                <Card className='md:col-span-2'>
                  <CardHeader className="flex flex-row items-center gap-2">
                    <FileText className="size-5 text-primary" />
                    <CardTitle>Generated Timetable Draft</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap rounded-md bg-muted p-4 text-xs">{JSON.stringify(result.timetable, null, 2)}</pre>
                  </CardContent>
                </Card>
                <div className="space-y-6 md:col-span-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center gap-2">
                      <AlertTriangle className="size-5 text-destructive" />
                      <CardTitle>Unresolved Conflicts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {result.conflicts.length > 0 ? (
                         <pre className="whitespace-pre-wrap rounded-md bg-destructive/10 p-4 text-xs text-destructive-foreground">{JSON.stringify(result.conflicts, null, 2)}</pre>
                      ) : (
                         <p className="text-sm text-muted-foreground">No conflicts detected. The timetable is valid.</p>
                      )}
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
