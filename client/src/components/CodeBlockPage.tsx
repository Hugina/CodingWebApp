import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000'); // Connect to WebSocket server

const CodeBlockPage = () => {
  const codeBlockId = window.location.pathname.split('/').pop(); // Extract `id` from URL
  const [code, setCode] = useState('');

  useEffect(() => {
    if (codeBlockId) {
      console.log(`Joining code block ${codeBlockId}`); // Debug log
      socket.emit('join-code-block', codeBlockId);

      // Listen for real-time updates
      socket.on('update-code', updatedCode => {
        console.log(`Received updated code for block ${codeBlockId}:`, updatedCode);
        setCode(updatedCode);
      });

      return () => {
        socket.off('update-code'); // Cleanup on unmount
      };
    } else {
      console.error('codeBlockId is undefined! Ensure the route is set up correctly.');
    }
  }, [codeBlockId]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    console.log(`Sending code change for block ${codeBlockId}:`, newCode); // Debug log
    socket.emit('code-change', { codeBlockId, newCode });
  };

  return (
    <div>
      <h2>Code Block {codeBlockId}</h2>
      <textarea
        value={code}
        onChange={handleCodeChange}
        placeholder="Start typing your code here..."
        rows={10}
        cols={50}
      />
      <p>
        <a href="/">Back to Home</a>
      </p>
    </div>
  );
};

export default CodeBlockPage;
