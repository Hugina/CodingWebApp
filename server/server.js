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
const mentors = {}; // Store the mentor for each code block

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // Handle when a user joins a specific code block
  socket.on('join-code-block', (codeBlockId) => {
    console.log(`User ${socket.id} joined code block ${codeBlockId}`);
    socket.join(codeBlockId);

    // Assign mentor role if none exists
    if (!mentors[codeBlockId]) {
      mentors[codeBlockId] = socket.id;
      socket.emit('role', 'mentor'); // Notify user of their role
      console.log(`User ${socket.id} is now the mentor for code block ${codeBlockId}`);
    } else {
      socket.emit('role', 'student'); // Notify user of their role
      console.log(`User ${socket.id} is now a student for code block ${codeBlockId}`);
    }

    // Send the current code to the user if it exists
    if (codeBlockData[codeBlockId]) {
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

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.id}`);

    // Check if the disconnecting user was a mentor
    for (const codeBlockId in mentors) {
      if (mentors[codeBlockId] === socket.id) {
        console.log(`Mentor ${socket.id} disconnected from code block ${codeBlockId}`);

        // Notify all students in the room and reset the code
        io.to(codeBlockId).emit('mentor-disconnected');
        delete codeBlockData[codeBlockId];
        delete mentors[codeBlockId];
        break;
      }
    }
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`WebSocket server is running on http://localhost:${PORT}`);
});
