
'use server';

import { courses } from './data/courses.json';
import { faculty as facultyData } from './data/faculty.json';
import { rooms } from './data/rooms.json';
import { studentGroups } from './data/students.json';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = [
  '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00',
  '14:00-15:00', '15:00-16:00', '16:00-17:00'
];

export type ScheduleEntry = {
  day: string;
  timeSlot: string;
  courseCode: string;
  courseName: string;
  facultyName: string;
  roomId: string;
  studentGroup: string;
};

export type TimetableResult = {
  timetable: ScheduleEntry[];
  conflicts: string[];
};

// This function simulates a promise-based async operation, like a real API call would be.
export const generateTimetable = async (): Promise<TimetableResult> => {
  return new Promise(resolve => {
    // We wrap the logic in a timeout to simulate network latency
    setTimeout(() => {
      const timetable: ScheduleEntry[] = [];
      const conflicts: string[] = [];
      
      // Keep track of scheduled resources { resourceId_day_timeSlot: true }
      const scheduleTracker: Record<string, boolean> = {};

      const allCoursesToSchedule = studentGroups.flatMap(group => 
        group.courses.map(courseCode => ({
          course: courses.find(c => c.code === courseCode),
          studentGroup: group
        }))
      );
      
      for (const { course, studentGroup } of allCoursesToSchedule) {
        if (!course) {
          conflicts.push(`Course data not found for a course in group ${studentGroup.id}`);
          continue;
        }

        let scheduled = false;
        
        // Find a suitable room
        const suitableRoom = rooms.find(r => 
          (course.type === 'Practical' ? r.type === 'Lab' : r.type === 'Classroom') &&
          r.capacity >= studentGroup.size
        );
        
        if (!suitableRoom) {
          conflicts.push(`No suitable room found for ${course.code} (Group: ${studentGroup.name}, Size: ${studentGroup.size})`);
          continue;
        }

        // Find a suitable faculty member
        const suitableFaculty = facultyData.find(f => f.expertise.includes(course.code));

        if (!suitableFaculty) {
          conflicts.push(`No faculty with expertise for ${course.code}`);
          continue;
        }

        // Find an available slot
        for (const day of DAYS) {
          if (scheduled) break;
          
          const facultyAvailableSlots = suitableFaculty.availability[day as keyof typeof suitableFaculty.availability] || [];

          for (const timeSlot of facultyAvailableSlots) {
            const facultySlotKey = `${suitableFaculty.id}_${day}_${timeSlot}`;
            const roomSlotKey = `${suitableRoom.id}_${day}_${timeSlot}`;
            const studentGroupSlotKey = `${studentGroup.id}_${day}_${timeSlot}`;
            
            if (!scheduleTracker[facultySlotKey] && !scheduleTracker[roomSlotKey] && !scheduleTracker[studentGroupSlotKey]) {
              // Slot is free for all, schedule it.
              const newEntry: ScheduleEntry = {
                day,
                timeSlot,
                courseCode: course.code,
                courseName: course.name,
                facultyName: suitableFaculty.name,
                roomId: suitableRoom.id,
                studentGroup: studentGroup.name,
              };
              
              timetable.push(newEntry);
              
              // Mark resources as booked
              scheduleTracker[facultySlotKey] = true;
              scheduleTracker[roomSlotKey] = true;
              scheduleTracker[studentGroupSlotKey] = true;
              
              scheduled = true;
              break; 
            }
          }
        }
        
        if (!scheduled) {
          conflicts.push(`Could not find any available slot for ${course.code} for group ${studentGroup.name}`);
        }
      }

      resolve({ timetable, conflicts });
    }, 1500); // Simulate 1.5 seconds of processing time
  });
};

/**
 * A simple, rule-based suggestion engine for timetable conflicts.
 */
export const getConflictSuggestions = async (result: TimetableResult): Promise<string[]> => {
  const suggestions: string[] = [];
  const { conflicts, timetable } = result;
  const suggestedConflicts = new Set<string>();

  // Build a map of currently used slots for faster lookups
  const scheduleTracker: Record<string, boolean> = {};
  for (const entry of timetable) {
      const facultyMember = facultyData.find(f => f.name === entry.facultyName);
      const studentGroup = studentGroups.find(sg => sg.name === entry.studentGroup);
      
      if(facultyMember) scheduleTracker[`${facultyMember.id}_${entry.day}_${entry.timeSlot}`] = true;
      scheduleTracker[`${entry.roomId}_${entry.day}_${entry.timeSlot}`] = true;
      if (studentGroup) scheduleTracker[`${studentGroup.id}_${entry.day}_${entry.timeSlot}`] = true;
  }

  for (const conflict of conflicts) {
    if (suggestedConflicts.has(conflict)) {
        continue;
    }

    const match = conflict.match(/Could not find any available slot for (.*) for group (.*)/);
    if (match) {
      const courseCode = match[1];
      const studentGroupName = match[2];
      
      const course = courses.find(c => c.code === courseCode);
      const studentGroup = studentGroups.find(sg => sg.name === studentGroupName);
      const suitableFaculty = facultyData.find(f => f.expertise.includes(courseCode));
      
      if (!course || !studentGroup || !suitableFaculty) continue;

      const suitableRoom = rooms.find(r => 
        (course.type === 'Practical' ? r.type === 'Lab' : r.type === 'Classroom') &&
        r.capacity >= studentGroup.size
      );
      if (!suitableRoom) continue;

      let suggestionFound = false;
      // Strategy: Find a free slot considering faculty's general availability and current schedule bookings.
      for (const day of DAYS) {
        // Get all possible slots for the faculty on this day
        const facultyDayAvailability = suitableFaculty.availability[day as keyof typeof suitableFaculty.availability] || [];

        for (const timeSlot of facultyDayAvailability) {
            const facultySlotKey = `${suitableFaculty.id}_${day}_${timeSlot}`;
            const roomSlotKey = `${suitableRoom.id}_${day}_${timeSlot}`;
            const studentGroupSlotKey = `${studentGroup.id}_${day}_${timeSlot}`;

            // Check if this generally available slot is also free in the current partial schedule
            if (!scheduleTracker[facultySlotKey] && !scheduleTracker[roomSlotKey] && !scheduleTracker[studentGroupSlotKey]) {
                const suggestion = `Move '${course.name}' for '${studentGroup.name}' to ${day} at ${timeSlot} in ${suitableRoom.id}.`;
                if (!suggestions.includes(suggestion)) {
                    suggestions.push(suggestion);
                }
                suggestedConflicts.add(conflict);
                suggestionFound = true;
                break; // Stop after finding one suggestion for this conflict
            }
        }
        if (suggestionFound) {
            break; // Move to the next conflict
        }
      }
    }
  }

  return suggestions;
};
