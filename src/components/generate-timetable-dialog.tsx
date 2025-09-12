
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
import { Wand2, Loader2, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { generateTimetable, TimetableResult, getConflictSuggestions } from '@/lib/timetable-generator';
import { Alert, AlertDescription } from './ui/alert';
import { TimetableView } from './timetable-view';


function GenerationSummary({ 
  result, 
  onApplySuggestion,
  onSuggestResolutions,
  isSuggesting,
  suggestions,
}: { 
  result: TimetableResult, 
  onApplySuggestion: () => void,
  onSuggestResolutions: () => Promise<void>,
  isSuggesting: boolean,
  suggestions: string[]
}) {

  if (result.conflicts.length === 0) {
    return (
       <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <CheckCircle2 className="size-5 text-green-600" />
          <CardTitle>Generation Complete</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No conflicts detected. All {result.timetable.length} classes have been successfully scheduled.
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
            onClick={onSuggestResolutions}
            disabled={isSuggesting}
          >
            {isSuggesting ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Lightbulb className="mr-2 size-4" />
            )}
            {isSuggesting ? 'Thinking...' : 'Suggest Resolutions'}
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">{result.timetable.length} classes were scheduled successfully, but {result.conflicts.length} conflicts remain.</p>
          <pre className="whitespace-pre-wrap rounded-md bg-destructive/10 p-4 text-xs font-medium text-destructive">
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
              <Alert key={index} className="flex items-center justify-between">
                <div className="flex items-start">
                  <Lightbulb className="mr-3 mt-1 size-4" />
                  <AlertDescription>{suggestion}</AlertDescription>
                </div>
                <Button size="sm" onClick={onApplySuggestion}>Apply</Button>
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
  
  const [isSuggesting, setIsSuggesting] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);


  const handleGenerate = React.useCallback(async () => {
    setIsLoading(true);
    setResult(null);
    setSuggestions([]);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const response = await generateTimetable();
      setResult(response);
      toast({
        title: 'Timetable Generated',
        description: `${response.timetable.length} classes scheduled with ${response.conflicts.length} conflicts.`,
      });
    } catch (error) {
      console.error('Error generating timetable:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleSuggestResolutions = async () => {
    if (!result || result.conflicts.length === 0) return;

    setIsSuggesting(true);
    setSuggestions([]);
    try {
      // Use the local backend suggestion function
      const response = await getConflictSuggestions(result.conflicts, result.timetable);
      
      if (response && response.length > 0) {
        setSuggestions(response);
      } else {
        setSuggestions(["The suggestion engine could not find a simple resolution. Consider increasing faculty availability or adding more rooms."]);
      }

    } catch (error) {
      console.error('Error suggesting resolutions:', error);
      toast({
        variant: 'destructive',
        title: 'Suggestion Failed',
        description: 'Could not get suggestions from the backend. Please try again.',
      });
      setSuggestions(["An error occurred while generating suggestions. Please check the console."]);
    } finally {
      setIsSuggesting(false);
    }
  };


  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setIsLoading(false);
      setResult(null);
      setSuggestions([]);
      setIsSuggesting(false);
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
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Generate Timetable</DialogTitle>
          <DialogDescription>
            Initiate the timetable generation process. The system will use a hybrid algorithm to create an optimized, conflict-free schedule.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {!result && !isLoading && (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/50 p-12 text-center">
              <Wand2 className="size-12 text-primary" />
              <h3 className="text-lg font-semibold">Ready to Generate</h3>
              <p className="text-sm text-muted-foreground">
                Click the button below to start the AI-assisted generation process.
              </p>
              <Button onClick={handleGenerate}>
                <Wand2 className="mr-2" />
                Generate Now
              </Button>
            </div>
          )}

          {isLoading && (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4 p-12 text-center">
              <Loader2 className="size-12 animate-spin text-primary" />
              <h3 className="text-lg font-semibold">Generating Timetable...</h3>
              <p className="text-sm text-muted-foreground">
                The algorithm is analyzing constraints and creating a schedule. Please wait.
              </p>
            </div>
          )}

          {result && (
            <ScrollArea className="h-[70vh]">
              <div className="grid grid-cols-1 gap-6 p-1 lg:grid-cols-3">
                 <div className="lg:col-span-2">
                    {result.timetable.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Generated Timetable Draft</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <TimetableView schedule={result.timetable} />
                        </CardContent>
                      </Card>
                    )}
                 </div>
                 <div className="lg:col-span-1">
                    <GenerationSummary 
                      result={result} 
                      onApplySuggestion={handleGenerate}
                      onSuggestResolutions={handleSuggestResolutions}
                      isSuggesting={isSuggesting}
                      suggestions={suggestions}
                    />
                 </div>
              </div>
            </ScrollArea>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
