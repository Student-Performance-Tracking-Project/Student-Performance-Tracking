import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { getStudents, getCourses, saveMarks, getMarksByRollNumber } from '../../services/databaseService';
import type { Marks, StudentMarksEntry } from '../../types';
import { validateMarks } from '../../utils/validators';
import './Forms.css';

const MarksForm = () => {
  const [students] = useState(getStudents());
  const [courses] = useState(getCourses());
  const [selectedRollNumber, setSelectedRollNumber] = useState('');
  const [marksEntries, setMarksEntries] = useState<StudentMarksEntry[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (selectedRollNumber) {
      const student = students.find(s => s.rollNumber === selectedRollNumber);
      if (student) {
        const existingMarks = getMarksByRollNumber(selectedRollNumber);
        
        const entries: StudentMarksEntry[] = student.coursesEnrolled.map(courseId => {
          const course = courses.find(c => c.id === courseId);
          return {
            courseCode: course?.courseCode || '',
            courseName: course?.courseName || 'Unknown',
            marks: existingMarks?.marks[course?.courseCode || ''] || 0
          };
        });
        
        setMarksEntries(entries);
      }
    } else {
      setMarksEntries([]);
    }
  }, [selectedRollNumber, students, courses]);

  const handleMarksChange = (courseCode: string, value: string) => {
    const marks = parseFloat(value) || 0;
    setMarksEntries(prev =>
      prev.map(entry =>
        entry.courseCode === courseCode ? { ...entry, marks } : entry
      )
    );
    
    // Clear error for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[courseCode];
      return newErrors;
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    // Validate all marks
    const newErrors: { [key: string]: string } = {};
    marksEntries.forEach(entry => {
      const error = validateMarks(entry.marks);
      if (error) {
        newErrors[entry.courseCode] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save marks
    const marksData: Marks = {
      id: Date.now().toString(),
      rollNumber: selectedRollNumber,
      marks: marksEntries.reduce((acc, entry) => ({
        ...acc,
        [entry.courseCode]: entry.marks
      }), {}),
      updatedAt: new Date().toISOString()
    };

    saveMarks(marksData);
    const student = students.find(s => s.rollNumber === selectedRollNumber);
    setSuccessMessage(`Marks saved successfully for ${student?.studentName}!`);

    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="marks-form-container">
      <h2 className="form-title">Enter Student Marks</h2>
      
      {students.length === 0 ? (
        <p className="no-data-message">No students registered yet. Please register students first.</p>
      ) : (
        <>
          <div className="form-group">
            <label htmlFor="studentSelect">Select Student</label>
            <select
              id="studentSelect"
              value={selectedRollNumber}
              onChange={(e) => setSelectedRollNumber(e.target.value)}
              className="select-input"
            >
              <option value="">-- Select a student --</option>
              {students.map(student => (
                <option key={student.id} value={student.rollNumber}>
                  {student.studentName} ({student.rollNumber}) - {student.class}
                </option>
              ))}
            </select>
          </div>

          {marksEntries.length > 0 && (
            <form onSubmit={handleSubmit} className="marks-form">
              <div className="marks-grid">
                {marksEntries.map(entry => (
                  <div key={entry.courseCode} className="marks-entry">
                    <label htmlFor={entry.courseCode}>
                      {entry.courseName}
                      <span className="course-code">({entry.courseCode})</span>
                    </label>
                    <input
                      type="number"
                      id={entry.courseCode}
                      value={entry.marks}
                      onChange={(e) => handleMarksChange(entry.courseCode, e.target.value)}
                      min="0"
                      max="100"
                      step="0.5"
                      className={errors[entry.courseCode] ? 'error' : ''}
                      placeholder="Enter marks (0-100)"
                    />
                    {errors[entry.courseCode] && (
                      <span className="error-message">{errors[entry.courseCode]}</span>
                    )}
                  </div>
                ))}
              </div>

              <button type="submit" className="btn btn-primary">Save Marks</button>

              {successMessage && <div className="success-message">{successMessage}</div>}
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default MarksForm;