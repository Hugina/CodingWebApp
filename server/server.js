const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const Server = socketIO.Server;

const app = express(); // Use Express framework for the server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:8085', // allow requests from React frontend
    methods: ['GET', 'POST'],
  },
});

const codeBlockData = {}; // Store the current code for each code block
const mentors = {}; // Store the mentor for each code block
const studentCounts = {}; // Track the number of students in each room
const socketToRoom = {}; // Map sockets to rooms (code blocks)

const solutions = {
  1: 'console.log("Hello, World!");',
  2: 'function add(a, b) { return a + b; }',
  3: '[1, 2, 3].map(x => x * 2);',
  4: 'function factorial(n) { return n <= 1 ? 1 : n * factorial(n - 1); }',
};

const initialTemplates = {
  1: `// Task: Print "Hello, World!" to the console.
console.log();`,
  2: `// Task: Write a function to add two numbers.
function add(a, b) {}`,
  3: `// Task: Multiply each number in the array by 2.
const numbers = [1, 2, 3, 4, 5];`,
  4: `// Task: Write a recursive function to calculate the factorial of a number.
function factorial(n) {}`,
};

// Serve a basic response for the root URL
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>WebSocket Server</title>
      </head>
      <body>
        <h1>WebSocket Server is Running</h1>
        <p>This is the root endpoint. Your WebSocket server is working.</p>
      </body>
    </html>
  `);
});

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on('join-code-block', (codeBlockId) => {
    socket.join(codeBlockId);
    socketToRoom[socket.id] = codeBlockId;

    if (!mentors[codeBlockId]) {
      mentors[codeBlockId] = socket.id;
      socket.emit('role', 'mentor');
      console.log(`User ${socket.id} is the mentor for code block ${codeBlockId}`);
    } else {
      socket.emit('role', 'student');
      studentCounts[codeBlockId] = (studentCounts[codeBlockId] || 0) + 1;
      io.to(codeBlockId).emit('student-count', studentCounts[codeBlockId]);
    }

    if (codeBlockData[codeBlockId]) {
      socket.emit('update-code', codeBlockData[codeBlockId]);
    } else if (initialTemplates[codeBlockId]) {
      codeBlockData[codeBlockId] = initialTemplates[codeBlockId];
      socket.emit('update-code', initialTemplates[codeBlockId]);
    }
  });

  socket.on('code-change', ({ codeBlockId, newCode }) => {
    codeBlockData[codeBlockId] = newCode;

    const removeComments = (code) => code.replace(/\/\/.*|\/\*[^]*?\*\//g, '').trim();

    const cleanedUserCode = removeComments(newCode);
    const cleanedSolution = removeComments(solutions[codeBlockId] || '');

    if (cleanedUserCode === cleanedSolution) {
      io.to(codeBlockId).emit('solution-matched');
    } else {
      io.to(codeBlockId).emit('solution-not-matched');
    }

    if (codeBlockData[codeBlockId]) {
      socket.to(codeBlockId).emit('update-code', newCode);
    }
  });

  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.id}`);

    const codeBlockId = socketToRoom[socket.id];
    delete socketToRoom[socket.id];

    if (!codeBlockId) {
      return;
    }

    if (mentors[codeBlockId] === socket.id) {
      console.log(`Mentor ${socket.id} disconnected from code block ${codeBlockId}`);
      io.to(codeBlockId).emit('mentor-disconnected');
      delete mentors[codeBlockId];
      delete codeBlockData[codeBlockId];
      studentCounts[codeBlockId] = 0;
      io.to(codeBlockId).emit('student-count', 0);
    } else {
      studentCounts[codeBlockId] = Math.max(0, (studentCounts[codeBlockId] || 1) - 1);
      io.to(codeBlockId).emit('student-count', studentCounts[codeBlockId]);
    }
  });
});

const PORT = process.env.PORT || 4000; // Use PORT environment variable or default to 4000
server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
});
