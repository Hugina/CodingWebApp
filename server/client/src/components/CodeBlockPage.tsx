import * as React from 'react';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CodeMirror from '@uiw/react-codemirror'; // Import CodeMirror
import { javascript } from '@codemirror/lang-javascript'; // Language support for JavaScript

const socket = io('http://localhost:4000'); // Ensure this matches your server URL

const CodeBlockPage = () => {
  const codeBlockId = window.location.pathname.split('/').pop(); // Extract block ID from URL
  const [role, setRole] = useState('');
  const [code, setCode] = useState('');
  const [studentsInRoom, setStudentsInRoom] = useState(0);
  const [solution, setSolution] = useState('');

  useEffect(() => {
    if (!codeBlockId) {
      console.error('codeBlockId is undefined! Ensure the route is set up correctly.');
      return;
    }

    socket.emit('join-code-block', codeBlockId);

    socket.on('role', assignedRole => {
      setRole(assignedRole);
    });

    socket.on('update-code', updatedCode => {
      setCode(updatedCode);
    });

    socket.on('student-count', count => {
      setStudentsInRoom(count);
    });

    socket.on('mentor-disconnected', () => {
      alert('Mentor left the room. Redirecting to lobby...');
      window.location.href = '/';
    });

    // Set the solution for the current code block
    if (codeBlockId === '1') {
      setSolution('console.log("Hello, World!");');
    } else if (codeBlockId === '2') {
      setSolution('function add(a, b) {\n  return a + b;\n}');
    } else if (codeBlockId === '3') {
      setSolution('[1, 2, 3].map(x => x * 2);');
    } else if (codeBlockId === '4') {
      setSolution('const factorial = n => (n <= 1 ? 1 : n * factorial(n - 1));');
    }

    return () => {
      socket.disconnect();
    };
  }, [codeBlockId]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    socket.emit('code-change', { codeBlockId, newCode });
  };

  const isCorrectSolution = (currentCode: string) => {
    // Normalize and compare the code
    const normalize = (str: string) => str.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '').trim();
    return normalize(currentCode) === normalize(solution);
  };

  return (
    <div>
      <h2>Code Block {codeBlockId}</h2>
      <p>Role: {role}</p>
      <p>Students in Room: {studentsInRoom}</p>

      {role === 'mentor' ? (
        <SyntaxHighlighter language="javascript" style={materialDark}>
          {code}
        </SyntaxHighlighter>
      ) : (
        <>
          <CodeMirror
            value={code}
            height="200px"
            extensions={[javascript()]}
            onChange={value => handleCodeChange(value)}
          />
          {isCorrectSolution(code) && <p style={{ fontSize: '2em', color: 'green' }}>😊 Correct Solution!</p>}
        </>
      )}

      <p>
        <a href="/">Back to Home</a>
      </p>
    </div>
  );
};

export default CodeBlockPage;
