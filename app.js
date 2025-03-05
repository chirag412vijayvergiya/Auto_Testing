const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoute');
const app = express();
app.use(express.json());
app.use('/api', userRoutes);
module.exports = app;