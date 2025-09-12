
import { courses as initialCourses } from './data/courses.json';
import { rooms as initialRooms } from './data/rooms.json';
import { faculty as initialFaculty, Faculty } from './data/faculty.json';
import { studentGroups as initialStudentGroups, StudentGroup } from './data/students.json';


export type Course = (typeof initialCourses)[0];
export type Room = (typeof initialRooms)[0];

export type LeaveRequest = {
    id: string;
    facultyId: string;
    facultyName: string;
    startDate: Date;
    endDate: Date;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
};

type DataStore = {
    courses: Course[];
    rooms: Room[];
    faculty: Faculty[];
    studentGroups: StudentGroup[];
    leaveRequests: LeaveRequest[];
    addFaculty: (faculty: Omit<Faculty, 'id'>) => void;
    addStudentGroup: (group: Omit<StudentGroup, 'id'>) => void;
    addLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'status'>) => void;
    updateLeaveRequestStatus: (id: string, status: LeaveRequest['status']) => void;
};

// In-memory data store
let dataStore: DataStore = {
    courses: initialCourses,
    rooms: initialRooms,
    faculty: [...initialFaculty],
    studentGroups: [...initialStudentGroups],
    leaveRequests: [
        {
            id: 'LR-DEMO-001',
            facultyId: 'F001',
            facultyName: 'Dr. Alan Turing',
            startDate: new Date(),
            endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
            reason: 'Attending the International Conference on Computational Theory. I will be unavailable for all scheduled classes during this period.',
            status: 'pending'
        }
    ],
    addFaculty: (faculty) => {
        const newFaculty = { ...faculty, id: `F${Date.now()}` };
        dataStore.faculty.push(newFaculty);
    },
    addStudentGroup: (group) => {
        const newGroup = { ...group, id: `SG${Date.now()}` };
        dataStore.studentGroups.push(newGroup);
    },
    addLeaveRequest: (request) => {
        const newRequest: LeaveRequest = {
            ...request,
            id: `LR${Date.now()}`,
            status: 'pending'
        };
        dataStore.leaveRequests.push(newRequest);
    },
    updateLeaveRequestStatus: (id, status) => {
        const request = dataStore.leaveRequests.find(lr => lr.id === id);
        if (request) {
            request.status = status;
        }
    }
};

export const useDataStore = () => dataStore;
