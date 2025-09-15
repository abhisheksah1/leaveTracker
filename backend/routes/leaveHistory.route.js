// routes/leave.js
import express from 'express';
import { getAllLeaveHistory } from '../controllers/leaveHistory.controllers.js';

const router = express.Router();

router.get('/leaveHistory', getAllLeaveHistory);

export default router;
