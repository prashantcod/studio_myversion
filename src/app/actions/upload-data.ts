
'use server';

import { useDataStore } from '@/lib/data-store';

function parseCSV(csvContent: string): Record<string, string>[] {
    const lines = csvContent.trim().split('\n');
    const header = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
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
                    expertise: item.expertise ? item.expertise.split(';') : [],
                    availability: item.availability ? JSON.parse(item.availability) : {},
                });
                teachersAdded++;
            } else if (item.size || item.courses) { // Likely a student group
                 dataStore.addStudentGroup({
                    name: item.name,
                    size: parseInt(item.size, 10),
                    courses: item.courses ? item.courses.split(';') : [],
                });
                studentsAdded++;
            }
        }
        
        return { success: true, message: `Successfully added ${teachersAdded} teachers and ${studentsAdded} student groups.` };

    } catch (error) {
        console.error('Error processing uploaded file:', error);
        return { success: false, message: 'Failed to process file. Please check the file format and content.' };
    }
}
