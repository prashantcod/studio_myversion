
'use server';

import { useDataStore } from './data-store';
import { summarizeTimetableConflicts } from '@/ai/flows/summarize-timetable-conflicts';
import { isWithinInterval } from 'date-fns';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export type ScheduleEntry = {
  day: string;
  timeSlot: string;
  courseCode: string;
  courseName: string;
  facultyName: string;
  roomId: string;
  studentGroup: string;
  isOnLeave?: boolean;
};

export type TimetableResult = {
  timetable: ScheduleEntry[];
  conflicts: string[];
};

export const generateTimetable = async (): Promise<TimetableResult> => {
    const { 
      courses: allCourses, 
      faculty: allFaculty,
      rooms: allRooms,
      studentGroups: allStudentGroups,
      leaveRequests,
      timetable: manualBookings,
    } = useDataStore();

    const timetable: ScheduleEntry[] = [...manualBookings];
    const conflicts: string[] = [];
    
    const scheduleTracker: Record<string, boolean> = {};

    // Pre-populate with manual bookings
    for (const entry of manualBookings) {
      const faculty = allFaculty.find(f => f.name === entry.facultyName);
      const studentGroup = allStudentGroups.find(g => g.name === entry.studentGroup);
      
      if (faculty) {
        scheduleTracker[`${faculty.id}_${entry.day}_${entry.timeSlot}`] = true;
      }
      if (studentGroup) {
         scheduleTracker[`${studentGroup.id}_${entry.day}_${entry.timeSlot}`] = true;
      }
       scheduleTracker[`${entry.roomId}_${entry.day}_${entry.timeSlot}`] = true;
    }

    const approvedLeave = leaveRequests.filter(lr => lr.status === 'approved');

    // Pre-populate schedule with leave entries
    for (const leave of approvedLeave) {
        const faculty = allFaculty.find(f => f.id === leave.facultyId);
        if (!faculty) continue;
        for (const day of DAYS) {
             const dateToCheck = new Date(); // In a real app, this would be the actual date for `day`
             const dayIndex = DAYS.indexOf(day);
             // This is a simplification; a real app needs to map dates to days of the week for the semester
            if (dateToCheck.getDay() === (dayIndex + 1) % 7 && isWithinInterval(dateToCheck, { start: leave.startDate, end: leave.endDate })) {
                 for (const slot of faculty.availability[day as keyof typeof faculty.availability] || []) {
                     const facultySlotKey = `${faculty.id}_${day}_${slot}`;
                     if (!scheduleTracker[facultySlotKey]) {
                         scheduleTracker[facultySlotKey] = true; // Mark as busy
                     }
                 }
            }
        }
    }


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
      
      const suitableRoom = allRooms.find(r => 
        (course.type === 'Practical' ? r.type === 'Lab' : r.type === 'Classroom') &&
        r.capacity >= studentGroup.size
      );
      
      if (!suitableRoom) {
        conflicts.push(`No suitable room found for ${course.code} (Group: ${studentGroup.name}, Size: ${studentGroup.size})`);
        continue;
      }

      const suitableFaculty = allFaculty.find(f => f.expertise.includes(course.code));

      if (!suitableFaculty) {
        conflicts.push(`No faculty with expertise for ${course.code}`);
        continue;
      }

      for (const day of DAYS) {
        if (scheduled) break;
        
        const facultyIsOnLeaveToday = approvedLeave.some(leave => 
            leave.facultyId === suitableFaculty.id && 
            ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(day)
        );

        if (facultyIsOnLeaveToday) continue;

        const facultyAvailableSlots = suitableFaculty.availability[day as keyof typeof suitableFaculty.availability] || [];

        for (const timeSlot of facultyAvailableSlots) {
          const facultySlotKey = `${suitableFaculty.id}_${day}_${timeSlot}`;
          const roomSlotKey = `${suitableRoom.id}_${day}_${timeSlot}`;
          const studentGroupSlotKey = `${studentGroup.id}_${day}_${timeSlot}`;
          
          if (!scheduleTracker[facultySlotKey] && !scheduleTracker[roomSlotKey] && !scheduleTracker[studentGroupSlotKey]) {
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
            
    useDataStore().setTimetable(timetable);
    return { timetable, conflicts };
};


/**
 * A deterministic, backend-driven suggestion engine to resolve timetable conflicts.
 */
export const getConflictSuggestions = async (conflicts: string[], timetable: ScheduleEntry[]): Promise<string[]> => {
    const { 
      courses: allCourses, 
      faculty: allFaculty,
      rooms: allRooms,
      studentGroups: allStudentGroups
    } = useDataStore();

    const suggestions: string[] = [];
    const suggestedFor = new Set<string>();

    const scheduleTracker: Record<string, boolean> = {};
    for (const entry of timetable) {
        const facultyMember = allFaculty.find(f => f.name === entry.facultyName);
        const studentGroup = allStudentGroups.find(sg => sg.name === entry.studentGroup);
        if (facultyMember) scheduleTracker[`${facultyMember.id}_${entry.day}_${entry.timeSlot}`] = true;
        if (studentGroup) scheduleTracker[`${studentGroup.id}_${entry.day}_${entry.timeSlot}`] = true;
        scheduleTracker[`${entry.roomId}_${entry.day}_${entry.timeSlot}`] = true;
    }

    for (const conflict of conflicts) {
        let suggestionFound = false;

        const roomConflictMatch = conflict.match(/No suitable room found for (.*) \(Group: (.*), Size: (\d+)\)/);
        if (roomConflictMatch && !suggestionFound) {
            const [, courseCode, groupName, groupSize] = roomConflictMatch;
            const course = allCourses.find(c => c.code === courseCode);
            if (course) {
                const roomType = course.type === 'Practical' ? 'Lab' : 'Classroom';
                const availableRooms = allRooms.filter(r => r.type === roomType);
                const largestRoom = availableRooms.reduce((max, room) => room.capacity > max.capacity ? room : max, {capacity: 0});
                
                if (largestRoom.capacity > 0 && Number(groupSize) > largestRoom.capacity) {
                    suggestions.push(`Increase capacity of a ${roomType} or split group '${groupName}'. Largest ${roomType} has capacity ${largestRoom.capacity}, but group size is ${groupSize}.`);
                    suggestedFor.add(conflict);
                    suggestionFound = true;
                }
            }
        }

        const slotConflictMatch = conflict.match(/Could not find any available slot for (.*) for group (.*)/);
        if (slotConflictMatch && !suggestionFound) {
            const [, courseCode, studentGroupName] = slotConflictMatch;
            const conflictKey = `${courseCode}-${studentGroupName}`;

            if (suggestedFor.has(conflictKey)) continue;

            const course = allCourses.find(c => c.code === courseCode);
            const studentGroup = allStudentGroups.find(sg => sg.name === studentGroupName);
            if (!course || !studentGroup) continue;
            
            const suitableFaculty = allFaculty.find(f => f.expertise.includes(course.code));
            const suitableRoom = allRooms.find(r =>
                (course.type === 'Practical' ? 'Lab' : 'Classroom') &&
                r.capacity >= studentGroup.size
            );

            if (!suitableFaculty || !suitableRoom) continue;

            for (const day of DAYS) {
                if (suggestionFound) break;
                
                const facultyAvailableSlots = suitableFaculty.availability[day as keyof typeof suitableFaculty.availability] || [];

                for (const timeSlot of facultyAvailableSlots) {
                    const facultySlotKey = `${suitableFaculty.id}_${day}_${timeSlot}`;
                    const roomSlotKey = `${suitableRoom.id}_${day}_${timeSlot}`;
                    const studentGroupSlotKey = `${studentGroup.id}_${day}_${timeSlot}`;

                    if (!scheduleTracker[facultySlotKey] && !scheduleTracker[roomSlotKey] && !scheduleTracker[studentGroupSlotKey]) {
                        suggestions.push(`Move '${course.name}' for '${studentGroup.name}' to ${day} at ${timeSlot} in ${suitableRoom.id}.`);
                        suggestedFor.add(conflictKey);
                        suggestionFound = true;
                        break;
                    }
                }
            }
        }
    }
    try {
        const { summary } = await summarizeTimetableConflicts({conflicts: JSON.stringify(conflicts)});
        return [summary];
    } catch (e) {
        console.error("Failed to get summary from AI", e);
        return ["Could not generate an AI summary for the conflicts."];
    }
};
