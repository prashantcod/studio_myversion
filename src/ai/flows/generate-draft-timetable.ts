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
  prompt: `You are an expert AI system designed to generate university timetables. Your methodology is a hybrid approach, combining a **Constraint Solver** for hard constraints and a **Genetic Algorithm** for optimization.

Your primary goal is to create a **conflict-free** and **optimized** weekly timetable that strictly adheres to **NEP 2020 guidelines**.

**Your Inputs:**
- Course Data: {{{courseData}}}
- Faculty Availability & Workload: {{{facultyAvailability}}}
- Student Elective Choices: {{{studentPreferences}}}
- Room Availability & Capacity: {{{roomAvailability}}}

**Constraint Satisfaction (Hard Rules - MUST be met):**
1.  **No Clashes:** A faculty member, a student group, or a room cannot be scheduled for more than one class at the same time.
2.  **Availability:** All scheduling must respect the specified availability of faculty and rooms.
3.  **Credit Hours:** Ensure the total scheduled hours for each course match its credit requirements (theory/practical split).
4.  **Room Capacity:** A class cannot be scheduled in a room with a capacity smaller than the number of enrolled students.
5.  **Room Type:** Practical sessions must be in labs; theory classes in classrooms.

**Genetic Algorithm Optimization (Soft Goals - STRIVE to achieve):**
1.  **Minimize Teacher Workload:** Distribute teaching hours evenly across the week. Avoid scheduling a single teacher for too many consecutive hours.
2.  **Compact Schedules:** Minimize gaps in schedules for both students and faculty.
3.  **NEP Flexibility:** Effectively accommodate major, minor, skill-based, and ability enhancement courses. Prioritize student elective choices.
4.  **Maximize Preferred Slots:** Whenever possible, schedule faculty during their preferred teaching times.

**Your Task:**
1.  Analyze all the provided data and constraints.
2.  Generate a draft timetable in a clear, structured JSON format. The JSON should be an array of schedule entries, where each entry contains: {day, time_slot, course_code, course_name, faculty_name, room_name, student_group}.
3.  Identify and list any remaining hard constraint violations as 'conflicts'. If the timetable is conflict-free, state this clearly.
4.  Provide actionable 'suggestions' for further optimization based on the soft goals.
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
