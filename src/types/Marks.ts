export interface Marks {
  id: string;
  rollNumber: string;
  marks: {
    [courseCode: string]: number;
  };
  updatedAt: string;
}

export interface StudentMarksEntry {
  courseCode: string;
  courseName: string;
  marks: number;
}