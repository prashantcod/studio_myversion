
'use server';

import { addTeacherAction, addStudentGroupAction } from '@/app/actions/add-data';
import { revalidatePath } from 'next/cache';

function parseCSV(csvContent: string): Record<string, string>[] {
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) return [];
    
    // Trim headers and convert to lowercase for consistent matching
    const header = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const rows = lines.slice(1).map(line => {
        // This regex handles comma-separated values, including those in quotes
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, ''));
        const rowObject: Record<string, string> = {};
        header.forEach((key, index) => {
            // Ensure we don't try to access an index that doesn't exist
            if (index < values.length) {
                rowObject[key] = values[index];
            }
        });
        return rowObject;
    });
    return rows;
}


export async function uploadDataAction(fileContent: string): Promise<{ success: boolean; message: string }> {
    try {
        const jsonData = parseCSV(fileContent);

        if (jsonData.length === 0) {
            return { success: false, message: 'CSV file is empty or invalid.' };
        }

        let teachersAdded = 0;
        let studentsAdded = 0;
        let unknownRows = 0;

        for (const item of jsonData) {
            const lowerCaseKeys = Object.keys(item).reduce((acc, key) => {
                acc[key.toLowerCase()] = item[key];
                return acc;
            }, {} as Record<string, string>);

            // --- Robust Heuristics to identify teacher vs. student group ---
            const hasName = 'name' in lowerCaseKeys && lowerCaseKeys.name;

            // Teacher-specific keys
            const hasExpertise = 'expertise' in lowerCaseKeys || 'skills' in lowerCaseKeys;
            
            // Student-specific keys
            const hasSize = 'size' in lowerCaseKeys || 'groupsize' in lowerCaseKeys;
            const hasCourses = 'courses' in lowerCaseKeys || 'subjects' in lowerCaseKeys;
            
            if (!hasName) {
                unknownRows++;
                continue; // Skip rows without a name
            }

            if (hasExpertise) { // Treat as a teacher if 'expertise' or 'skills' is present
                const expertiseValue = lowerCaseKeys.expertise || lowerCaseKeys.skills || '';
                const availabilityValue = lowerCaseKeys.availability;
                let availabilityObject = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [] };
                try {
                    // Handle availability as a JSON string, allowing single quotes
                    if (availabilityValue && availabilityValue.trim().startsWith('{')) {
                         const parsed = JSON.parse(availabilityValue.replace(/'/g, '"')); 
                         if (typeof parsed === 'object') {
                            availabilityObject = { ...availabilityObject, ...parsed };
                         }
                    }
                } catch {
                    // Ignore parsing errors, use default empty availability
                }
                
                await addTeacherAction({
                    name: lowerCaseKeys.name,
                    expertise: expertiseValue ? expertiseValue.split(';').map(e => e.trim()) : [],
                    availability: availabilityObject,
                });
                teachersAdded++;

            } else if (hasSize && hasCourses) { // Treat as a student group if 'size' and 'courses' are present
                 const coursesValue = lowerCaseKeys.courses || lowerCaseKeys.subjects || '';
                 const sizeValue = lowerCaseKeys.size || lowerCaseKeys.groupsize || '0';
                 await addStudentGroupAction({
                    name: lowerCaseKeys.name,
                    size: parseInt(sizeValue, 10) || 0,
                    courses: coursesValue ? coursesValue.split(';').map(c => c.trim()) : [],
                });
                studentsAdded++;
            } else {
                unknownRows++;
            }
        }
        
        if (teachersAdded === 0 && studentsAdded === 0) {
            return { success: false, message: `No valid data found. Processed ${unknownRows} rows without recognized headers (e.g., name, expertise/skills, size, courses).` };
        }

        // Revalidate the entire layout to ensure all components using the data store are updated.
        revalidatePath('/(app)', 'layout');

        return { success: true, message: `Successfully added ${teachersAdded} teachers and ${studentsAdded} student groups.` };

    } catch (error) {
        console.error('Error processing uploaded file:', error);
        return { success: false, message: 'Failed to process file. Please check the file format and content.' };
    }
}
