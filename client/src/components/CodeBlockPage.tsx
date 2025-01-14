import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000'); // Connect to WebSocket server

const CodeBlockPage = () => {
  const { id: codeBlockId } = useParams<{ id: string }>(); // Extract codeBlockId from route
  const [code, setCode] = useState('');

  // Simulated code block templates (in a real app, fetch this from the backend)
  const codeBlockTemplates: { [key: string]: string } = {
    '1': 'async function fetchData(url) {\n  // Your code here\n}',
    '2': 'function createClosure(x) {\n  // Your code here\n}',
    '3': 'function filterArray(arr) {\n  // Your code here\n}',
    '4': 'function factorial(n) {\n  // Your code here\n}'
  };

  useEffect(() => {
    if (codeBlockId && codeBlockTemplates[codeBlockId]) {
      setCode(codeBlockTemplates[codeBlockId]); // Load initial code from template
    }

    if (codeBlockId) {
      // Join the code block room
      socket.emit('join-code-block', codeBlockId);

      // Listen for real-time code updates
      socket.on('update-code', updatedCode => {
        setCode(updatedCode);
      });

      // Cleanup on component unmount
      return () => {
        socket.off('update-code');
      };
    }
  }, [codeBlockId]);

  const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = event.target.value;
    setCode(newCode);

    // Send the updated code to the server
    socket.emit('code-change', { codeBlockId, newCode });
  };

  return (
    <div>
      <h2>Code Block {codeBlockId}</h2>
      <textarea value={code} onChange={handleCodeChange} placeholder="Start typing your code here..." />
      <p>
        <a href="/">Back to Home</a>
      </p>
    </div>
  );
};

export default CodeBlockPage;
