
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
import { Wand2, Loader2, AlertTriangle, Lightbulb, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Alert, AlertDescription } from './ui/alert';
import { TimetableView } from './timetable-view';
import { TimetableResult } from '@/app/api/timetable/route';
import { useDataStore } from '@/lib/data-store';


function GenerationSummary({
  result,
  onAutoResolve,
  isResolving,
  resolvedConflicts,
  generationId
}: {
  result: TimetableResult,
  onAutoResolve: () => Promise<void>,
  isResolving: boolean,
  resolvedConflicts: string[] | null,
  generationId: string,
}) {
  const hasConflicts = result.conflicts.length > 0;

  if (!hasConflicts) {
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
  
  if (resolvedConflicts) {
     return (
       <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <ShieldCheck className="size-5 text-blue-600" />
          <CardTitle>Conflicts Resolved</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">The system automatically resolved the following conflicts:</p>
          <pre className="whitespace-pre-wrap rounded-md bg-blue-600/10 p-4 text-xs font-medium text-blue-700">
            {JSON.stringify(resolvedConflicts, null, 2)}
          </pre>
        </CardContent>
      </Card>
     )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-destructive" />
            <CardTitle>Unresolved Conflicts</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground mb-2">{result.timetable.length} classes were scheduled successfully, but {result.conflicts.length} conflicts remain.</p>
          <pre className="whitespace-pre-wrap rounded-md bg-destructive/10 p-4 text-xs font-medium text-destructive">
            {JSON.stringify(result.conflicts, null, 2)}
          </pre>
           <Button
            className="w-full"
            onClick={onAutoResolve}
            disabled={isResolving}
          >
            {isResolving ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 size-4" />
            )}
            {isResolving ? 'Resolving...' : 'Auto-Resolve Conflicts'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function ViewGenerationDialog({ children, generationId }: { children: React.ReactNode, generationId: string }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isResolving, setIsResolving] = React.useState(false);
  const [result, setResult] = React.useState<TimetableResult | null>(null);
  const [resolvedConflicts, setResolvedConflicts] = React.useState<string[] | null>(null);
  const { toast } = useToast();
  const { setTimetable, updateRecentGeneration } = useDataStore();


  const handleGenerate = React.useCallback(async (isInitialLoad = false) => {
    if(isInitialLoad) setIsLoading(true);
    setResult(null);
    setResolvedConflicts(null);

    try {
        const response = await fetch('/api/timetable');
        const apiResult: TimetableResult = await response.json();
        
        setResult(apiResult);
        setTimetable(apiResult.timetable); // Update global store
        
        const generationUpdate = { 
            conflicts: apiResult.conflicts.length, 
            status: apiResult.conflicts.length > 0 ? 'Failed' : 'Completed' as 'Failed' | 'Completed'
        };
        updateRecentGeneration(generationId, generationUpdate);

        if (isInitialLoad) {
          if (apiResult.conflicts.length > 0) {
              toast({
                  title: 'Timetable Generated with Conflicts',
                  description: `Found ${apiResult.conflicts.length} conflicts.`,
              });
          } else {
              toast({
                  title: 'Timetable Generated Successfully',
              });
          }
        }

    } catch (error) {
        console.error('Error generating timetable:', error);
        toast({
            variant: 'destructive',
            title: 'Generation Failed',
            description: 'An unexpected error occurred while generating the timetable.',
        });
    } finally {
        if(isInitialLoad) setIsLoading(false);
    }
  }, [toast, setTimetable, generationId, updateRecentGeneration]);

  const handleAutoResolve = async () => {
    if (!result || result.conflicts.length === 0) return;

    setIsResolving(true);
    const originalConflicts = [...result.conflicts];

    // For this demo, we'll assume the backend can resolve conflicts by simply re-running.
    // In a real app, you might pass a flag or the specific conflicts to resolve.
    await handleGenerate(false); // Regenerate without the initial loading state

    // After regeneration, check the new result state
    // This relies on `handleGenerate` updating the `result` state variable.
    // We'll use a short timeout to ensure state has propagated.
    setTimeout(() => {
        setResolvedConflicts(originalConflicts);
        toast({
            title: 'Conflicts Resolved',
            description: 'The timetable has been updated to resolve the detected conflicts.',
        });
        setIsResolving(false);
    }, 500); // 500ms delay to allow state to update
  };


  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      handleGenerate(true);
    } else {
      setIsLoading(false);
      setResult(null);
      setIsResolving(false);
      setResolvedConflicts(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>View Timetable Generation: {generationId}</DialogTitle>
          <DialogDescription>
            Review the generated timetable and automatically resolve conflicts.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading && (
            <div className="flex h-[70vh] flex-col items-center justify-center gap-4 p-12 text-center">
              <Loader2 className="size-12 animate-spin text-primary" />
              <h3 className="text-lg font-semibold">Analyzing Timetable...</h3>
              <p className="text-sm text-muted-foreground">
                Please wait while we process the generation result.
              </p>
            </div>
          )}

          {result && (
            <ScrollArea className="h-[70vh]">
              <div className="grid grid-cols-1 gap-6 p-1 lg:grid-cols-3">
                 <div className="lg:col-span-2">
                    {result.timetable.length > 0 ? (
                      <Card>
                        <CardHeader>
                          <CardTitle>Generated Timetable Draft</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <TimetableView schedule={result.timetable} />
                        </CardContent>
                      </Card>
                    ) : (
                         <div className="flex h-[60vh] flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/50 p-12 text-center">
                            <AlertTriangle className="size-12 text-destructive" />
                            <h3 className="text-lg font-semibold">No Classes Scheduled</h3>
                            <p className="text-sm text-muted-foreground">
                                The generation process could not schedule any classes. Check the conflicts panel.
                            </p>
                        </div>
                    )}
                 </div>
                 <div className="lg:col-span-1">
                    <GenerationSummary
                      result={result}
                      onAutoResolve={handleAutoResolve}
                      isResolving={isResolving}
                      resolvedConflicts={resolvedConflicts}
                      generationId={generationId}
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
