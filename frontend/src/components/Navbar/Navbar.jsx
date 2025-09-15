import React, { useState, useEffect } from "react";
import ViewEmployee from "../ViewEmployee/ViewEmployee";
import AddEmployee from "../AddEmployee/AddEmployee";
import LeaveForm from "../EmployeeLeaveForm/LeaveFrom";
import LeaveDashboard from "../LeaveDashboard/LeaveDashboard";
import "./Navbar.css";

const Navbar = () => {
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem("currentView") || "dashboard";
  });
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu toggle

  // Blur navbar if modal open
  const isModalOpen = showAddEmployee || showLeaveForm;

  useEffect(() => {
    localStorage.setItem("currentView", currentView);
  }, [currentView]);

  const changeView = (view) => {
    setCurrentView(view);
    setMenuOpen(false); // close mobile menu when selecting
  };

  return (
    <>
      <nav className={`navbar ${isModalOpen ? "blurred" : ""}`}>
        <div className="navbar-logo">Leave Tracker</div>

        <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <button className="nav-btn" onClick={() => changeView("dashboard")}>
            Dashboard
          </button>
          <button className="nav-btn" onClick={() => changeView("viewEmployee")}>
            View Employee
          </button>
          <button className="nav-btn" onClick={() => setShowAddEmployee(true)}>
            Add Employee
          </button>
          <button className="nav-btn" onClick={() => setShowLeaveForm(true)}>
            Employee Leave Form
          </button>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>

      {/* Full-page views */}
      {currentView === "dashboard" && <LeaveDashboard />}
      {currentView === "viewEmployee" && <ViewEmployee />}

      {/* Popups */}
      {showAddEmployee && (
        <AddEmployee
          isOpen={showAddEmployee}
          onClose={() => setShowAddEmployee(false)}
        />
      )}
      {showLeaveForm && (
        <LeaveForm
          isOpen={showLeaveForm}
          onClose={() => setShowLeaveForm(false)}
        />
      )}
    </>
  );
};

export default Navbar;
