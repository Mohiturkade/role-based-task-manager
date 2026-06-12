import React, { useState, useEffect } from 'react';
import { fetchAllTasks, adminDeleteTask } from '../../services/api';
import Navbar from '../../components/Common/Navbar';
import TaskCard from '../../components/Task/TaskCard';

const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    try { const res = await fetchAllTasks(); setTasks(res.data.tasks); }
    catch { setError('Failed to load tasks'); }
    finally { setLoading(false); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this task?')) return;
    try { await adminDeleteTask(id); setTasks(prev => prev.filter(t => t._id !== id)); }
    catch { setError('Delete failed'); }
  };

  const counts = {
    All: tasks.length,
    Pending: tasks.filter(t => t.status === 'Pending').length,
    'In Progress': tasks.filter(t => t.status === 'In Progress').length,
    Completed: tasks.filter(t => t.status === 'Completed').length,
  };

  const filtered = tasks.filter(t => {
    const matchStatus = filter === 'All' || t.status === filter;
    const matchSearch = !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.user?.name?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h2>Task Monitoring</h2>
          <span className="text-muted">{tasks.length} total tasks</span>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="search-bar">
          <input type="text" placeholder="Search by title or user..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-tabs">
          {Object.entries(counts).map(([key, count]) => (
            <button key={key} className={`filter-tab ${filter === key ? 'active' : ''}`} onClick={() => setFilter(key)}>
              {key} <span className="tab-count">{count}</span>
            </button>
          ))}
        </div>
        {loading ? <div className="loading-center"><div className="spinner"></div></div>
          : filtered.length === 0
            ? <div className="empty-state"><span>📋</span><p>No tasks found.</p></div>
            : <div className="task-grid">
                {filtered.map(task => <TaskCard key={task._id} task={task} onDelete={handleDelete} showUser />)}
              </div>
        }
      </div>
    </>
  );
};

export default AdminTasks;