import React, { useEffect, useState } from 'react';
import './ViewEmployee.css';
import EmployeeLeaveHistory from '../EmployeeLeaveHistory/EmployeeLeaveHistory';

const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

const ViewEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Profile modal
  const [historyEmployeeId, setHistoryEmployeeId] = useState(null); // Full-width history

  // ✅ Helper to normalize photo URL
  const getPhotoUrl = (photo) => {
    if (!photo) return defaultAvatar;
    // Handles both Windows "\" and Linux "/" style paths
    const fileName = photo.split("\\").pop().split("/").pop();
    return `http://localhost:3000/uploads/${fileName}`;
  };

  // Fetch employee list
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/employees'); // your backend port
        if (!res.ok) throw new Error('Failed to fetch employees');
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // View Profile Logic
  const handleViewProfile = async (emp) => {
    setSelectedEmployee(null); // reset modal while loading
    setHistoryEmployeeId(null); // close history if open

    try {
      const res = await fetch(
        `http://localhost:3000/api/leaves/getLeave?employeeId=${emp.employeeId}`
      );
      if (!res.ok) throw new Error('Failed to fetch leave data');
      const data = await res.json();
      const { summary } = data; // expect API returns summary like {casualLeave, sickLeave, ...}
      setSelectedEmployee({ ...emp, ...summary }); // merge summary with employee
    } catch (err) {
      console.error(err);
      alert('Failed to load leave data');
    }
  };

  // View History Logic
  const handleViewHistory = (emp) => {
    setHistoryEmployeeId(emp.employeeId); // show full-width table
    setSelectedEmployee(null); // close profile modal
  };

  // Close profile modal or history on Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedEmployee(null);
        setHistoryEmployeeId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) return <div className="loader">Loading employees...</div>;
  if (error) return <p className="error-message">Error: {error}</p>;

  // Calculate total leave taken
  const calculateTotalLeaveTaken = (emp) => {
    return (
      (emp.casualLeave ?? 0) +
      (emp.sickLeave ?? 0) +
      (emp.personalLeave ?? 0) +
      (emp.halfLeave ?? 0) +
      (emp.overtime ?? 0) +
      (emp.unpaidLeave ?? 0)
    );
  };

  // Calculate total leaves including remaining balance
  const calculateTotalLeaves = (emp) => {
    return (emp.leaveBalance ?? 0) + calculateTotalLeaveTaken(emp);
  };

  const renderProfileModal = () => {
    if (!selectedEmployee) return null;

    const totalTaken = calculateTotalLeaveTaken(selectedEmployee);

    return (
      <div
        className="modal-overlay"
        onClick={() => setSelectedEmployee(null)}
      >
        <div
          className="modal-container"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="profileWithName">
            <img
              src={getPhotoUrl(selectedEmployee.photo)}
              alt="Profile"
              className="modal-avatar"
            />
            <h2 className="employee-name">
              {selectedEmployee.employeeName}
            </h2>
            <p>
              <strong>ID:</strong> {selectedEmployee.employeeId}
            </p>
          </div>

          <div className="employee-details">
            <p>
              <strong>Department:</strong>{' '}
              {selectedEmployee.employeeDepartment}
            </p>
            <p>
              <strong>Leave Balance:</strong>{' '}
              <span
                style={{
                  color:
                    (selectedEmployee.leaveBalance ?? 0) >= 0
                      ? 'green'
                      : 'red',
                  fontWeight: 'bold',
                }}
              >
                {(selectedEmployee.leaveBalance ?? 0).toFixed(1)} days
                remaining
              </span>
            </p>
            <p>
              <strong>Total Leave Taken:</strong>{' '}
              <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>
                {totalTaken.toFixed(1)} days
              </span>
            </p>
          </div>

          <h4 className="section-title">Leave Details</h4>
          <div className="leave-details-grid">
            <div className="leave-detail">
              <p>Casual Leave</p>
              <strong>
                {(selectedEmployee.casualLeave ?? 0).toFixed(1)} days
              </strong>
            </div>
            <div className="leave-detail">
              <p>Sick Leave</p>
              <strong>
                {(selectedEmployee.sickLeave ?? 0).toFixed(1)} days
              </strong>
            </div>
            <div className="leave-detail">
              <p>Personal Leave</p>
              <strong>
                {(selectedEmployee.personalLeave ?? 0).toFixed(1)} days
              </strong>
            </div>
            <div className="leave-detail">
              <p>Half Leave</p>
              <strong>
                {(selectedEmployee.halfLeave ?? 0).toFixed(1)} days
              </strong>
            </div>
            <div className="leave-detail">
              <p>Overtime</p>
              <strong>
                {(selectedEmployee.overtime ?? 0).toFixed(1)} days
              </strong>
            </div>
            <div className="leave-detail">
              <p>Unpaid Leave</p>
              <strong>
                {(selectedEmployee.unpaidLeave ?? 0).toFixed(1)} days
              </strong>
            </div>
          </div>

          <div className="update-profile">
            <button
              className="update-button"
              onClick={() =>
                alert(
                  `Update profile for ${selectedEmployee.employeeName}`
                )
              }
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="employee-list">
        {employees.map((emp) => (
          <div key={emp._id} className="employee-card">
            <img
              src={getPhotoUrl(emp.photo)}
              alt={emp.employeeName}
              className="employee-avatar"
            />
            <div className="employee-info">
              <h3>{emp.employeeName}</h3>
              <p>
                <strong>ID:</strong> {emp.employeeId}
              </p>
              <p>
                <strong>Department:</strong> {emp.employeeDepartment}
              </p>
              <div className="action-buttons">
                <button onClick={() => handleViewProfile(emp)}>
                  View Profile
                </button>
                <button
                  className="history-button"
                  onClick={() => handleViewHistory(emp)}
                >
                  📜 History
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Profile modal */}
      {selectedEmployee && renderProfileModal()}

      {/* Full-width EmployeeLeaveHistory */}
      {historyEmployeeId && (
        <div className="full-width-history">
          <EmployeeLeaveHistory
            employeeId={historyEmployeeId}
            employeeName={
              employees.find(
                (e) => e.employeeId === historyEmployeeId
              )?.employeeName
            }
          />
        </div>
      )}
    </>
  );
};

export default ViewEmployee;
