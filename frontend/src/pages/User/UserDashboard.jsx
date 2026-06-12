import React, { useState, useEffect } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from '../../services/api';
import Navbar from '../../components/Common/Navbar';
import TaskModal from '../../components/Task/TaskModal';
import TaskCard from '../../components/Task/TaskCard';

const UserDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filter, setFilter] = useState('All');
  const [error, setError] = useState('');

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    try {
      const res = await fetchTasks();
      setTasks(res.data.tasks);
    } catch { setError('Failed to load tasks'); }
    finally { setLoading(false); }
  };

  const handleSave = async data => {
    try {
      if (editTask) await updateTask(editTask._id, data);
      else await createTask(data);
      await loadTasks();
      setModalOpen(false); setEditTask(null);
    } catch (err) { throw new Error(err.response?.data?.message || 'Save failed'); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch { setError('Failed to delete task'); }
  };

  const handleEdit = task => { setEditTask(task); setModalOpen(true); };

  const counts = {
    All: tasks.length,
    Pending: tasks.filter(t => t.status === 'Pending').length,
    'In Progress': tasks.filter(t => t.status === 'In Progress').length,
    Completed: tasks.filter(t => t.status === 'Completed').length,
  };

  const filtered = filter === 'All' ? tasks : tasks.filter(t => t.status === filter);

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h2>My Tasks</h2>
          <button className="btn btn-primary" onClick={() => { setEditTask(null); setModalOpen(true); }}>
            + New Task
          </button>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="filter-tabs">
          {Object.entries(counts).map(([key, count]) => (
            <button key={key} className={`filter-tab ${filter === key ? 'active' : ''}`} onClick={() => setFilter(key)}>
              {key} <span className="tab-count">{count}</span>
            </button>
          ))}
        </div>
        {loading ? <div className="loading-center"><div className="spinner"></div></div>
          : filtered.length === 0 ? (
            <div className="empty-state"><span>📋</span><p>{filter === 'All' ? 'No tasks yet. Create your first!' : `No ${filter} tasks.`}</p></div>
          ) : (
            <div className="task-grid">
              {filtered.map(task => <TaskCard key={task._id} task={task} onEdit={handleEdit} onDelete={handleDelete} />)}
            </div>
          )}
      </div>
      {modalOpen && <TaskModal task={editTask} onSave={handleSave} onClose={() => { setModalOpen(false); setEditTask(null); }} />}
    </>
  );
};

export default UserDashboard;