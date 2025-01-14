import * as React from 'react';

const HomePage = () => {
  const codeBlocks = [
    { id: 1, name: 'Async Case' },
    { id: 2, name: 'Closure Example' },
    { id: 3, name: 'Array Manipulation' },
    { id: 4, name: 'Factorial Function' }
  ];

  return (
    <div>
      <h2>Choose Code Block</h2>
      <ul>
        {codeBlocks.map(block => (
          <li key={block.id}>
            <a href={`/code-block/${block.id}`}>{block.name}</a>
          </li>
        ))}
      </ul>
      <p>
        <a href="/saved-recipes">Go to my saved recipes</a>
      </p>
    </div>
  );
};

export default HomePage;
