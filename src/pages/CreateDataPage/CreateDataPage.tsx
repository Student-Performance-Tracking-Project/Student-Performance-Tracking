import CourseForm from '../../components/forms/CourseForm';
import StudentForm from '../../components/forms/StudentForm';
import './CreateDataPage.css';

const CreateDataPage = () => {
  return (
    <div className="create-data-page">
      <div className="page-header">
        <h1>Course & Student Management</h1>
        <p>Create courses and register students to get started</p>
      </div>
      
      <div className="forms-container">
        <CourseForm />
        <StudentForm />
      </div>
    </div>
  );
};

export default CreateDataPage;