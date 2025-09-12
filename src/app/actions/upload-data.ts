
'use server';

import { useDataStore } from '@/lib/data-store';
import { revalidatePath } from 'next/cache';

function parseCSV(csvContent: string): Record<string, string>[] {
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) return [];
    
    const header = lines[0].split(',').map(h => h.trim().toLowerCase());
    const rows = lines.slice(1).map(line => {
        // This regex handles quoted fields that may contain commas
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

        if (jsonData.length === 0) {
            return { success: false, message: 'CSV file is empty or invalid.' };
        }

        let teachersAdded = 0;
        let studentsAdded = 0;

        for (const item of jsonData) {
            const lowerCaseKeys = Object.keys(item).reduce((acc, key) => {
                acc[key.toLowerCase()] = item[key];
                return acc;
            }, {} as Record<string, string>);

            // Heuristics to identify teacher vs. student group
            const hasExpertise = 'expertise' in lowerCaseKeys || 'skills' in lowerCaseKeys;
            const hasAvailability = 'availability' in lowerCaseKeys;
            const hasCourses = 'courses' in lowerCaseKeys || 'subjects' in lowerCaseKeys;
            const hasSize = 'size' in lowerCaseKeys || 'groupsize' in lowerCaseKeys;
            const hasName = 'name' in lowerCaseKeys;

            if (!hasName) continue; // Skip rows without a name

            if (hasExpertise || hasAvailability) { // Likely a teacher
                const expertiseValue = lowerCaseKeys.expertise || lowerCaseKeys.skills || '';
                const availabilityValue = lowerCaseKeys.availability;
                let availabilityObject = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [] };
                try {
                    if (availabilityValue) {
                         const parsed = JSON.parse(availabilityValue);
                         if (typeof parsed === 'object') {
                            availabilityObject = parsed;
                         }
                    }
                } catch {
                    // Ignore parsing errors for availability, use default
                }
                
                dataStore.addFaculty({
                    name: lowerCaseKeys.name,
                    expertise: expertiseValue ? expertiseValue.split(';').map(e => e.trim()) : [],
                    availability: availabilityObject,
                });
                teachersAdded++;
            } else if (hasSize && hasCourses) { // Likely a student group
                 const coursesValue = lowerCaseKeys.courses || lowerCaseKeys.subjects || '';
                 dataStore.addStudentGroup({
                    name: lowerCaseKeys.name,
                    size: lowerCaseKeys.size ? parseInt(lowerCaseKeys.size, 10) : 0,
                    courses: coursesValue ? coursesValue.split(';').map(c => c.trim()) : [],
                });
                studentsAdded++;
            }
        }
        
        if (teachersAdded === 0 && studentsAdded === 0) {
            return { success: false, message: 'No valid teacher or student data found. Check CSV headers (e.g., name, expertise, size, courses).' };
        }

        // Revalidate the path to reflect the changes in the UI.
        revalidatePath('/(app)/dashboard', 'layout');

        return { success: true, message: `Successfully added ${teachersAdded} teachers and ${studentsAdded} student groups.` };

    } catch (error) {
        console.error('Error processing uploaded file:', error);
        return { success: false, message: 'Failed to process file. Please check the file format and content.' };
    }
}
