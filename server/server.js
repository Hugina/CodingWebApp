const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const codeBlockData = {}; // Store code for each code block

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join a specific code block room
  socket.on('join-code-block', (codeBlockId) => {
    socket.join(codeBlockId);
    console.log(`User ${socket.id} joined code block ${codeBlockId}`);

    // Send the current code to the newly joined user
    if (codeBlockData[codeBlockId]) {
      socket.emit('update-code', codeBlockData[codeBlockId]);
    }
  });

  // Handle code changes
  socket.on('code-change', ({ codeBlockId, newCode }) => {
    codeBlockData[codeBlockId] = newCode; // Save the updated code
    socket.to(codeBlockId).emit('update-code', newCode); // Broadcast to others
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`WebSocket server is running on http://localhost:${PORT}`);
});
