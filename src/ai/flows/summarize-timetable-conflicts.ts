'use server';

/**
 * @fileOverview Summarizes timetable conflicts and their potential impact.
 *
 * - summarizeTimetableConflicts - A function that summarizes timetable conflicts.
 * - SummarizeTimetableConflictsInput - The input type for the summarizeTimetableConflicts function.
 * - SummarizeTimetableConflictsOutput - The return type for the summarizeTimetableConflicts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTimetableConflictsInputSchema = z.object({
  conflicts: z.string().describe('A list of timetable conflicts in JSON format.'),
});
export type SummarizeTimetableConflictsInput = z.infer<typeof SummarizeTimetableConflictsInputSchema>;

const SummarizeTimetableConflictsOutputSchema = z.object({
  summary: z.string().describe('A summary of the timetable conflicts and their potential impact.'),
});
export type SummarizeTimetableConflictsOutput = z.infer<typeof SummarizeTimetableConflictsOutputSchema>;

export async function summarizeTimetableConflicts(input: SummarizeTimetableConflictsInput): Promise<SummarizeTimetableConflictsOutput> {
  return summarizeTimetableConflictsFlow(input);
}

const summarizeTimetableConflictsPrompt = ai.definePrompt({
  name: 'summarizeTimetableConflictsPrompt',
  input: {schema: SummarizeTimetableConflictsInputSchema},
  output: {schema: SummarizeTimetableConflictsOutputSchema},
  prompt: `You are an administrator tasked with summarizing timetable conflicts and their potential impact so that you can prioritize resolving the most critical issues first.

  Here is a list of timetable conflicts:
  {{conflicts}}

  Provide a concise summary of the conflicts, including the number of students affected and the faculty members involved.
  Focus on the most critical issues and their potential impact on the academic schedule, so that you can prioritize accordingly.
  `,
});

const summarizeTimetableConflictsFlow = ai.defineFlow(
  {
    name: 'summarizeTimetableConflictsFlow',
    inputSchema: SummarizeTimetableConflictsInputSchema,
    outputSchema: SummarizeTimetableConflictsOutputSchema,
  },
  async input => {
    const {output} = await summarizeTimetableConflictsPrompt(input);
    return output!;
  }
);