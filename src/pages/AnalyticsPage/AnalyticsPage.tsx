import { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import ChartCard from '../../components/charts/ChartCard';
import { getStudents, getCourses, getAllMarks } from '../../services/databaseService';
import {
  calculateStudentAnalytics,
  calculateCourseAnalytics,
  getTop3Students,
  getMostEnrolledCourse,
  getHardestAndEasiestCourse,
  type StudentAnalytics,
  type CourseAnalytics
} from '../../utils/calculations';
import './AnalyticsPage.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AnalyticsPage = () => {
  const [students] = useState(getStudents());
  const [courses] = useState(getCourses());
  const [allMarks] = useState(getAllMarks());
  const [studentAnalytics, setStudentAnalytics] = useState<StudentAnalytics[]>([]);
  const [courseAnalytics, setCourseAnalytics] = useState<CourseAnalytics[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');

  useEffect(() => {
    // Calculate student analytics
    const studentsWithMarks = students
      .map(student => {
        const marks = allMarks.find(m => m.rollNumber === student.rollNumber);
        if (!marks || Object.keys(marks.marks).length === 0) return null;
        return calculateStudentAnalytics(student, marks, courses);
      })
      .filter(item => item !== null) as StudentAnalytics[];

    setStudentAnalytics(studentsWithMarks);

    // Calculate course analytics
    const coursesWithData = courses
      .map(course => calculateCourseAnalytics(course, allMarks, students))
      .filter(item => item.totalStudents > 0);

    setCourseAnalytics(coursesWithData);
  }, [students, courses, allMarks]);

  const top3 = getTop3Students(students, allMarks);
  const mostEnrolled = getMostEnrolledCourse(students, courses);
  const { hardest, easiest } = getHardestAndEasiestCourse(courses, allMarks);

  const selectedStudentData = studentAnalytics.find(s => s.rollNumber === selectedStudent);

  const courseDistributionData = {
    labels: courseAnalytics.map(c => c.courseCode),
    datasets: [{
      label: 'Average Marks',
      data: courseAnalytics.map(c => c.averageMarks),
      backgroundColor: ['#52796f', '#84a98c', '#354f52', '#2f3e46', '#cad2c5'].slice(0, courseAnalytics.length),
      borderColor: '#2f3e46',
      borderWidth: 2
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const
      }
    }
  };

  if (students.length === 0 || courses.length === 0 || allMarks.length === 0) {
    return (
      <div className="analytics-page">
        <div className="page-header">
          <h1>Analytics Dashboard</h1>
          <p>Comprehensive insights into student and course performance</p>
        </div>
        <div className="no-data-container">
          <p className="no-data-message-large">
            📊 No data available yet. Please create courses, register students, and enter marks to view analytics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <div className="page-header">
        <h1>Analytics Dashboard</h1>
        <p>Comprehensive insights into student and course performance</p>
      </div>

      {/* Global Insights */}
      <section className="analytics-section">
        <h2 className="section-title">🌟 Global Insights</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <h3>Top 3 Students</h3>
            {top3.length > 0 ? (
              <div className="top-students-list">
                {top3.map((student, index) => (
                  <div key={student.rollNumber} className="top-student-item">
                    <span className="rank">#{index + 1}</span>
                    <div className="student-info">
                      <strong>{student.name}</strong>
                      <span className="roll-number">{student.rollNumber}</span>
                    </div>
                    <span className="average-badge">{student.average}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No student data available</p>
            )}
          </div>

          <div className="insight-card">
            <h3>Course Statistics</h3>
            <div className="stat-item">
              <span className="stat-label">Most Enrolled:</span>
              <span className="stat-value">
                {mostEnrolled ? `${mostEnrolled.courseName} (${mostEnrolled.count} students)` : 'N/A'}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Hardest Course:</span>
              <span className="stat-value">
                {hardest ? `${hardest.courseName} (${hardest.average}%)` : 'N/A'}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Easiest Course:</span>
              <span className="stat-value">
                {easiest ? `${easiest.courseName} (${easiest.average}%)` : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Student-wise Analytics */}
      <section className="analytics-section">
        <h2 className="section-title">👨‍🎓 Student-wise Analytics</h2>
        
        <div className="student-selector">
          <label htmlFor="studentSelect">Select Student:</label>
          <select
            id="studentSelect"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="select-input"
          >
            <option value="">-- Select a student --</option>
            {studentAnalytics.map(student => (
              <option key={student.rollNumber} value={student.rollNumber}>
                {student.studentName} ({student.rollNumber})
              </option>
            ))}
          </select>
        </div>

        {selectedStudentData && (
          <div className="student-details">
            <ChartCard title={`Performance: ${selectedStudentData.studentName}`}>
              <div className="stats-grid">
                <div className="stat-box">
                  <div className="stat-number">{selectedStudentData.totalMarks}</div>
                  <div className="stat-label">Total Marks</div>
                </div>
                <div className="stat-box">
                  <div className="stat-number">{selectedStudentData.averageMarks}%</div>
                  <div className="stat-label">Average</div>
                </div>
                <div className="stat-box">
                  <div className="stat-number">{selectedStudentData.courseCount}</div>
                  <div className="stat-label">Courses</div>
                </div>
              </div>

              <div className="progress-section">
                <div className="progress-label">
                  <span>Performance</span>
                  <span>{selectedStudentData.percentage}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${selectedStudentData.percentage}%` }}
                  />
                </div>
              </div>

              {selectedStudentData.highestCourse && (
                <div className="course-extremes">
                  <div className="extreme-item highest">
                    <strong>Highest:</strong> {selectedStudentData.highestCourse.courseName} ({selectedStudentData.highestCourse.marks})
                  </div>
                  {selectedStudentData.lowestCourse && (
                    <div className="extreme-item lowest">
                      <strong>Lowest:</strong> {selectedStudentData.lowestCourse.courseName} ({selectedStudentData.lowestCourse.marks})
                    </div>
                  )}
                </div>
              )}
            </ChartCard>
          </div>
        )}
      </section>

      {/* Course-wise Analytics */}
      <section className="analytics-section">
        <h2 className="section-title">📚 Course-wise Analytics</h2>
        
        <div className="charts-grid">
          <ChartCard title="Course Average Distribution">
            <div style={{ height: '300px' }}>
              <Bar data={courseDistributionData} options={chartOptions} />
            </div>
          </ChartCard>

          <ChartCard title="Course Averages (Pie Chart)">
            <div style={{ height: '300px' }}>
              <Pie data={courseDistributionData} options={chartOptions} />
            </div>
          </ChartCard>
        </div>

        <div className="course-details-grid">
          {courseAnalytics.map(course => (
            <ChartCard key={course.courseCode} title={course.courseName}>
              <div className="course-stats">
                <div className="stat-row">
                  <span>Average Marks:</span>
                  <strong>{course.averageMarks}%</strong>
                </div>
                <div className="stat-row">
                  <span>Total Students:</span>
                  <strong>{course.totalStudents}</strong>
                </div>
                {course.highestStudent && (
                  <div className="stat-row success">
                    <span>Highest Score:</span>
                    <strong>{course.highestStudent.name} ({course.highestStudent.marks})</strong>
                  </div>
                )}
                {course.lowestStudent && (
                  <div className="stat-row warning">
                    <span>Lowest Score:</span>
                    <strong>{course.lowestStudent.name} ({course.lowestStudent.marks})</strong>
                  </div>
                )}
              </div>
            </ChartCard>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AnalyticsPage;