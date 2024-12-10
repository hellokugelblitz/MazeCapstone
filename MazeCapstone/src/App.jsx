import { useState } from 'react';
import viteLogo from '/vite.svg';
import Canvas from './Canvas/Canvas';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Maze of Life Prototyping</h1>
      <Canvas />
    </>
  );
}

export default App;
