'use server';

/**
 * @fileOverview AI-powered draft timetable generation flow.
 *
 * - generateDraftTimetable - A function that generates a draft timetable.
 * - GenerateDraftTimetableInput - The input type for the generateDraftTimetable function.
 * - GenerateDraftTimetableOutput - The return type for the generateDraftTimetable function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDraftTimetableInputSchema = z.object({
  courseData: z
    .string()
    .describe("Structured data representing courses (course codes, credits, theory/practical split)."),
  facultyAvailability: z
    .string()
    .describe("Structured data representing faculty availability, preferences, and workload constraints."),
  studentPreferences: z
    .string()
    .describe("Structured data representing student elective choices and enrolled credits."),
  roomAvailability: z
    .string()
    .describe("Structured data representing room/lab availability and capacity."),
});
export type GenerateDraftTimetableInput = z.infer<
  typeof GenerateDraftTimetableInputSchema
>;

const GenerateDraftTimetableOutputSchema = z.object({
  timetableDraft: z
    .string()
    .describe("A draft timetable in a structured format (e.g., JSON, CSV)."),
  conflicts: z
    .string()
    .describe("A list of any scheduling conflicts detected."),
  suggestions: z
    .string()
    .describe("Suggestions for resolving scheduling conflicts and optimizing the timetable."),
});
export type GenerateDraftTimetableOutput = z.infer<
  typeof GenerateDraftTimetableOutputSchema
>;

export async function generateDraftTimetable(
  input: GenerateDraftTimetableInput
): Promise<GenerateDraftTimetableOutput> {
  return generateDraftTimetableFlow(input);
}

const generateDraftTimetablePrompt = ai.definePrompt({
  name: 'generateDraftTimetablePrompt',
  input: {schema: GenerateDraftTimetableInputSchema},
  output: {schema: GenerateDraftTimetableOutputSchema},
  prompt: `You are an AI timetable generator that is able to generate conflict-free and optimized timetables based on the input data.

  Your inputs are:
  - Course Data: {{{courseData}}}
  - Faculty Availability: {{{facultyAvailability}}}
  - Student Preferences: {{{studentPreferences}}}
  - Room Availability: {{{roomAvailability}}}

  Generate a draft timetable in a structured format (e.g., JSON, CSV), list any scheduling conflicts detected, and provide suggestions for resolving these conflicts and optimizing the timetable.
  Make sure that timetable aligned with NEP 2020 which is based on multidisciplinary, flexibility, credit-based learning.
`,
});

const generateDraftTimetableFlow = ai.defineFlow(
  {
    name: 'generateDraftTimetableFlow',
    inputSchema: GenerateDraftTimetableInputSchema,
    outputSchema: GenerateDraftTimetableOutputSchema,
  },
  async input => {
    const {output} = await generateDraftTimetablePrompt(input);
    return output!;
  }
);
