// socket.js
const socketIO = require('socket.io');

let io;
let socketIdSubmissionMap = new Map();

function initializeSocket(server) {
  io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('A user connected with socket ID:', socket.id);

    // Handle reconnection events
    socket.on('disconnect', (reason) => {
      console.log(`User disconnected with socket ID ${socket.id}. Reason: ${reason}`);
    });

    // Listen for the 'acceptSubmission' event
    socket.on('acceptSubmission', ({ socketId, message }) => {
        // Broadcast a welcome message to the specific client
        io.to(socketId).emit('welcomeMessage', message);
        console.log(socketId, "tot")
      });

    socket.on('associateSocketId', (socketId) => {
        io.emit('associateSocketId', socketId);
    })
  });

  return io;
}

function getIo() {
  if (!io) {
    throw new Error('Socket.IO has not been initialized');
  }
  return io;
}

module.exports = { initializeSocket, getIo };
