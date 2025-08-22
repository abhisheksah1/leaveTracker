import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';                   // Import cors
import connectDB from './database/database.js';

import employeeRoutes from './routes/employeeAdd.route.js';
import employeeLeaveRoutes from './routes/leaves.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS (allow requests from any origin, or specify a list of origins in production)
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*';

app.use(cors({
  origin: allowedOrigins,
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB Atlas
connectDB();

// Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/leaves', employeeLeaveRoutes);

app.get('/', (req, res) => {
  res.send('Backend connected to MongoDB Atlas!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
