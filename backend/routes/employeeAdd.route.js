
import express from 'express';
import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from '../controllers/employeeAdd.controllers.js';
import upload from '../uploads.js';

const router = express.Router();

router.get('/', getEmployees);
router.get('/:id', getEmployee);
router.post('/', upload.single('photo'), createEmployee); // 'photo' = form field name
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;
