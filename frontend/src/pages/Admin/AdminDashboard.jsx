import React, { useState, useEffect } from 'react';
import { fetchStats } from '../../services/api';
import Navbar from '../../components/common/Navbar';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#f59e0b','#3b82f6','#10b981'];

const StatCard = ({ label, value, icon, color }) => (
  <div className={`stat-card stat-${color}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-info">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats().then(res => setStats(res.data.stats)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <><Navbar /><div className="loading-center"><div className="spinner"></div></div></>;

  const pieData = [
    { name:'Pending', value: stats.pendingTasks },
    { name:'In Progress', value: stats.inProgressTasks },
    { name:'Completed', value: stats.completedTasks },
  ];
  const barData = [
    { name:'Users', count: stats.totalUsers },
    { name:'Total Tasks', count: stats.totalTasks },
    { name:'Completed', count: stats.completedTasks },
    { name:'Pending', count: stats.pendingTasks },
    { name:'In Progress', count: stats.inProgressTasks },
  ];

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h2>Admin Dashboard</h2>
          <span className="text-muted">Platform overview</span>
        </div>
        <div className="stats-grid">
          <StatCard label="Total Users" value={stats.totalUsers} icon="👥" color="blue" />
          <StatCard label="Total Tasks" value={stats.totalTasks} icon="📋" color="purple" />
          <StatCard label="Completed" value={stats.completedTasks} icon="✅" color="green" />
          <StatCard label="Pending" value={stats.pendingTasks} icon="⏳" color="yellow" />
          <StatCard label="In Progress" value={stats.inProgressTasks} icon="🔄" color="orange" />
        </div>
        <div className="charts-grid">
          <div className="chart-card">
            <h3>Task Status Distribution</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-card">
            <h3>Platform Stats</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData} margin={{ top:10, right:20, left:0, bottom:5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize:12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;