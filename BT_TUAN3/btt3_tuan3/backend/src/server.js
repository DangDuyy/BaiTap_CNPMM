import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoute from './routes/authRoute.js';
import connectDB from './lib/connectDB.js';
import { env } from './config/environment.js';
import { APIs_V1 } from './routes/index.js';
import seedUsers from './seeds/seedUsers.js'; // Import the seed function
import cookieParser from 'cookie-parser';

const app = express();
const PORT =env.LOCAL_DEV_APP_PORT || 3000;

// Dùng để parse request body dạng JSON sang javaScript object
app.use(bodyParser.json());
// Dùng để parse request body dạng x-www-form-urlencoded sang javaScript object
// Extended true cho phép sử dụng các kiểu dữ liệu phức tạp hơn như object lồng nhau, mảng, v.v.
app.use(bodyParser.urlencoded({ extended: true }));
// Configure CORS: allow specific origin from env or relax on local dev
const corsOptions = {
    origin: (origin, callback) => {
        // If no origin (server-to-server or tools like Postman), allow
        if (!origin) return callback(null, true)
        const allowed = env.WEBSITE_DOMAIN_DEVELOPMENT || ''
        // allow if exact match or if allowed string is empty (dev)
        if (!allowed || origin === allowed || origin.includes('localhost')) return callback(null, true)
        return callback(new Error('Not allowed by CORS'))
    },
    credentials: true
}
app.use(cors(corsOptions));

app.use(cookieParser()); // Middleware to parse cookies

app.use('/api', APIs_V1);
// Error handler to catch unexpected errors and return JSON (helps debug 500s)
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err && err.stack ? err.stack : err)
    res.status(500).json({ message: err?.message || 'Internal server error', stack: process.env.NODE_ENV !== 'production' ? err?.stack : undefined })
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://${env.LOCAL_DEV_APP_HOST}:${PORT}`);
    connectDB();
    // seedUsers(); // Call the seed function to populate the database
});