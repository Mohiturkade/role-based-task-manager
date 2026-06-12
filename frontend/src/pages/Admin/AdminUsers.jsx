import React, { useState, useEffect } from 'react';
import { fetchAllUsers, deleteUser, updateUserStatus } from '../../services/api';
import Navbar from '../../components/Common/Navbar';
import { useAuth } from '../../Context/AuthContext';

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try { const res = await fetchAllUsers(); setUsers(res.data.users); }
    catch { setError('Failed to load users'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? Their tasks will also be deleted.`)) return;
    try { await deleteUser(id); setUsers(prev => prev.filter(u => u._id !== id)); }
    catch (err) { setError(err.response?.data?.message || 'Delete failed'); }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const res = await updateUserStatus(id, currentStatus === 'Active' ? 'Inactive' : 'Active');
      setUsers(prev => prev.map(u => u._id === id ? res.data.user : u));
    } catch (err) { setError(err.response?.data?.message || 'Update failed'); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h2>User Management</h2>
          <span className="text-muted">{users.length} total users</span>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="search-bar">
          <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {loading ? <div className="loading-center"><div className="spinner"></div></div> : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u._id} className={u._id === currentUser._id ? 'current-user-row' : ''}>
                    <td><strong>{u.name}</strong>{u._id === currentUser._id && <span className="you-badge"> (you)</span>}</td>
                    <td>{u.email}</td>
                    <td><span className={`role-badge ${u.role === 'Admin' ? 'admin' : 'user'}`}>{u.role}</span></td>
                    <td><span className={`status-badge ${u.status === 'Active' ? 'status-completed' : 'status-pending'}`}>{u.status}</span></td>
                    <td>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      {u._id !== currentUser._id ? (
                        <div className="action-buttons">
                          <button className={`btn btn-sm ${u.status === 'Active' ? 'btn-warning' : 'btn-success'}`}
                            onClick={() => handleToggleStatus(u._id, u.status)}>
                            {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u._id, u.name)}>Delete</button>
                        </div>
                      ) : <span className="text-muted">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="empty-state"><span>🔍</span><p>No users match your search.</p></div>}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminUsers;