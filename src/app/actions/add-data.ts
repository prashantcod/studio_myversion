
'use server';

import { firestoreDb } from '@/lib/firebase';
import type { Faculty, StudentGroup } from '@/lib/data-store';
import { revalidatePath } from 'next/cache';


export async function addTeacherAction(teacherData: Omit<Faculty, 'id'>): Promise<{success: boolean, message?: string}> {
    try {
        await firestoreDb.collection('faculty').add(teacherData);
        revalidatePath('/(app)', 'layout');
        return { success: true };
    } catch (error) {
        console.error('Error adding teacher:', error);
        return { success: false, message: 'Failed to add teacher to the database.'}
    }
}

export async function addStudentGroupAction(studentGroupData: Omit<StudentGroup, 'id'>): Promise<{success: boolean, message?: string}> {
    try {
        await firestoreDb.collection('studentGroups').add(studentGroupData);
        revalidatePath('/(app)', 'layout');
        return { success: true };
    } catch (error) {
        console.error('Error adding student group:', error);
        return { success: false, message: 'Failed to add student group to the database.'}
    }
}
