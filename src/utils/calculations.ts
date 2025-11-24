import type { Student, Marks, Course } from '../types/index';

export interface StudentAnalytics {
  studentName: string;
  rollNumber: string;
  totalMarks: number;
  averageMarks: number;
  highestCourse: { courseName: string; marks: number } | null;
  lowestCourse: { courseName: string; marks: number } | null;
  percentage: number;
  courseCount: number;
}

export interface CourseAnalytics {
  courseName: string;
  courseCode: string;
  averageMarks: number;
  highestStudent: { name: string; marks: number } | null;
  lowestStudent: { name: string; marks: number } | null;
  totalStudents: number;
}

export const calculateStudentAnalytics = (
  student: Student,
  marks: Marks,
  courses: Course[]
): StudentAnalytics => {
  const marksArray = Object.entries(marks.marks);
  const totalMarks = marksArray.reduce((sum, [, mark]) => sum + mark, 0);
  const averageMarks = marksArray.length > 0 ? totalMarks / marksArray.length : 0;

  let highest = null;
  let lowest = null;

  if (marksArray.length > 0) {
    const sorted = [...marksArray].sort((a, b) => b[1] - a[1]);
    const highestCourse = courses.find(c => c.courseCode === sorted[0][0]);
    const lowestCourse = courses.find(c => c.courseCode === sorted[sorted.length - 1][0]);

    highest = {
      courseName: highestCourse?.courseName || sorted[0][0],
      marks: sorted[0][1]
    };

    lowest = {
      courseName: lowestCourse?.courseName || sorted[sorted.length - 1][0],
      marks: sorted[sorted.length - 1][1]
    };
  }

  return {
    studentName: student.studentName,
    rollNumber: student.rollNumber,
    totalMarks,
    averageMarks: Math.round(averageMarks * 100) / 100,
    highestCourse: highest,
    lowestCourse: lowest,
    percentage: Math.round(averageMarks),
    courseCount: marksArray.length
  };
};

export const calculateCourseAnalytics = (
  course: Course,
  allMarks: Marks[],
  students: Student[]
): CourseAnalytics => {
  const studentsInCourse = allMarks
    .filter(m => m.marks[course.courseCode] !== undefined)
    .map(m => {
      const student = students.find(s => s.rollNumber === m.rollNumber);
      return {
        name: student?.studentName || m.rollNumber,
        marks: m.marks[course.courseCode]
      };
    });

  const totalMarks = studentsInCourse.reduce((sum, s) => sum + s.marks, 0);
  const averageMarks = studentsInCourse.length > 0 ? totalMarks / studentsInCourse.length : 0;

  let highest = null;
  let lowest = null;

  if (studentsInCourse.length > 0) {
    const sorted = [...studentsInCourse].sort((a, b) => b.marks - a.marks);
    highest = sorted[0];
    lowest = sorted[sorted.length - 1];
  }

  return {
    courseName: course.courseName,
    courseCode: course.courseCode,
    averageMarks: Math.round(averageMarks * 100) / 100,
    highestStudent: highest,
    lowestStudent: lowest,
    totalStudents: studentsInCourse.length
  };
};

export const getTop3Students = (
  students: Student[],
  allMarks: Marks[]
): { name: string; rollNumber: string; average: number }[] => {
  const studentAverages = students
    .map(student => {
      const marks = allMarks.find(m => m.rollNumber === student.rollNumber);
      if (!marks || Object.keys(marks.marks).length === 0) return null;

      const marksArray = Object.values(marks.marks);
      const average = marksArray.reduce((sum, mark) => sum + mark, 0) / marksArray.length;

      return {
        name: student.studentName,
        rollNumber: student.rollNumber,
        average: Math.round(average * 100) / 100
      };
    })
    .filter(item => item !== null) as { name: string; rollNumber: string; average: number }[];

  return studentAverages.sort((a, b) => b.average - a.average).slice(0, 3);
};

export const getMostEnrolledCourse = (students: Student[], courses: Course[]): { courseName: string; count: number } | null => {
  if (courses.length === 0) return null;

  const enrollmentCount: { [key: string]: number } = {};
  
  students.forEach(student => {
    student.coursesEnrolled.forEach(courseId => {
      enrollmentCount[courseId] = (enrollmentCount[courseId] || 0) + 1;
    });
  });

  const entries = Object.entries(enrollmentCount);
  if (entries.length === 0) return null;

  const [mostEnrolledId, count] = entries.reduce((max, current) => 
    current[1] > max[1] ? current : max
  );

  const course = courses.find(c => c.id === mostEnrolledId);
  
  return {
    courseName: course?.courseName || 'Unknown',
    count
  };
};

export const getHardestAndEasiestCourse = (
  courses: Course[],
  allMarks: Marks[]
): { hardest: { courseName: string; average: number } | null; easiest: { courseName: string; average: number } | null } => {
  const courseAverages = courses.map(course => {
    const marksInCourse = allMarks
      .filter(m => m.marks[course.courseCode] !== undefined)
      .map(m => m.marks[course.courseCode]);

    if (marksInCourse.length === 0) return null;

    const average = marksInCourse.reduce((sum, mark) => sum + mark, 0) / marksInCourse.length;

    return {
      courseName: course.courseName,
      average: Math.round(average * 100) / 100
    };
  }).filter(item => item !== null) as { courseName: string; average: number }[];

  if (courseAverages.length === 0) {
    return { hardest: null, easiest: null };
  }

  const sorted = [...courseAverages].sort((a, b) => a.average - b.average);

  return {
    hardest: sorted[0],
    easiest: sorted[sorted.length - 1]
  };
};