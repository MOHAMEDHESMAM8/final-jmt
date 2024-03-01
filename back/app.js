
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeSocket } = require('./socket'); // Adjust the path accordingly
const authController = require('./controllers/authController');
const registerController = require('./controllers/registrationController');
const patientController = require('./controllers/patientController');
const assessmentController = require('./controllers/assessmentController');
const gameController = require('./controllers/gameController');
const sessionController = require('./controllers/sessionController');
const socketIo = require('socket.io');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors())

// Create HTTP server
const server = app.listen(port, () => {
  console.log('Server Listening', port);
});

const moment = require('moment-timezone');

// Set the default timezone to Cairo
moment.tz.setDefault('Africa/Cairo');


app.use(express.json());

// Use express static folder
app.use(express.static('public'));

// Use auth routes
app.use('/auth', authController);
app.use('/register', registerController);
app.use('/patients', patientController);
app.use('/games', gameController);      
app.use('/sessions', sessionController);  
app.use('/assessments', assessmentController);  


const io = socketIo(server);

app.post('/data', (req, res) => {
    console.log(req.body)
    try{
    io.emit('status', req.body)
    } catch(error){
        console.error('Error', error);
    }
    res.sendStatus(200);
})



app.get('/', function (req, res) {
    console.log("/user request calle");
    res.send("Hello from the root application URL");
});
