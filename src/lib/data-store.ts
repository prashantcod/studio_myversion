
import { courses as initialCourses } from './data/courses.json';
import { rooms as initialRooms } from './data/rooms.json';
import { faculty as initialFaculty, Faculty } from './data/faculty.json';
import { studentGroups as initialStudentGroups, StudentGroup } from './data/students.json';
import { ScheduleEntry } from '@/app/api/timetable/route';

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

export type Notification = {
    id: string;
    type: 'leaveRequest' | 'timetableGenerated' | 'conflictResolved' | 'roomBooked';
    title: string;
    description: string;
    isRead: boolean;
    timestamp: Date;
    payload: Record<string, any>;
}

type DataStore = {
    courses: Course[];
    rooms: Room[];
    faculty: Faculty[];
    studentGroups: StudentGroup[];
    leaveRequests: LeaveRequest[];
    notifications: Notification[];
    timetable: ScheduleEntry[];
    addFaculty: (faculty: Omit<Faculty, 'id'>) => void;
    addStudentGroup: (group: Omit<StudentGroup, 'id'>) => void;
    addLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'status'>) => void;
    updateLeaveRequestStatus: (id: string, status: LeaveRequest['status']) => void;
    markNotificationAsRead: (id: string) => void;
    bookRoom: (booking: Omit<ScheduleEntry, 'isOnLeave'>) => void;
    setTimetable: (newTimetable: ScheduleEntry[]) => void;
};

// In-memory data store
let dataStore: DataStore = {
    courses: initialCourses,
    rooms: initialRooms,
    faculty: [...initialFaculty],
    studentGroups: [...initialStudentGroups],
    timetable: [],
    leaveRequests: [
        {
            id: 'LR-DEMO-001',
            facultyId: 'F001',
            facultyName: 'Dr. Alan Turing',
            startDate: new Date(),
            endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
            reason: 'Attending the International Conference on Computational Theory. I will be unavailable for all scheduled classes during this period.',
            status: 'pending'
        },
        {
            id: 'LR-DEMO-002',
            facultyId: 'F002',
            facultyName: 'Dr. Grace Hopper',
            startDate: new Date(new Date().setDate(new Date().getDate() + 5)),
            endDate: new Date(new Date().setDate(new Date().getDate() + 6)),
            reason: 'Personal leave for a family matter. Apologies for the short notice.',
            status: 'pending'
        },
        {
            id: 'LR-DEMO-003',
            facultyId: 'F003',
            facultyName: 'Prof. Ada Lovelace',
            startDate: new Date(new Date().setDate(new Date().getDate() + 10)),
            endDate: new Date(new Date().setDate(new Date().getDate() + 15)),
            reason: 'Taking a pre-approved professional development course.',
            status: 'pending'
        }
    ],
    notifications: [
        {
            id: 'NOTIF-001',
            type: 'leaveRequest',
            title: 'New Leave Request',
            description: 'Dr. Alan Turing has requested leave.',
            isRead: false,
            timestamp: new Date(),
            payload: {
                leaveRequestId: 'LR-DEMO-001'
            }
        },
        {
            id: 'NOTIF-004',
            type: 'leaveRequest',
            title: 'New Leave Request',
            description: 'Dr. Grace Hopper has requested leave.',
            isRead: false,
            timestamp: new Date(new Date().getTime() - 60000 * 30), // 30 mins ago
            payload: {
                leaveRequestId: 'LR-DEMO-002'
            }
        },
         {
            id: 'NOTIF-005',
            type: 'leaveRequest',
            title: 'New Leave Request',
            description: 'Prof. Ada Lovelace has requested leave.',
            isRead: true,
            timestamp: new Date(new Date().getTime() - 60000 * 60 * 2), // 2 hours ago
            payload: {
                leaveRequestId: 'LR-DEMO-003'
            }
        },
        {
            id: 'NOTIF-002',
            type: 'timetableGenerated',
            title: 'Timetable Generated',
            description: 'A new master timetable was successfully generated with 2 conflicts.',
            isRead: true,
            timestamp: new Date(new Date().setDate(new Date().getDate() -1)),
            payload: {
                conflictCount: 2
            }
        },
        {
            id: 'NOTIF-003',
            type: 'conflictResolved',
            title: 'Conflicts Resolved',
            description: 'All scheduling conflicts have been successfully resolved.',
            isRead: true,
            timestamp: new Date(new Date().setDate(new Date().getDate() -2)),
            payload: {}
        }
    ],
    addFaculty: (faculty) => {
        const newFaculty = { ...faculty, id: crypto.randomUUID() };
        dataStore.faculty.push(newFaculty);
    },
    addStudentGroup: (group) => {
        const newGroup = { ...group, id: crypto.randomUUID() };
        dataStore.studentGroups.push(newGroup);
    },
    addLeaveRequest: (request) => {
        const newRequest: LeaveRequest = {
            ...request,
            id: `LR-${crypto.randomUUID()}`,
            status: 'pending'
        };
        dataStore.leaveRequests.push(newRequest);
        
        const newNotification: Notification = {
            id: `NOTIF-${crypto.randomUUID()}`,
            type: 'leaveRequest',
            title: 'New Leave Request',
            description: `${newRequest.facultyName} has requested leave.`,
            isRead: false,
            timestamp: new Date(),
            payload: {
                leaveRequestId: newRequest.id
            }
        };
        dataStore.notifications.unshift(newNotification);
    },
    updateLeaveRequestStatus: (id, status) => {
        const request = dataStore.leaveRequests.find(lr => lr.id === id);
        if (request) {
            request.status = status;
        }
        const notification = dataStore.notifications.find(n => n.payload.leaveRequestId === id);
        if(notification) {
            notification.isRead = true;
        }
    },
    markNotificationAsRead: (id) => {
        const notification = dataStore.notifications.find(n => n.id === id);
        if (notification) {
            notification.isRead = true;
        }
    },
    bookRoom: (booking) => {
        // Add to main timetable
        dataStore.timetable.push(booking);

        // Create notification
        const newNotification: Notification = {
            id: `NOTIF-${crypto.randomUUID()}`,
            type: 'roomBooked',
            title: 'Room Booked',
            description: `${booking.facultyName} booked ${booking.roomId} for ${booking.courseName}.`,
            isRead: false,
            timestamp: new Date(),
            payload: { ...booking }
        };
        dataStore.notifications.unshift(newNotification);
    },
    setTimetable: (newTimetable) => {
        dataStore.timetable = newTimetable;
    }
};

export const useDataStore = () => dataStore;
