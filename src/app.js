import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// Configure cors
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Configuring accepting the json
app.use(express.json({ limit: '16kb' }));

// Configuring the URL params
app.use(
  express.urlencoded({
    extended: true,
    limit: '16kb',
  })
);

// Stroing the files and folder in public folder serves the files even clients can access
app.use(express.static('public'));

// Configuring the cookies for CRUD WITH THE USER COOKIE
app.use(cookieParser());

// Routes Import
import userRoutes from './routes/userRoutes.js';

// routes declaration
// http://localhost:8000/api/v1/users/ -- procceds to the user routes handler
app.use('/api/v1/users', userRoutes);

export { app };
