
'use server';
import 'dotenv/config';

/**
 * @fileOverview Suggests resolutions for timetable conflicts using an AI agent.
 *
 * - suggestConflictResolutions - A function that calls the AI to get suggestions.
 * - SuggestConflictResolutionsInput - The input type for the function.
 * - SuggestConflictResolutionsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { courses } from '@/lib/data/courses.json';
import { faculty } from '@/lib/data/faculty.json';
import { rooms } from '@/lib/data/rooms.json';
import { studentGroups } from '@/lib/data/students.json';


const SuggestConflictResolutionsInputSchema = z.object({
  conflicts: z.string().describe('A JSON string representing the array of conflict messages.'),
  timetableSnapshot: z.string().describe('A JSON string representing the array of currently scheduled classes (ScheduleEntry[]).'),
});
export type SuggestConflictResolutionsInput = z.infer<typeof SuggestConflictResolutionsInputSchema>;

const SuggestConflictResolutionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array of actionable suggestions to resolve the conflicts.'),
});
export type SuggestConflictResolutionsOutput = z.infer<typeof SuggestConflictResolutionsOutputSchema>;


export async function suggestConflictResolutions(input: SuggestConflictResolutionsInput): Promise<SuggestConflictResolutionsOutput> {
  return suggestConflictResolutionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestConflictResolutionsPrompt',
  input: { schema: SuggestConflictResolutionsInputSchema },
  output: { schema: SuggestConflictResolutionsOutputSchema },
  prompt: `
    You are an expert university timetable scheduler. Your task is to resolve scheduling conflicts.
    You will be given a list of unresolved conflicts and a snapshot of the current timetable draft.
    You also have access to the master data for all courses, faculty, rooms, and student groups.

    Analyze the conflicts in the context of the current schedule and the master data.
    Your goal is to provide specific, actionable suggestions to resolve as many conflicts as possible.
    
    A good suggestion is a concrete action, for example:
    - "Move 'Intro to Programming Lab' for 'Computer Science - 1st Year' to Tuesday at 15:00-16:00 in LAB01, as Dr. Alan Turing and the room are available."
    - "Swap the timings of 'Basic Electronics' and 'Introductory Chemistry' for 'Electronics - 1st Year' on Monday."
    - "Assign an additional tutorial slot for 'Thermodynamics' on Friday afternoon."

    A bad suggestion is a vague one, like:
    - "Try scheduling the class at another time."
    - "Increase faculty availability."

    Here is the master data:
    - All Courses: ${JSON.stringify(courses)}
    - All Faculty & Availability: ${JSON.stringify(faculty)}
    - All Rooms: ${JSON.stringify(rooms)}
    - All Student Groups: ${JSON.stringify(studentGroups)}

    Here are the current problems:
    - Unresolved Conflicts: {{{conflicts}}}
    - Current Timetable Snapshot: {{{timetableSnapshot}}}

    Provide your suggestions to resolve the conflicts.
  `,
});

const suggestConflictResolutionsFlow = ai.defineFlow(
  {
    name: 'suggestConflictResolutionsFlow',
    inputSchema: SuggestConflictResolutionsInputSchema,
    outputSchema: SuggestConflictResolutionsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      return { suggestions: [] };
    }
    return output;
  }
);
