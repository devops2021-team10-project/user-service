const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();
const authRouter = require('./routes/auth.route.js');

// Init express 
const app = express();

// Setup express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// API routes
app.use('/user-service-api/auth', authRouter);

// Get enviroment vars
const host = process.env.SERVER_HOST;
const port = process.env.SERVER_PORT;

// Start server
const httpServer = http.createServer(app);
httpServer.listen(port, host, function () {
    console.log('Server listening on port ' + port);
});