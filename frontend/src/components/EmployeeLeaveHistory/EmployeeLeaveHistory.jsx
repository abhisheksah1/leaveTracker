import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EmployeeLeaveHistory.css';

const EmployeeLeaveHistory = ({ employeeId, employeeName }) => {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [updateLeave, setUpdateLeave] = useState(null); // For update modal

  const fetchLeaveHistory = async () => {
    if (!employeeId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:3000/api/leaves/getLeave?employeeId=${employeeId}`);
      if (!res.ok) throw new Error('Failed to fetch leave history');
      const data = await res.json();
      setLeaveHistory(data.leaves || []);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveHistory();
  }, [employeeId]);

  const handleDeleteLeave = async (leaveId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/leaves/delete/${leaveId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete leave');
      toast.success('Leave deleted successfully');
      setDeleteConfirmId(null);
      fetchLeaveHistory();
    } catch (err) {
      console.error(err);
      toast.error('Error deleting leave');
    }
  };

  const handleOpenUpdateModal = (leave) => {
    setUpdateLeave({
      ...leave,
      leaveType: leave.leaveType || '',
      leaveMode: leave.leaveMode || 'Single',
      leaveDate: leave.leaveDate || '',
      leaveFrom: leave.leaveFrom || '',
      leaveTo: leave.leaveTo || '',
    });
  };

  const handleUpdateLeaveSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/api/leaves/update/${updateLeave._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateLeave),
      });

      if (!res.ok) throw new Error('Failed to update leave');

      toast.success('Leave updated successfully');
      setUpdateLeave(null);
      fetchLeaveHistory();
    } catch (err) {
      console.error(err);
      toast.error('Error updating leave');
    }
  };

  if (loading) return <p className="loader">Loading leave history...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (leaveHistory.length === 0) return <p>No leave history found for {employeeName}.</p>;

  return (
    <div className="leave-history-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h3>Leave History of {employeeName}</h3>
      <table className="leave-history-table">
        <thead>
          <tr>
            <th>S.N</th>
            <th>Leave ID</th>
            <th>Date / From-To</th>
            <th>Created Date</th>
            <th>Type</th>
            <th>Mode</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaveHistory.map((leave, index) => (
            <tr key={leave._id || index}>
              <td>{index + 1}</td>
              <td>{leave._id || '-'}</td>
              <td>
                {leave.leaveMode === 'Multiple'
                  ? `${new Date(leave.leaveFrom).toLocaleDateString()} to ${new Date(leave.leaveTo).toLocaleDateString()}`
                  : new Date(leave.leaveDate).toLocaleDateString()}
              </td>
              <td>{leave.createdAt ? new Date(leave.createdAt).toLocaleDateString() : '-'}</td>
              <td>{leave.leaveTypeName || leave.leaveType}</td>
              <td>{leave.leaveMode}</td>
              <td>
                <button
                  className="update-leave-button"
                  onClick={() => handleOpenUpdateModal(leave)}
                >
                  Update
                </button>
                <button
                  className="delete-leave-button"
                  onClick={() => setDeleteConfirmId(leave._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <p>Are you sure you want to delete this leave history?</p>
            <div className="modal-buttons">
              <button
                className="confirm-delete"
                onClick={() => handleDeleteLeave(deleteConfirmId)}
              >
                Yes
              </button>
              <button
                className="cancel-delete"
                onClick={() => setDeleteConfirmId(null)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {updateLeave && (
        <div className="modal-overlay">
          <div className="update-modal">
            <h3>Update Leave</h3>
            <form onSubmit={handleUpdateLeaveSubmit}>
              <div className="form-group">
                <label>Leave Type:</label>
  <select
    value={updateLeave.leaveType}
    onChange={(e) =>
      setUpdateLeave({ ...updateLeave, leaveType: e.target.value })
    }
    required
  >
    <option value="">Select Leave Type</option>
    <option value="Casual">Casual</option>
    <option value="Sick">Sick</option>
    <option value="Personal">Personal</option>
    <option value="Half">Half</option>
    <option value="Unpaid">Unpaid</option>
    <option value="Overtime">Overtime</option>
  </select>
              </div>
              <div className="form-group">
                <label>Leave Mode:</label>
                <select
                  value={updateLeave.leaveMode}
                  onChange={(e) => setUpdateLeave({ ...updateLeave, leaveMode: e.target.value })}
                >
                  <option value="Single">Single</option>
                  <option value="Multiple">Multiple</option>
                </select>
              </div>

              {updateLeave.leaveMode === 'Single' && (
                <div className="form-group">
                  <label>Leave Date:</label>
                  <input
                    type="date"
                    value={updateLeave.leaveDate?.split('T')[0] || ''}
                    onChange={(e) => setUpdateLeave({ ...updateLeave, leaveDate: e.target.value })}
                    required
                  />
                </div>
              )}

              {updateLeave.leaveMode === 'Multiple' && (
                <>
                  <div className="form-group">
                    <label>From:</label>
                    <input
                      type="date"
                      value={updateLeave.leaveFrom?.split('T')[0] || ''}
                      onChange={(e) => setUpdateLeave({ ...updateLeave, leaveFrom: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>To:</label>
                    <input
                      type="date"
                      value={updateLeave.leaveTo?.split('T')[0] || ''}
                      onChange={(e) => setUpdateLeave({ ...updateLeave, leaveTo: e.target.value })}
                      required
                    />
                  </div>
                </>
              )}

              <div className="modal-buttons">
                <button type="submit" className="confirm-update">Update</button>
                <button
                  type="button"
                  className="cancel-delete"
                  onClick={() => setUpdateLeave(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeLeaveHistory;
