
import { courses as initialCourses } from './data/courses.json';
import { rooms as initialRooms } from './data/rooms.json';
import { faculty as initialFaculty, Faculty } from './data/faculty.json';
import { studentGroups as initialStudentGroups, StudentGroup } from './data/students.json';


export type Course = (typeof initialCourses)[0];
export type Room = (typeof initialRooms)[0];

type DataStore = {
    courses: Course[];
    rooms: Room[];
    faculty: Faculty[];
    studentGroups: StudentGroup[];
    addFaculty: (faculty: Omit<Faculty, 'id'>) => void;
    addStudentGroup: (group: Omit<StudentGroup, 'id'>) => void;
};

// In-memory data store
let dataStore: DataStore = {
    courses: initialCourses,
    rooms: initialRooms,
    faculty: [...initialFaculty],
    studentGroups: [...initialStudentGroups],
    addFaculty: (faculty) => {
        const newFaculty = { ...faculty, id: `F${Date.now()}` };
        dataStore.faculty.push(newFaculty);
    },
    addStudentGroup: (group) => {
        const newGroup = { ...group, id: `SG${Date.now()}` };
        dataStore.studentGroups.push(newGroup);
    },
};

export const useDataStore = () => dataStore;
