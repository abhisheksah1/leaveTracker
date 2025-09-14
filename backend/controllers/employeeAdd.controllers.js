import Employee from '../models/employeeAdd.model.js';

// // Get all employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// // Get single employee
export const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};







// Create new employee
export const createEmployee = async (req, res) => {
  console.log('Body:', req.body);   // Text fields
  console.log('File:', req.file);   // Uploaded file info

  try {
    const { employeeId, employeeName, employeeDepartment } = req.body;

    if (!employeeId || !employeeName || !employeeDepartment) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const photo = req.file ? req.file.path : '';
    const newEmployee = new Employee({ employeeId, employeeName, employeeDepartment, photo });
    await newEmployee.save();

    res.status(201).json({ message: 'Employee added successfully', newEmployee });
  } catch (err) {
    console.error(err);   // Detailed error
    res.status(400).json({ message: err.message });
  }
};










// // Update employee
export const updateEmployee = async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Employee not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete employee
export const deleteEmployee = async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};