
'use server';

import { courses as allCourses } from './data/courses.json';
import { faculty as allFaculty } from './data/faculty.json';
import { rooms as allRooms } from './data/rooms.json';
import { studentGroups as allStudentGroups } from './data/students.json';

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

      const allCoursesToSchedule = allStudentGroups.flatMap(group => 
        group.courses.map(courseCode => ({
          course: allCourses.find(c => c.code === courseCode),
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
        const suitableRoom = allRooms.find(r => 
          (course.type === 'Practical' ? r.type === 'Lab' : r.type === 'Classroom') &&
          r.capacity >= studentGroup.size
        );
        
        if (!suitableRoom) {
          conflicts.push(`No suitable room found for ${course.code} (Group: ${studentGroup.name}, Size: ${studentGroup.size})`);
          continue;
        }

        // Find a suitable faculty member
        const suitableFaculty = allFaculty.find(f => f.expertise.includes(course.code));

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
 * A deterministic, backend-driven suggestion engine to resolve timetable conflicts.
 */
export const getConflictSuggestions = async (conflicts: string[], timetable: ScheduleEntry[]): Promise<string[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const suggestions: string[] = [];
            const suggestedFor = new Set<string>();

            // Build a tracker of currently used slots from the generated timetable
            const scheduleTracker: Record<string, boolean> = {};
            for (const entry of timetable) {
                const facultyMember = allFaculty.find(f => f.name === entry.facultyName);
                const studentGroup = allStudentGroups.find(sg => sg.name === entry.studentGroup);
                if (facultyMember) scheduleTracker[`${facultyMember.id}_${entry.day}_${entry.timeSlot}`] = true;
                if (studentGroup) scheduleTracker[`${studentGroup.id}_${entry.day}_${entry.timeSlot}`] = true;
                scheduleTracker[`${entry.roomId}_${entry.day}_${entry.timeSlot}`] = true;
            }

            for (const conflict of conflicts) {
                // Example conflict: "Could not find any available slot for CSE101 for group Computer Science - 1st Year"
                const match = conflict.match(/Could not find any available slot for (.*) for group (.*)/);
                if (!match) continue;

                const courseCode = match[1];
                const studentGroupName = match[2];
                const conflictKey = `${courseCode}-${studentGroupName}`;

                if (suggestedFor.has(conflictKey)) continue;

                const course = allCourses.find(c => c.code === courseCode);
                const studentGroup = allStudentGroups.find(sg => sg.name === studentGroupName);
                if (!course || !studentGroup) continue;
                
                const suitableFaculty = allFaculty.find(f => f.expertise.includes(course.code));
                const suitableRoom = allRooms.find(r =>
                    (course.type === 'Practical' ? r.type === 'Lab' : r.type === 'Classroom') &&
                    r.capacity >= studentGroup.size
                );

                if (!suitableFaculty || !suitableRoom) continue;

                let suggestionFound = false;
                for (const day of DAYS) {
                    if (suggestionFound) break;
                    
                    // Check against faculty's general availability
                    const facultyAvailableSlots = suitableFaculty.availability[day as keyof typeof suitableFaculty.availability] || [];

                    for (const timeSlot of facultyAvailableSlots) {
                         // Check against the current schedule tracker
                        const facultySlotKey = `${suitableFaculty.id}_${day}_${timeSlot}`;
                        const roomSlotKey = `${suitableRoom.id}_${day}_${timeSlot}`;
                        const studentGroupSlotKey = `${studentGroup.id}_${day}_${timeSlot}`;

                        if (!scheduleTracker[facultySlotKey] && !scheduleTracker[roomSlotKey] && !scheduleTracker[studentGroupSlotKey]) {
                            // Found a free slot for everyone
                            suggestions.push(`Move '${course.name}' for '${studentGroup.name}' to ${day} at ${timeSlot} in ${suitableRoom.id}.`);
                            suggestedFor.add(conflictKey);
                            suggestionFound = true;
                            break;
                        }
                    }
                }
            }
            resolve(suggestions);
        }, 1000); // Simulate backend processing
    });
};
