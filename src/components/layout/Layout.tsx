import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="nav-logo">📚 Student Performance Tracker</h1>
          <ul className="nav-menu">
            <li className={`nav-item ${isActive('/') ? 'active' : ''}`}>
              <Link to="/">Create Data</Link>
            </li>
            <li className={`nav-item ${isActive('/marks') ? 'active' : ''}`}>
              <Link to="/marks">Enter Marks</Link>
            </li>
            <li className={`nav-item ${isActive('/analytics') ? 'active' : ''}`}>
              <Link to="/analytics">Analytics</Link>
            </li>
          </ul>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        <p>© 2025 Student Performance Tracking System</p>
      </footer>
    </div>
  );
};

export default Layout;