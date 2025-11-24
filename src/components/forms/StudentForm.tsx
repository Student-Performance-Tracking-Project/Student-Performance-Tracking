import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { Student } from '../../types';
import { saveStudent, getCourses, getStudents } from '../../services/databaseService';
import { validateStudentName, validateRollNumber, validateClass, validateCourses } from '../../utils/validators';
import './Forms.css';

const StudentForm = () => {
  const [studentName, setStudentName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [availableCourses, setAvailableCourses] = useState(getCourses());
  const [errors, setErrors] = useState<any>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setAvailableCourses(getCourses());
  }, []);

  const handleCourseToggle = (courseId: string) => {
    setSelectedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    const nameError = validateStudentName(studentName);
    const rollError = validateRollNumber(rollNumber);
    const classError = validateClass(studentClass);
    const coursesError = validateCourses(selectedCourses);

    if (nameError || rollError || classError || coursesError) {
      setErrors({
        studentName: nameError || undefined,
        rollNumber: rollError || undefined,
        class: classError || undefined,
        courses: coursesError || undefined
      });
      return;
    }

    // Check if roll number already exists
    const existingStudents = getStudents();
    if (existingStudents.some(s => s.rollNumber === rollNumber)) {
      setErrors({ rollNumber: 'Roll number already exists' });
      return;
    }

    const newStudent: Student = {
      id: Date.now().toString(),
      studentName: studentName.trim(),
      rollNumber: rollNumber.trim(),
      class: studentClass.trim(),
      coursesEnrolled: selectedCourses,
      createdAt: new Date().toISOString()
    };

    saveStudent(newStudent);
    setSuccessMessage(`Student "${studentName}" registered successfully!`);
    setStudentName('');
    setRollNumber('');
    setStudentClass('');
    setSelectedCourses([]);

    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="form-card">
      <h2 className="form-title">Register New Student</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="studentName">Student Name</label>
          <input
            type="text"
            id="studentName"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="e.g., John Doe"
            className={errors.studentName ? 'error' : ''}
          />
          {errors.studentName && <span className="error-message">{errors.studentName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="rollNumber">Roll Number</label>
          <input
            type="text"
            id="rollNumber"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            placeholder="e.g., 2024001"
            className={errors.rollNumber ? 'error' : ''}
          />
          {errors.rollNumber && <span className="error-message">{errors.rollNumber}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="studentClass">Class</label>
          <input
            type="text"
            id="studentClass"
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
            placeholder="e.g., CSE-A, 10th Grade"
            className={errors.class ? 'error' : ''}
          />
          {errors.class && <span className="error-message">{errors.class}</span>}
        </div>

        <div className="form-group">
          <label>Courses Enrolled</label>
          {availableCourses.length === 0 ? (
            <p className="no-data-message">No courses available. Please create courses first.</p>
          ) : (
            <div className="checkbox-group">
              {availableCourses.map(course => (
                <label key={course.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedCourses.includes(course.id)}
                    onChange={() => handleCourseToggle(course.id)}
                  />
                  <span>{course.courseName} ({course.courseCode})</span>
                </label>
              ))}
            </div>
          )}
          {errors.courses && <span className="error-message">{errors.courses}</span>}
        </div>

        <button type="submit" className="btn btn-primary" disabled={availableCourses.length === 0}>
          Register Student
        </button>

        {successMessage && <div className="success-message">{successMessage}</div>}
      </form>
    </div>
  );
};

export default StudentForm;