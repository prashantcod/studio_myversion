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
  prompt: `You are an expert timetable scheduler. Given the following scheduling conflict, suggest several potential resolutions. Be specific and consider various options like moving courses, reassigning faculty, or using different rooms. Provide each resolution in a detailed sentence.

Conflict Description: {{{conflictDescription}}}

{{#if timetableSnapshot}}
Current Timetable Snapshot: {{{timetableSnapshot}}}
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