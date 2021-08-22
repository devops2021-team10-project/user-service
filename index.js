const express = require('express');
const http = require('http');
const cors = require('cors');
const passport = require('passport');

require('dotenv').config();

const app = express();

// Pass the global passport object into the configuration function
require('./utils/passport')(passport);

// This will initialize the passport object on every request
app.use(passport.initialize());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// api routes
app.use('/api/auth', require('./routes/auth.route'));
//app.use('/api/user', require('./routes/user.route'));

// start server
const host = process.env.SERVER_HOST;
const port = process.env.SERVER_PORT;


const httpServer = http.createServer(app);
httpServer.listen(port, host, function () {
    console.log('Server listening on port ' + port);
});