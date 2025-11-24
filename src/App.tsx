import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import CreateDataPage from './pages/CreateDataPage/CreateDataPage';
import MarksEntryPage from './pages/MarksEntryPage/MarksEntryPage';
import AnalyticsPage from './pages/AnalyticsPage/AnalyticsPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<CreateDataPage />} />
          <Route path="/marks" element={<MarksEntryPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;