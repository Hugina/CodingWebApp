const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:8085', // Allow requests from your React frontend
    methods: ['GET', 'POST'],
  },
});

const codeBlockData = {}; // Store the current code for each code block

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // Handle when a user joins a specific code block
  socket.on('join-code-block', (codeBlockId) => {
    console.log(`User ${socket.id} joined code block ${codeBlockId}`);
    socket.join(codeBlockId); // Join the room for the specific code block

    // Send the current code to the user if it exists
    if (codeBlockData[codeBlockId]) {
      console.log(`Sending current code for code block ${codeBlockId}`);
      socket.emit('update-code', codeBlockData[codeBlockId]);
    }
  });

  // Handle code changes
  socket.on('code-change', ({ codeBlockId, newCode }) => {
    codeBlockData[codeBlockId] = newCode; // Save the latest code for the block
    console.log(`Code updated for code block ${codeBlockId}:`, newCode);

    // Broadcast the updated code to all other clients in the room
    socket.to(codeBlockId).emit('update-code', newCode);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.id}`);
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`WebSocket server is running on http://localhost:${PORT}`);
});
