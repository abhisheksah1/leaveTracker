import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  leaveType: { type: String, required: true },
  leaveDate: { type: Date, required: true },
  leaveMode: { type: String, enum: ['Single', 'Multiple'], default: 'Single' },
});

// ✅ Prevent OverwriteModelError
const Leave = mongoose.models.Leave || mongoose.model('Leave', leaveSchema);

export default Leave;