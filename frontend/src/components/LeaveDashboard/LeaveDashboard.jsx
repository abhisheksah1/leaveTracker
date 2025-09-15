import React, { useEffect, useState } from "react";
import "./LeaveDashboard.css";

const LeaveDashboard = () => {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/leavesHistory/leaveHistory"
        );
        const data = await res.json();
        setLeaveHistory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaveHistory();
  }, []);

  if (loading) return <div className="loader">Loading leave history...</div>;

  return (
    <div className="leave-dashboard">
      <h2>Employee Leave History</h2>
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Leave Type</th>
           
            <th>Leave Mode</th>
          </tr>
        </thead>
        <tbody>
          {leaveHistory.map((leave, idx) => (
            <tr key={idx}>
              <td data-label="Employee ID">{leave.employeeId}</td>
              <td data-label="Name">{leave.employeeName}</td>
              <td data-label="Department">{leave.employeeDepartment}</td>
              <td data-label="Leave Type">{leave.leaveType}</td>
              
              <td data-label="Leave Mode">{leave.leaveMode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveDashboard;
