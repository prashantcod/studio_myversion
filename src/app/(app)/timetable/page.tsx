
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TimetableView } from "@/components/timetable-view";
import { generateTimetable } from "@/lib/timetable-generator";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDataStore } from "@/lib/data-store";

export default function TimetablePage() {
    const { timetable, setTimetable } = useDataStore();
    const [isLoading, setIsLoading] = useState(true);

    const fetchTimetable = async () => {
        setIsLoading(true);
        const result = await generateTimetable();
        setTimetable(result.timetable);
        setIsLoading(false);
    }

    useEffect(() => {
        if (timetable.length === 0) {
            fetchTimetable();
        } else {
            setIsLoading(false);
        }
    }, [timetable]);


    return (
        <div className="flex flex-col gap-4 py-4 md:gap-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Master Timetable</CardTitle>
                        <CardDescription>A complete overview of all scheduled classes for the semester.</CardDescription>
                    </div>
                     <Button onClick={fetchTimetable} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 animate-spin" /> : null}
                        Regenerate
                    </Button>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                         <div className="flex h-[60vh] flex-col items-center justify-center gap-4 p-12 text-center">
                            <Loader2 className="size-12 animate-spin text-primary" />
                            <h3 className="text-lg font-semibold">Generating Timetable...</h3>
                            <p className="text-sm text-muted-foreground">
                                Please wait while the schedule is being created.
                            </p>
                        </div>
                    ) : (
                        <TimetableView schedule={timetable} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
