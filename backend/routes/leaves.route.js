// routes/leave.js
import express from 'express';
import { applyLeave, deleteLeave, getLeavesByEmployee, updateLeave } from '../controllers/employeeLeave.controllers.js'

const router = express.Router();

// Route to apply for leave
router.post('/apply', applyLeave);
router.get('/getLeave', getLeavesByEmployee)
// Update a leave
router.put('/update/:leaveId', updateLeave);

// Delete a leave
router.delete('/delete/:leaveId', deleteLeave);

export default router;
