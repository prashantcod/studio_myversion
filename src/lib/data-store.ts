
'use server';
import { firestoreDb } from './firebase';
import { courses as initialCourses } from './data/courses.json';
import { rooms as initialRooms } from './data/rooms.json';


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


export const getCourses = async (): Promise<Course[]> => initialCourses;
export const getRooms = async (): Promise<Room[]> => initialRooms;

export const getFaculty = async (): Promise<Faculty[]> => {
  const facultySnapshot = await firestoreDb.collection('faculty').get();
  if (facultySnapshot.empty) {
    console.warn('No faculty found in Firestore. Returning empty array.');
    return [];
  }
  return facultySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Faculty));
};

export const getStudentGroups = async (): Promise<StudentGroup[]> => {
  const groupsSnapshot = await firestoreDb.collection('studentGroups').get();
    if (groupsSnapshot.empty) {
    console.warn('No student groups found in Firestore. Returning empty array.');
    return [];
  }
  return groupsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudentGroup));
};
