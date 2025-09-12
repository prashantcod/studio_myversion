import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-timetable-conflicts.ts';
import '@/ai/flows/suggest-conflict-resolutions.ts';
