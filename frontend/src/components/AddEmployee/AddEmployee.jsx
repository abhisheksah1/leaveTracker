import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddEmployee.css';

const AddEmployee = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    employeeDepartment: '',
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  // Handle text inputs
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle photo selection
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append('employeeId', formData.employeeId);
      data.append('employeeName', formData.employeeName);
      data.append('employeeDepartment', formData.employeeDepartment);
      if (photo) data.append('photo', photo);

      const response = await fetch('http://localhost:3000/api/employees', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) throw new Error('Failed to add employee');

      const result = await response.json();
      toast.success(result.message || 'Employee added successfully!');

      // Reset form
      setFormData({ employeeId: '', employeeName: '', employeeDepartment: '' });
      setPhoto(null);
      setPreview(null);
      onClose();
    } catch (error) {
      toast.error('Failed to add employee. Please try again.');
      console.error('Error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-form">
        <h2>Add New Employee</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Employee ID:
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Employee Name:
            <input
              type="text"
              name="employeeName"
              value={formData.employeeName}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Employee Department:
            <input
              type="text"
              name="employeeDepartment"
              value={formData.employeeDepartment}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Employee Photo:
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
          </label>

          {/* Preview selected photo */}
          {preview && (
            <div className="photo-preview">
              <img src={preview} alt="Preview" />
            </div>
          )}

          <div className="form-buttons">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default AddEmployee;
