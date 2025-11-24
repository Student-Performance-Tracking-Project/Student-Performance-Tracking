export const validateCourseName = (name: string): string | null => {
  if (!name.trim()) {
    return 'Course name is required';
  }
  if (name.length < 3) {
    return 'Course name must be at least 3 characters';
  }
  return null;
};

export const validateCourseCode = (code: string): string | null => {
  if (!code.trim()) {
    return 'Course code is required';
  }
  if (!/^[A-Z]{3}\d{3}$/.test(code)) {
    return 'Course code must be in format: ABC123 (3 uppercase letters + 3 digits)';
  }
  return null;
};

export const validateStudentName = (name: string): string | null => {
  if (!name.trim()) {
    return 'Student name is required';
  }
  if (name.length < 2) {
    return 'Student name must be at least 2 characters';
  }
  return null;
};

export const validateRollNumber = (rollNumber: string): string | null => {
  if (!rollNumber.trim()) {
    return 'Roll number is required';
  }
  if (rollNumber.length < 3) {
    return 'Roll number must be at least 3 characters';
  }
  return null;
};

export const validateClass = (className: string): string | null => {
  if (!className.trim()) {
    return 'Class is required';
  }
  return null;
};

export const validateCourses = (courses: string[]): string | null => {
  if (courses.length === 0) {
    return 'At least one course must be selected';
  }
  return null;
};

export const validateMarks = (marks: number): string | null => {
  if (isNaN(marks)) {
    return 'Marks must be a number';
  }
  if (marks < 0 || marks > 100) {
    return 'Marks must be between 0 and 100';
  }
  return null;
};