import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Verbose Debugging Middleware
// Verbose Debugging Middleware
app.use((req, res, next) => {
    console.log(`\n[DEBUG] ${req.method} ${req.url}`);
    if (req.body && Object.keys(req.body).length > 0) console.log('Body:', JSON.stringify(req.body, null, 2));
    if (req.params && Object.keys(req.params).length > 0) console.log('Params:', req.params);
    if (req.query && Object.keys(req.query).length > 0) console.log('Query:', req.query);
    next();
});

// Database Connection
connectDB();

// Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import buildingRoutes from './routes/buildingRoutes.js';
import floorRoutes from './routes/floorRoutes.js';
import apartmentRoutes from './routes/apartmentRoutes.js';
import meterRoutes from './routes/meterRoutes.js';
import billingRoutes from './routes/billingRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/buildings', buildingRoutes);
app.use('/api/floors', floorRoutes);
app.use('/api/apartments', apartmentRoutes);
app.use('/api/readings', meterRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
    res.send('Smart Water Billing API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
