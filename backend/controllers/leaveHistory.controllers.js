import Employee from '../models/employeeAdd.model.js';
import Leave from '../models/leaveHistory.model.js';

// Get all leave histories
export const getAllLeaveHistory = async (req, res) => {
  try {
    // Fetch all employees
    const employees = await Employee.find();

    // Fetch all leave records
    const leaves = await Leave.find();

    // Merge leave records with employee info
    const leaveHistory = leaves.map(leave => {
      const emp = employees.find(e => e.employeeId === leave.employeeId);
      return {
        employeeId: emp?.employeeId || leave.employeeId,
        employeeName: emp?.employeeName || "Unknown",
        employeeDepartment: emp?.employeeDepartment || "Unknown",
        leaveType: leave.leaveType,
        leaveDate: leave.leaveDate,
        leaveMode: leave.leaveMode
      };
    });

    res.json(leaveHistory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
