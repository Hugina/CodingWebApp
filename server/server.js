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
// In this task, you should print the message "Hello, World!" to the console.
console.log();`, // Template for "Async Case"

  2: `// Task: Write a function to add two numbers.
// In this task, you should complete the function to return the sum of two numbers.
function add(a, b) {
  // Your code here
}`, // Template for "Closure Example"

  3: `// Task: Multiply each number in the array by 2.
// In this task, you should create a new array where each element is multiplied by 2.
const numbers = [1, 2, 3, 4, 5];
// Your code here
`, // Template for "Array Manipulation"

  4: `// Task: Write a recursive function to calculate the factorial of a number.
// In this task, you should complete the function to return the factorial of a given number.
function factorial(n) {
  // Your code here
}`, // Template for "Factorial Function"
};




io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on('join-code-block', (codeBlockId) => {
    socket.join(codeBlockId);
    socketToRoom[socket.id] = codeBlockId; // Track the room this socket joined
  
    if (!mentors[codeBlockId]) {
      mentors[codeBlockId] = socket.id;
      socket.emit('role', 'mentor'); // Assign role as mentor
      console.log(`User ${socket.id} is the mentor for code block ${codeBlockId}`);
    } else {
      socket.emit('role', 'student'); // Assign role as student
      studentCounts[codeBlockId] = (studentCounts[codeBlockId] || 0) + 1;
      io.to(codeBlockId).emit('student-count', studentCounts[codeBlockId]); // Broadcast updated count
    }
  
    // Send the current code or the initial template to the user
    if (codeBlockData[codeBlockId]) {
      socket.emit('update-code', codeBlockData[codeBlockId]);
    } else if (initialTemplates[codeBlockId]) {
      codeBlockData[codeBlockId] = initialTemplates[codeBlockId]; // Set initial template as the starting code
      socket.emit('update-code', initialTemplates[codeBlockId]);
    }
  });
  
  socket.on('code-change', ({ codeBlockId, newCode }) => {
    codeBlockData[codeBlockId] = newCode;
  
    // Remove comments from the user code
    const removeComments = (code) => code.replace(/\/\/.*|\/\*[^]*?\*\//g, '').trim();
  
    const cleanedUserCode = removeComments(newCode);
    const cleanedSolution = removeComments(solutions[codeBlockId] || '');
  
    // Check if the submitted code matches the solution
    if (cleanedUserCode === cleanedSolution) {
      io.to(codeBlockId).emit('solution-matched'); // Notify clients of a match
    } else {
      io.to(codeBlockId).emit('solution-not-matched'); // Notify clients of no match
    }
  
    if (codeBlockData[codeBlockId]) {
      socket.to(codeBlockId).emit('update-code', newCode);
    }
  });
  
  

  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.id}`);

    const codeBlockId = socketToRoom[socket.id]; // Get the room this socket was part of
    delete socketToRoom[socket.id]; // Clean up mapping

    if (!codeBlockId) {
      return; // If the socket wasn't in a room, exit early
    }

    // Check if the disconnecting user is a mentor
    if (mentors[codeBlockId] === socket.id) {
      console.log(`Mentor ${socket.id} disconnected from code block ${codeBlockId}`);
      io.to(codeBlockId).emit('mentor-disconnected'); // Notify all users in room
      delete mentors[codeBlockId];
      delete codeBlockData[codeBlockId];
      studentCounts[codeBlockId] = 0;
      io.to(codeBlockId).emit('student-count', 0); // Reset student count
    } else {
      // Decrement student count if the user was a student
      studentCounts[codeBlockId] = Math.max(0, (studentCounts[codeBlockId] || 1) - 1);
      io.to(codeBlockId).emit('student-count', studentCounts[codeBlockId]);
    }
  });
});

server.listen(4000, () => {
  console.log('WebSocket server is running on http://localhost:4000');
});
