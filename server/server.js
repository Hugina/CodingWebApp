const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const Server = socketIO.Server;

const app = express(); //i chose to use express framework for the server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:8085', // allow requests from React frontend
    methods: ['GET', 'POST'],
  },
});

const codeBlockData = {}; // store the current code for each code block
const mentors = {}; // dtore the mentor for each code block
const studentCounts = {}; // track the number of students in each room
const socketToRoom = {}; // map sockets to rooms (code blocks)

const solutions = {
  1: 'console.log("Hello, World!");',
  2: 'function add(a, b) { return a + b; }',
  3: '[1, 2, 3].map(x => x * 2);',
  4: 'function factorial(n) { return n <= 1 ? 1 : n * factorial(n - 1); }',
};

const initialTemplates = {
  1: `// Task: Print "Hello, World!" to the console.
// In this task, you should print the message "Hello, World!" to the console.
console.log();`, 

  2: `// Task: Write a function to add two numbers.
// In this task, you should complete the function to return the sum of two numbers.
function add(a, b) {
  // Your code here
}`, 

  3: `// Task: Multiply each number in the array by 2.
// In this task, you should create a new array where each element is multiplied by 2.
const numbers = [1, 2, 3, 4, 5];
// Your code here
`, 

  4: `// Task: Write a recursive function to calculate the factorial of a number.
// In this task, you should complete the function to return the factorial of a given number.
function factorial(n) {
  // Your code here
}`, 
};




io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on('join-code-block', (codeBlockId) => {
    socket.join(codeBlockId);
    socketToRoom[socket.id] = codeBlockId; // track the room this socket joined
  
    if (!mentors[codeBlockId]) { //if there is no mentor for this code block
      mentors[codeBlockId] = socket.id; //assign the mentor
      socket.emit('role', 'mentor'); // notify the user of their role
      console.log(`User ${socket.id} is the mentor for code block ${codeBlockId}`);
    } else {
      socket.emit('role', 'student'); // if there is a mentor, assign the user as a student
      studentCounts[codeBlockId] = (studentCounts[codeBlockId] || 0) + 1;
      io.to(codeBlockId).emit('student-count', studentCounts[codeBlockId]); // broadcast to all users in the room
    }
  
    // send the current code or the initial template to the user
    if (codeBlockData[codeBlockId]) { //if there is code for this code block
      socket.emit('update-code', codeBlockData[codeBlockId]);
    } else if (initialTemplates[codeBlockId]) { //if there is no code for this code block - send the initial template
      codeBlockData[codeBlockId] = initialTemplates[codeBlockId]; // set initial template as the starting code
      socket.emit('update-code', initialTemplates[codeBlockId]);
    }
  });
  
  socket.on('code-change', ({ codeBlockId, newCode }) => {
    codeBlockData[codeBlockId] = newCode;
  
    // remove comments from the user code (used regular expression)
    const removeComments = (code) => code.replace(/\/\/.*|\/\*[^]*?\*\//g, '').trim();
  
    const cleanedUserCode = removeComments(newCode);
    const cleanedSolution = removeComments(solutions[codeBlockId] || '');
  
    // check if the submitted code matches the solution
    if (cleanedUserCode === cleanedSolution) {
      io.to(codeBlockId).emit('solution-matched'); // notify clients of a match
    } else {
      io.to(codeBlockId).emit('solution-not-matched'); // notify clients of no match
    }
  
    if (codeBlockData[codeBlockId]) {
      socket.to(codeBlockId).emit('update-code', newCode);
    }
  });
  
  

  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.id}`);

    const codeBlockId = socketToRoom[socket.id]; // get the room this socket was part of
    delete socketToRoom[socket.id]; // clean up mapping

    if (!codeBlockId) {
      return; // if the socket wasn't in a room, exit 
    }

    // check if the user  that disconected is a mentor
    if (mentors[codeBlockId] === socket.id) {
      console.log(`Mentor ${socket.id} disconnected from code block ${codeBlockId}`);
      io.to(codeBlockId).emit('mentor-disconnected'); // notify all users in room
      delete mentors[codeBlockId];
      delete codeBlockData[codeBlockId];
      studentCounts[codeBlockId] = 0;
      io.to(codeBlockId).emit('student-count', 0); // reset student count
    } else {
      // decrement student count if the user was a student
      studentCounts[codeBlockId] = Math.max(0, (studentCounts[codeBlockId] || 1) - 1);
      io.to(codeBlockId).emit('student-count', studentCounts[codeBlockId]);
    }
  });
});

const PORT = process.env.PORT || 4000; // Use the PORT environment variable (for deployment) or fallback to 4000 (for local development)

server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
});
