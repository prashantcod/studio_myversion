
'use server';

import { useDataStore } from '@/lib/data-store';
import { revalidatePath } from 'next/cache';

function parseCSV(csvContent: string): Record<string, string>[] {
    const lines = csvContent.trim().split('\n');
    const header = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1).map(line => {
        // This is a simple parser, for a real app, use a robust library
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, ''));
        const rowObject: Record<string, string> = {};
        header.forEach((key, index) => {
            rowObject[key] = values[index];
        });
        return rowObject;
    });
    return rows;
}


export async function uploadDataAction(fileContent: string): Promise<{ success: boolean; message: string }> {
    try {
        const dataStore = useDataStore();
        const jsonData = parseCSV(fileContent);

        let teachersAdded = 0;
        let studentsAdded = 0;

        for (const item of jsonData) {
            // Heuristic to differentiate between teacher and student
            if (item.expertise || item.availability) { // Likely a teacher
                dataStore.addFaculty({
                    name: item.name,
                    // These fields would need more robust parsing in a real app
                    expertise: item.expertise ? item.expertise.split(';').map(e => e.trim()) : [],
                    availability: item.availability ? JSON.parse(item.availability) : { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [] },
                });
                teachersAdded++;
            } else if (item.size || item.courses) { // Likely a student group
                 dataStore.addStudentGroup({
                    name: item.name,
                    size: item.size ? parseInt(item.size, 10) : 0,
                    courses: item.courses ? item.courses.split(';').map(c => c.trim()) : [],
                });
                studentsAdded++;
            }
        }
        
        // Revalidate the path to reflect the changes in the UI.
        revalidatePath('/(app)/dashboard', 'layout');

        return { success: true, message: `Successfully added ${teachersAdded} teachers and ${studentsAdded} student groups.` };

    } catch (error) {
        console.error('Error processing uploaded file:', error);
        return { success: false, message: 'Failed to process file. Please check the file format and content.' };
    }
}
