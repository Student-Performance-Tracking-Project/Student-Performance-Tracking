import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Course } from '../../types';
import { saveCourse, getCourses } from '../../services/databaseService';
import { validateCourseName, validateCourseCode } from '../../utils/validators';
import './Forms.css';

const CourseForm = () => {
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [errors, setErrors] = useState<{ courseName?: string; courseCode?: string }>({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    const nameError = validateCourseName(courseName);
    const codeError = validateCourseCode(courseCode);

    if (nameError || codeError) {
      setErrors({
        courseName: nameError || undefined,
        courseCode: codeError || undefined
      });
      return;
    }

    // Check if course code already exists
    const existingCourses = getCourses();
    if (existingCourses.some(c => c.courseCode === courseCode.toUpperCase())) {
      setErrors({ courseCode: 'Course code already exists' });
      return;
    }

    const newCourse: Course = {
      id: Date.now().toString(),
      courseName: courseName.trim(),
      courseCode: courseCode.toUpperCase(),
      createdAt: new Date().toISOString()
    };

    saveCourse(newCourse);
    setSuccessMessage(`Course "${courseName}" created successfully!`);
    setCourseName('');
    setCourseCode('');

    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="form-card">
      <h2 className="form-title">Create New Course</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="courseName">Course Name</label>
          <input
            type="text"
            id="courseName"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="e.g., Data Structures"
            className={errors.courseName ? 'error' : ''}
          />
          {errors.courseName && <span className="error-message">{errors.courseName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="courseCode">Course Code</label>
          <input
            type="text"
            id="courseCode"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
            placeholder="e.g., CSE101"
            className={errors.courseCode ? 'error' : ''}
            maxLength={6}
          />
          {errors.courseCode && <span className="error-message">{errors.courseCode}</span>}
          <small className="form-hint">Format: ABC123 (3 letters + 3 digits)</small>
        </div>

        <button type="submit" className="btn btn-primary">Create Course</button>

        {successMessage && <div className="success-message">{successMessage}</div>}
      </form>
    </div>
  );
};

export default CourseForm;