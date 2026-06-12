import React from 'react';

const statusColors = { Pending: 'status-pending', 'In Progress': 'status-progress', Completed: 'status-completed' };
const priorityColors = { Low: 'priority-low', Medium: 'priority-medium', High: 'priority-high' };

const TaskCard = ({ task, onEdit, onDelete, showUser = false }) => {
  const formatDate = d => d
    ? new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
    : '—';
  const isOverdue = task.dueDate && task.status !== 'Completed' && new Date(task.dueDate) < new Date();

  return (
    <div className={`task-card ${isOverdue ? 'overdue' : ''}`}>
      <div className="task-card-header">
        <span className={`status-badge ${statusColors[task.status]}`}>{task.status}</span>
        <span className={`priority-badge ${priorityColors[task.priority]}`}>{task.priority}</span>
      </div>
      <h4 className="task-title">{task.title}</h4>
      {task.description && <p className="task-description">{task.description}</p>}
      {showUser && task.user && (
        <p className="task-meta"><span>👤</span> {task.user.name} ({task.user.email})</p>
      )}
      <p className={`task-due ${isOverdue ? 'text-danger' : ''}`}>
        <span>📅</span> {isOverdue ? '⚠ Overdue · ' : ''}{formatDate(task.dueDate)}
      </p>
      {(onEdit || onDelete) && (
        <div className="task-actions">
          {onEdit && <button className="btn btn-sm btn-outline" onClick={() => onEdit(task)}>Edit</button>}
          {onDelete && <button className="btn btn-sm btn-danger" onClick={() => onDelete(task._id)}>Delete</button>}
        </div>
      )}
    </div>
  );
};

export default TaskCard;