export interface Student {
  id: string;
  studentName: string;
  rollNumber: string;
  class: string;
  coursesEnrolled: string[]; // Array of course IDs
  createdAt: string;
}