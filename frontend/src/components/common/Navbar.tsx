import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getStoredUser, clearAuth, isAdmin } from '../../utils/auth';
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const user = getStoredUser();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={isAdmin() ? '/admin' : '/dashboard'} className="navbar-brand">
          E-Learning Platform
        </Link>
        
        <div className="navbar-menu">
          {isAdmin() ? (
            // Admin navigation
            <>
              <Link to="/admin" className="navbar-item">Dashboard</Link>
              <Link to="/admin/courses" className="navbar-item">Courses</Link>
              <Link to="/admin/reports" className="navbar-item">Reports</Link>
            </>
          ) : (
            // Student navigation
            <>
              <Link to="/dashboard" className="navbar-item">Dashboard</Link>
              <Link to="/courses" className="navbar-item">Courses</Link>
              <Link to="/progress" className="navbar-item">My Progress</Link>
            </>
          )}
          
          <div className="navbar-user">
            <span className="user-name">Hello, {user.username}</span>
            <span className="user-role">({user.role})</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;