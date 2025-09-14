import React, { useState } from "react";
import "./Navbar.css";
import AddEmployee from "../AddEmployee/AddEmployee";
import LeaveForm from "../EmployeeLeaveForm/LeaveFrom";



const Navbar = () => {
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">  Leave Tracker</div>

        <div className="navbar-links">
          <button className="nav-btn" onClick={() => setShowAddEmployee(true)}>
            Add Employee
          </button>
          <button className="nav-btn" onClick={() => setShowLeaveForm(true)}>
            Employee Leave Form
          </button>
        </div>
      </nav>

      {/* Popups */}
      <AddEmployee
        isOpen={showAddEmployee}
        onClose={() => setShowAddEmployee(false)}
      />
      <LeaveForm
        isOpen={showLeaveForm}
        onClose={() => setShowLeaveForm(false)}
      />
    </>
  );
};

export default Navbar;
