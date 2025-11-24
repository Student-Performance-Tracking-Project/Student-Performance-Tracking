import type { Course, Student, Marks } from '../types/index';

const COURSES_KEY = 'courses';
const STUDENTS_KEY = 'students';
const MARKS_KEY = 'marks';

// Course Operations
export const saveCourse = (course: Course): void => {
  const courses = getCourses();
  courses.push(course);
  localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
};

export const getCourses = (): Course[] => {
  const data = localStorage.getItem(COURSES_KEY);
  return data ? JSON.parse(data) : [];
};

export const getCourseById = (id: string): Course | undefined => {
  const courses = getCourses();
  return courses.find(c => c.id === id);
};

export const getCourseByCode = (code: string): Course | undefined => {
  const courses = getCourses();
  return courses.find(c => c.courseCode === code);
};

// Student Operations
export const saveStudent = (student: Student): void => {
  const students = getStudents();
  students.push(student);
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
};

export const getStudents = (): Student[] => {
  const data = localStorage.getItem(STUDENTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getStudentByRollNumber = (rollNumber: string): Student | undefined => {
  const students = getStudents();
  return students.find(s => s.rollNumber === rollNumber);
};

// Marks Operations
export const saveMarks = (marks: Marks): void => {
  const allMarks = getAllMarks();
  const existingIndex = allMarks.findIndex(m => m.rollNumber === marks.rollNumber);
  
  if (existingIndex !== -1) {
    allMarks[existingIndex] = marks;
  } else {
    allMarks.push(marks);
  }
  
  localStorage.setItem(MARKS_KEY, JSON.stringify(allMarks));
};

export const getAllMarks = (): Marks[] => {
  const data = localStorage.getItem(MARKS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getMarksByRollNumber = (rollNumber: string): Marks | undefined => {
  const allMarks = getAllMarks();
  return allMarks.find(m => m.rollNumber === rollNumber);
};

// Clear all data (for testing/reset)
export const clearAllData = (): void => {
  localStorage.removeItem(COURSES_KEY);
  localStorage.removeItem(STUDENTS_KEY);
  localStorage.removeItem(MARKS_KEY);
};