require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const bookRoutes = require('./routes/books');

const app = express();

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:3000',
            /https:\/\/.*\.app\.github\.dev$/  // Allow any GitHub Codespaces URL
        ];
        
        // Check if the origin is allowed
        const isAllowedOrigin = allowedOrigins.some(allowedOrigin => {
            return typeof allowedOrigin === 'string' 
                ? allowedOrigin === origin
                : allowedOrigin.test(origin);
        });
        
        if (isAllowedOrigin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// Ensure preflight (OPTIONS) requests receive the proper CORS headers
// Use a regex route to avoid path-to-regexp parsing issues with some Express versions
app.options(/.*/, cors(corsOptions));

// Routes
app.use('/api/books', bookRoutes);

// MongoDB  Shayen connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

const PORT = process.env.PORT || 5000;
// Bind to 0.0.0.0 so external proxies (Codespaces / container port forwarding) can reach the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});