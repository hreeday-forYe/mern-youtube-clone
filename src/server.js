// require('dotenv').config({path: './env'})
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './db/dbConnect.js';

// This below function is async function which returns promise
connectDB()
  .then(() => {
    app.on('error', (error) => {
      console.log('Err:', error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at PORT: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log('DataBase Connection Failed: || ', err);
  });
