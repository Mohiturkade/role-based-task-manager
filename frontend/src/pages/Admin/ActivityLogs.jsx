import React, { useState, useEffect } from 'react';
import { fetchActivityLogs } from '../../services/api';
import Navbar from '../../components/Common/Navbar';
import { useAuth } from '../../Context/AuthContext';

const ACTION_ICONS = {
  LOGIN:'🔐', LOGOUT:'🚪', TASK_CREATED:'➕', TASK_UPDATED:'✏️',
  TASK_DELETED:'🗑️', USER_DELETED:'👤', USER_STATUS_UPDATED:'🔄',
};
const ACTION_COLORS = {
  LOGIN:'log-login', TASK_CREATED:'log-created', TASK_UPDATED:'log-updated',
  TASK_DELETED:'log-deleted', USER_DELETED:'log-deleted', USER_STATUS_UPDATED:'log-updated',
};

const ActivityLogs = () => {
  const { isAdmin } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchActivityLogs().then(res => setLogs(res.data.logs)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const actionTypes = ['All', ...new Set(logs.map(l => l.action))];

  const filtered = logs.filter(log => {
    const matchAction = filter === 'All' || log.action === filter;
    const matchSearch = !search ||
      log.description.toLowerCase().includes(search.toLowerCase()) ||
      log.user?.name?.toLowerCase().includes(search.toLowerCase());
    return matchAction && matchSearch;
  });

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h2>{isAdmin ? 'Activity Logs' : 'My Activity'}</h2>
          <span className="text-muted">{logs.length} entries</span>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-tabs">
          {actionTypes.map(type => (
            <button key={type} className={`filter-tab ${filter === type ? 'active' : ''}`} onClick={() => setFilter(type)}>
              {type !== 'All' && ACTION_ICONS[type]} {type}
            </button>
          ))}
        </div>
        {loading ? <div className="loading-center"><div className="spinner"></div></div>
          : filtered.length === 0
            ? <div className="empty-state"><span>📊</span><p>No activity logs found.</p></div>
            : (
              <div className="log-list">
                {filtered.map(log => (
                  <div key={log._id} className={`log-entry ${ACTION_COLORS[log.action] || ''}`}>
                    <span className="log-icon">{ACTION_ICONS[log.action] || '📌'}</span>
                    <div className="log-body">
                      <p className="log-desc">{log.description}</p>
                      <div className="log-meta">
                        {isAdmin && log.user && <span className="log-user">👤 {log.user.name}</span>}
                        <span className="log-action-badge">{log.action}</span>
                        <span className="log-time">{new Date(log.createdAt).toLocaleString('en-IN')}</span>
                        {log.ipAddress && <span className="log-ip">🌐 {log.ipAddress}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
      </div>
    </>
  );
};

export default ActivityLogs;