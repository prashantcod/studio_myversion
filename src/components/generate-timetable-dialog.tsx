
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
import { Wand2, Loader2, FileText, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { generateTimetable, TimetableResult } from '@/lib/timetable-generator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { suggestConflictResolutions } from '@/ai/flows/suggest-conflict-resolutions';
import { Alert, AlertDescription } from './ui/alert';


function GenerationSummary({ result }: { result: TimetableResult }) {
  const [isSuggesting, setIsSuggesting] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const { toast } = useToast();

  const handleSuggestResolutions = async () => {
    setIsSuggesting(true);
    setSuggestions([]);
    try {
      const conflictText = result.conflicts.join('\n');
      const response = await suggestConflictResolutions({
        conflictDescription: `The following conflicts occurred during timetable generation:\n${conflictText}`,
        timetableSnapshot: JSON.stringify(result.timetable, null, 2),
      });
      setSuggestions(response.suggestedResolutions);
    } catch (error) {
      console.error('Error suggesting resolutions:', error);
      toast({
        variant: 'destructive',
        title: 'Suggestion Failed',
        description: 'Could not get suggestions from the AI.',
      });
    } finally {
      setIsSuggesting(false);
    }
  };


  if (result.conflicts.length === 0) {
    return (
       <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <CheckCircle2 className="size-5 text-green-600" />
          <CardTitle>Generation Complete</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No conflicts detected. The timetable is valid and all classes have been scheduled.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-destructive" />
            <CardTitle>Unresolved Conflicts</CardTitle>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleSuggestResolutions}
            disabled={isSuggesting}
          >
            {isSuggesting ? (
              <Loader2 className="mr-2 animate-spin" />
            ) : (
              <Lightbulb className="mr-2" />
            )}
            Suggest Resolutions
          </Button>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap rounded-md bg-destructive/10 p-4 text-xs text-destructive-foreground">
            {JSON.stringify(result.conflicts, null, 2)}
          </pre>
        </CardContent>
      </Card>
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="size-5 text-primary" />
              Resolution Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <Alert key={index}>
                <Lightbulb className="size-4" />
                <AlertDescription>{suggestion}</AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}


export function GenerateTimetableDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<TimetableResult | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    setResult(null);
    try {
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
              <div className="grid grid-cols-1 gap-6 p-1">
                 {result.timetable.length > 0 && (
                  <Card>
                    <CardHeader className="flex flex-row items-center gap-2">
                      <FileText className="size-5 text-primary" />
                      <CardTitle>Generated Timetable Draft</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Day</TableHead>
                            <TableHead>Time Slot</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Faculty</TableHead>
                            <TableHead>Room</TableHead>
                            <TableHead>Group</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {result.timetable.map((entry, index) => (
                            <TableRow key={index}>
                              <TableCell>{entry.day}</TableCell>
                              <TableCell>{entry.timeSlot}</TableCell>
                              <TableCell>
                                <div className="font-medium">{entry.courseCode}</div>
                                <div className="text-xs text-muted-foreground">{entry.courseName}</div>
                              </TableCell>
                              <TableCell>{entry.facultyName}</TableCell>
                              <TableCell>{entry.roomId}</TableCell>
                              <TableCell>{entry.studentGroup}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
                <GenerationSummary result={result} />
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

    