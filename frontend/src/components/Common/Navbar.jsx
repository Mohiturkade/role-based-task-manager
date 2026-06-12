import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = path => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'}>
          <span className="brand-icon">✦</span> TaskFlow
        </Link>
      </div>

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>

      <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        {isAdmin ? (
          <>
            <Link to="/admin/dashboard" className={isActive('/admin/dashboard') ? 'active' : ''}>Dashboard</Link>
            <Link to="/admin/users" className={isActive('/admin/users') ? 'active' : ''}>Users</Link>
            <Link to="/admin/tasks" className={isActive('/admin/tasks') ? 'active' : ''}>All Tasks</Link>
            <Link to="/admin/activity" className={isActive('/admin/activity') ? 'active' : ''}>Activity Logs</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>My Tasks</Link>
            <Link to="/activity" className={isActive('/activity') ? 'active' : ''}>My Activity</Link>
          </>
        )}
      </div>

      <div className="navbar-user">
        <span className={`role-badge ${isAdmin ? 'admin' : 'user'}`}>{user?.role}</span>
        <span className="user-name">{user?.name}</span>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;