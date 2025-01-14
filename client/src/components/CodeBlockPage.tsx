import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000'); // Connect to WebSocket server

const CodeBlockPage = () => {
  const navigate = useNavigate();
  const codeBlockId = window.location.pathname.split('/').pop(); // Extract `id` from URL
  const [code, setCode] = useState('');
  const [role, setRole] = useState<'mentor' | 'student' | null>(null); // Role of the user
  const [solutionMatched, setSolutionMatched] = useState(false); // Solution match state

  useEffect(() => {
    if (codeBlockId) {
      console.log(`Joining code block ${codeBlockId}`); // Debug log
      socket.emit('join-code-block', codeBlockId);

      // Handle role assignment
      socket.on('role', assignedRole => {
        console.log(`Assigned role: ${assignedRole}`);
        setRole(assignedRole);
      });

      // Listen for real-time updates
      socket.on('update-code', updatedCode => {
        console.log(`Received updated code for block ${codeBlockId}:`, updatedCode);
        setCode(updatedCode);
      });

      // Handle solution matching
      socket.on('solution-matched', () => {
        console.log('Solution matched!');
        setSolutionMatched(true); // Show the smiley face
      });

      socket.on('solution-not-matched', () => {
        setSolutionMatched(false); // Hide the smiley face
      });

      // Handle mentor disconnection
      socket.on('mentor-disconnected', () => {
        console.log('Mentor disconnected. Redirecting to home...');
        alert('The mentor has disconnected. Redirecting to the home page.');
        navigate('/'); // Redirect to the home page
      });

      return () => {
        socket.off('role');
        socket.off('update-code');
        socket.off('solution-matched');
        socket.off('solution-not-matched');
        socket.off('mentor-disconnected');
      };
    } else {
      console.error('codeBlockId is undefined! Ensure the route is set up correctly.');
    }
  }, [codeBlockId, navigate]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (role === 'mentor') {
      alert('Mentors cannot modify the code.'); // Prevent mentors from editing
      return;
    }

    const newCode = e.target.value;
    setCode(newCode);
    console.log(`Sending code change for block ${codeBlockId}:`, newCode); // Debug log
    socket.emit('code-change', { codeBlockId, newCode });
  };

  return (
    <div>
      <h2>Code Block {codeBlockId}</h2>
      {role && <h4>Role: {role}</h4>}
      <textarea
        value={code}
        onChange={handleCodeChange}
        placeholder="Start typing your code here..."
        rows={10}
        cols={50}
        disabled={role === 'mentor'} // Disable editing for mentors
      />
      {solutionMatched && <div style={{ fontSize: '3em', color: 'green' }}>😊</div>}
      <p>
        <a href="/">Back to Home</a>
      </p>
    </div>
  );
};

export default CodeBlockPage;
