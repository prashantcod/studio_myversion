
'use server';

import { courses } from './data/courses.json';
import { faculty as initialFaculty } from './data/faculty.json';
import { rooms } from './data/rooms.json';
import { studentGroups as initialStudentGroups } from './data/students.json';
import { revalidatePath } from 'next/cache';

// This is a simplified in-memory "database" for demonstration purposes.
// In a real application, you would use a proper database like Firestore or PostgreSQL.

type Faculty = typeof initialFaculty[0];
type StudentGroup = typeof initialStudentGroups[0];

interface DataStore {
    faculty: Faculty[];
    studentGroups: StudentGroup[];
    getCourses: () => typeof courses;
    getRooms: () => typeof rooms;
    getFaculty: () => Faculty[];
    getStudentGroups: () => StudentGroup[];
    addFaculty: (facultyMember: Partial<Faculty>) => void;
    addStudentGroup: (studentGroup: Partial<StudentGroup>) => void;
}

const dataStore: DataStore = {
    faculty: [...initialFaculty],
    studentGroups: [...initialStudentGroups],
    getCourses: () => courses,
    getRooms: () => rooms,
    getFaculty: () => dataStore.faculty,
    getStudentGroups: () => dataStore.studentGroups,
    addFaculty: (facultyMember) => {
        const newId = `F${(dataStore.faculty.length + 1).toString().padStart(3, '0')}`;
        const newFaculty: Faculty = {
            id: newId,
            name: facultyMember.name || 'Unnamed Faculty',
            expertise: facultyMember.expertise || [],
            availability: facultyMember.availability || { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [] },
        };
        dataStore.faculty.push(newFaculty);
        revalidatePath('/(app)/dashboard'); // Revalidate to update UI
    },
    addStudentGroup: (studentGroup) => {
        const newId = `SG_${(dataStore.studentGroups.length + 1).toString()}`;
        const newStudentGroup: StudentGroup = {
            id: newId,
            name: studentGroup.name || 'Unnamed Group',
            size: studentGroup.size || 0,
            courses: studentGroup.courses || [],
        };
        dataStore.studentGroups.push(newStudentGroup);
        revalidatePath('/(app)/dashboard'); // Revalidate to update UI
    }
};

export const useDataStore = () => dataStore;
