import MarksForm from '../../components/forms/MarksForm';
import './MarksEntryPage.css';

const MarksEntryPage = () => {
  return (
    <div className="marks-entry-page">
      <div className="page-header">
        <h1>Student Marks Entry</h1>
        <p>Select a student and enter their marks for enrolled courses</p>
      </div>
      
      <MarksForm />
    </div>
  );
};

export default MarksEntryPage;