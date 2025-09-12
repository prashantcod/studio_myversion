
import { firestoreDb } from './firebase';
import { courses as initialCourses } from './data/courses.json';
import { rooms as initialRooms } from './data/rooms.json';

// This data store now interacts directly with your Firestore database.

// Define types based on your data structure.
// It's a good practice to have these align with your Firestore documents.
export type Faculty = {
  id: string;
  name: string;
  expertise: string[];
  availability: { [day: string]: string[] };
};

export type StudentGroup = {
  id: string;
  name: string;
  size: number;
  courses: string[];
};

export type Course = (typeof initialCourses)[0];
export type Room = (typeof initialRooms)[0];


// The dataStore object now contains functions that perform async CRUD operations.
const dataStore = {
  // Static data can still be served from JSON files if they don't change.
  getCourses: (): Course[] => initialCourses,
  getRooms: (): Room[] => initialRooms,
  
  // Fetches all faculty members from the 'faculty' collection in Firestore.
  getFaculty: async (): Promise<Faculty[]> => {
    const facultySnapshot = await firestoreDb.collection('faculty').get();
    if (facultySnapshot.empty) {
      console.warn('No faculty found in Firestore. Returning empty array.');
      return [];
    }
    return facultySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Faculty));
  },

  // Fetches all student groups from the 'studentGroups' collection in Firestore.
  getStudentGroups: async (): Promise<StudentGroup[]> => {
    const groupsSnapshot = await firestoreDb.collection('studentGroups').get();
     if (groupsSnapshot.empty) {
      console.warn('No student groups found in Firestore. Returning empty array.');
      return [];
    }
    return groupsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudentGroup));
  },

  // Adds a new faculty member to the 'faculty' collection.
  addFaculty: async (facultyMember: Omit<Faculty, 'id'>): Promise<void> => {
    // Firestore can auto-generate an ID, so we don't need to create one.
    await firestoreDb.collection('faculty').add(facultyMember);
  },

  // Adds a new student group to the 'studentGroups' collection.
  addStudentGroup: async (studentGroup: Omit<StudentGroup, 'id'>): Promise<void> => {
     await firestoreDb.collection('studentGroups').add(studentGroup);
  }
};

// useDataStore now provides access to your database functions.
export const useDataStore = () => dataStore;
