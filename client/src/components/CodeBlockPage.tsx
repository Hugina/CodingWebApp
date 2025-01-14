import * as React from 'react';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const socket = io('http://localhost:4000'); // Connect to WebSocket server

const solutions: { [key: string]: string } = {
  1: `console.log("Hello, World!");`,
  2: `function add(a, b) { return a + b; }`
  // Add other solutions as needed
};

const CodeBlockPage = () => {
  const codeBlockId = window.location.pathname.split('/').pop(); // Extract the code block ID from the URL
  const [code, setCode] = useState(''); // Code editor content
  const [role, setRole] = useState<'mentor' | 'student' | null>(null); // User role
  const [studentCount, setStudentCount] = useState(0); // Number of students in the room
  const [showSmiley, setShowSmiley] = useState(false); // Show smiley face if the code is correct

  useEffect(() => {
    if (codeBlockId) {
      // Join the code block room
      socket.emit('join-code-block', codeBlockId);

      // Handle role assignment
      socket.on('role', assignedRole => {
        setRole(assignedRole);
      });

      // Listen for real-time code updates
      socket.on('update-code', updatedCode => {
        setCode(updatedCode);
      });

      // Listen for student count updates
      socket.on('student-count', count => {
        setStudentCount(count);
      });

      // Handle mentor disconnection (redirect students)
      socket.on('mentor-disconnected', () => {
        alert('The mentor has left the session. Redirecting to the lobby...');
        window.location.href = '/';
      });

      // Cleanup listeners on component unmount
      return () => {
        socket.off('role');
        socket.off('update-code');
        socket.off('student-count');
        socket.off('mentor-disconnected');
      };
    }
  }, [codeBlockId]);

  const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = event.target.value;
    setCode(newCode);

    // Send the updated code to the server
    socket.emit('code-change', { codeBlockId, newCode });

    // Check if the code matches the solution (ignoring comments)
    const cleanCode = newCode.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '').trim();
    if (cleanCode === solutions[codeBlockId || '']) {
      setShowSmiley(true);
    } else {
      setShowSmiley(false);
    }
  };

  return (
    <div>
      <h2>Code Block {codeBlockId}</h2>
      <p>Role: {role ? role : 'Assigning...'}</p>
      <p>Students in Room: {studentCount}</p>
      {showSmiley && <h1>😊</h1>}
      <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', backgroundColor: '#2d2d2d' }}>
        {role === 'mentor' ? (
          // Mentor sees the syntax-highlighted code in read-only mode
          <SyntaxHighlighter language="javascript" style={materialDark}>
            {code || '// No code yet'}
          </SyntaxHighlighter>
        ) : role === 'student' ? (
          // Student sees a syntax-highlighted, editable code editor
          <textarea
            value={code}
            onChange={handleCodeChange}
            placeholder="Start typing your code here..."
            style={{
              width: '100%',
              height: '200px',
              fontSize: '16px',
              fontFamily: 'monospace',
              color: 'white',
              backgroundColor: '#2d2d2d',
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '10px',
              resize: 'none',
              outline: 'none'
            }}
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <p>
        <a href="/">Back to Home</a>
      </p>
    </div>
  );
};

export default CodeBlockPage;
