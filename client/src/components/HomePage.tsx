import React from 'react';

const HomePage = () => {
  const codeBlocks = [
    { id: 1, name: 'Async Case' },
    { id: 2, name: 'Add Two Numbers' },
    { id: 3, name: 'Find Factorial' },
    { id: 4, name: 'Reverse String' }
  ];

  return (
    <div>
      <h1>Choose Code Block</h1>
      <ul>
        {codeBlocks.map(block => (
          <li key={block.id}>
            <a href={`/code-block/${block.id}`}>{block.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
