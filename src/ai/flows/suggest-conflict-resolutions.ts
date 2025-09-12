// src/ai/flows/suggest-conflict-resolutions.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting conflict resolutions in a timetable.
 *
 * - suggestConflictResolutions - An async function that takes conflict details as input and returns suggested resolutions.
 * - SuggestConflictResolutionsInput - The input type for the suggestConflictResolutions function.
 * - SuggestConflictResolutionsOutput - The output type for the suggestConflictResolutions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestConflictResolutionsInputSchema = z.object({
  conflictDescription: z
    .string()
    .describe('A detailed description of the scheduling conflict.'),
  timetableSnapshot: z
    .string()
    .optional()
    .describe(
      'Optional: A snapshot of the current timetable as a string for context.'
    ),
});
export type SuggestConflictResolutionsInput = z.infer<
  typeof SuggestConflictResolutionsInputSchema
>;

const SuggestConflictResolutionsOutputSchema = z.object({
  suggestedResolutions: z
    .array(z.string())
    .describe('An array of suggested resolutions to the conflict.'),
});
export type SuggestConflictResolutionsOutput = z.infer<
  typeof SuggestConflictResolutionsOutputSchema
>;

export async function suggestConflictResolutions(
  input: SuggestConflictResolutionsInput
): Promise<SuggestConflictResolutionsOutput> {
  return suggestConflictResolutionsFlow(input);
}

const suggestConflictResolutionsPrompt = ai.definePrompt({
  name: 'suggestConflictResolutionsPrompt',
  input: {schema: SuggestConflictResolutionsInputSchema},
  output: {schema: SuggestConflictResolutionsOutputSchema},
  prompt: `You are an expert university timetable troubleshooter. Your task is to analyze a list of scheduling conflicts and the current draft of the timetable to provide specific, actionable resolutions.

Analyze the provided conflict description and the timetable snapshot to understand the root cause of each conflict (e.g., faculty double-booked, room unavailable, student group clash).

Based on your analysis, provide a list of concrete, actionable suggestions. Each suggestion should be a clear instruction that an administrator could follow.

Examples of good suggestions:
- "Move the 'Data Structures Lab (CSE201L)' for 'Computer Science - 2nd Year' to Friday at 14:00-15:00 in LAB02, as both the lab and the student group are free."
- "Assign 'Prof. Ada Lovelace' to 'Basic Electronics (ECE101)' on Wednesday at 11:00-12:00, which is currently an unassigned lecture for that group."
- "Swap the 'Thermodynamics (MECH210)' class on Monday with the 'Intro to Programming (CSE101)' class on Tuesday to resolve the faculty availability issue for Dr. Alan Turing."

Do not provide generic advice like "find another room" or "reschedule the class".

Conflict Description:
{{{conflictDescription}}}

{{#if timetableSnapshot}}
Current Successfully Scheduled Timetable (for context):
{{{timetableSnapshot}}}
{{/if}}
`,
});

const suggestConflictResolutionsFlow = ai.defineFlow(
  {
    name: 'suggestConflictResolutionsFlow',
    inputSchema: SuggestConflictResolutionsInputSchema,
    outputSchema: SuggestConflictResolutionsOutputSchema,
  },
  async input => {
    const {output} = await suggestConflictResolutionsPrompt(input);
    return output!;
  }
);
