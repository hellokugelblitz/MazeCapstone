import { useEffect, useRef, useState } from 'react';

const Canvas = () => {
  const canvasRef = useRef(null);
  const [algorithm, setAlgorithm] = useState('default'); // Default blank box...
  const [grid, setGrid] = useState([]);

  // a global function, used to remove a wall inside of a maze.
  const removeWall = (grid, row1, col1, row2, col2) => {
    if (
      row1 < 0 || row1 >= grid.length ||
      row2 < 0 || row2 >= grid.length ||
      col1 < 0 || col1 >= grid[0].length ||
      col2 < 0 || col2 >= grid[0].length
    ) {
      console.error("Invalid indices in removeWall", { row1, col1, row2, col2 });
      return;
    }

    const cell1 = grid[row1][col1];
    const cell2 = grid[row2][col2];

    if (row1 === row2) {
      if (col1 < col2) {
        cell1.walls.right = false;
        cell2.walls.left = false;
      } else {
        cell1.walls.left = false;
        cell2.walls.right = false;
      }
    } else if (col1 === col2) {
      if (row1 < row2) {
        cell1.walls.bottom = false;
        cell2.walls.top = false;
      } else {
        cell1.walls.top = false;
        cell2.walls.bottom = false;
      }
    }
  };

  // returns a list of the neighbors of a given cell...
  const getNeighbors = (grid, row, col) => {
    const neighbors = [];
    const rows = grid.length;
    const cols = grid[0].length;

    if (row > 0) neighbors.push({ row: row - 1, col });
    if (col < cols - 1) neighbors.push({ row, col: col + 1 });
    if (row < rows - 1) neighbors.push({ row: row + 1, col });
    if (col > 0) neighbors.push({ row, col: col - 1 });

    return neighbors;
  };

  // simple implementation of a recursive backtracking maze genorator.
  const recursiveBacktracking = (context, width, height, cellSize) => {

    // Grab the rows and the columns
    const rows = Math.floor(height / cellSize);
    const cols = Math.floor(width / cellSize);

    // initial grid
    const initialGrid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({
        visited: false,
        walls: { top: true, right: true, bottom: true, left: true },
      }))
    );
    setGrid(initialGrid); // the grid is existing in a stateful way so we can update it as such

    // we start with the first cell
    let current = { row: 0, col: 0 };
    const stack = [];

    // 
    const drawGrid = (grid) => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = 'black';
      context.fillRect(0, 0, width, height);

      context.strokeStyle = 'white';
      context.lineWidth = 2;

      grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const x = colIndex * cellSize;
          const y = rowIndex * cellSize;

          if (cell.walls.top) {
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x + cellSize, y);
            context.stroke();
          }
          if (cell.walls.right) {
            context.beginPath();
            context.moveTo(x + cellSize, y);
            context.lineTo(x + cellSize, y + cellSize);
            context.stroke();
          }
          if (cell.walls.bottom) {
            context.beginPath();
            context.moveTo(x, y + cellSize);
            context.lineTo(x + cellSize, y + cellSize);
            context.stroke();
          }
          if (cell.walls.left) {
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x, y + cellSize);
            context.stroke();
          }
        });
      });
    };

    const step = () => {
      initialGrid[current.row][current.col].visited = true;

      const neighbors = getNeighbors(initialGrid, current.row, current.col).filter(
        (neighbor) => !initialGrid[neighbor.row][neighbor.col].visited
      );

      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        removeWall(initialGrid, current.row, current.col, next.row, next.col);
        stack.push(current);
        current = next;
      } else if (stack.length > 0) {
        current = stack.pop();
      }

      drawGrid(initialGrid);
      if (stack.length > 0) {
        requestAnimationFrame(step);
      }
    };

    step();
  };

  // Placeholder for additional algorithms
  const primAlgorithm = (context, width, height, cellSize) => {

    // start by creating a grid where each cell is initially unvisited.
    // start with a single cell, mark it as part of the maze, and add its walls to a wall list
    // while there are walls in the wall list
      // randomly select a wall from the list
      // if the cell on the opposite side of the wall has not been visited
        // mark it as part of the maze
        // remove the wall
        // the walls of the new cell to the wall list
      // if both sides of the wall are already part of the maze
        // ignore it.


    const cols = Math.floor(width / cellSize);
    const rows = Math.floor(height / cellSize);
  
    // init for grid
    const grid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({
        visited: false,
        walls: { top: true, right: true, bottom: true, left: true },
      }))
    );
  
    const walls = [];
  
    // random starting cells
    const startRow = Math.floor(Math.random() * rows);
    const startCol = Math.floor(Math.random() * cols);
  
    // Mark the starting cell as visited and add its walls to the wall list
    grid[startRow][startCol].visited = true;
    walls.push(
      ...getNeighbors(grid, startRow, startCol).map((neighbor) => ({
        from: { row: startRow, col: startCol },
        to: neighbor,
      }))
    );
    
    // duplicate code, trying to get rid of this stuff.
    const drawGrid = () => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = 'black';
      context.fillRect(0, 0, width, height);
  
      context.strokeStyle = 'white';
      context.lineWidth = 2;
  
      grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const x = colIndex * cellSize;
          const y = rowIndex * cellSize;
  
          if (cell.walls.top) {
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x + cellSize, y);
            context.stroke();
          }
          if (cell.walls.right) {
            context.beginPath();
            context.moveTo(x + cellSize, y);
            context.lineTo(x + cellSize, y + cellSize);
            context.stroke();
          }
          if (cell.walls.bottom) {
            context.beginPath();
            context.moveTo(x, y + cellSize);
            context.lineTo(x + cellSize, y + cellSize);
            context.stroke();
          }
          if (cell.walls.left) {
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x, y + cellSize);
            context.stroke();
          }
        });
      });
    };
  
    const step = () => {
      if (walls.length === 0) {
        drawGrid();
        return;
      }
  
      // random wall
      const randomIndex = Math.floor(Math.random() * walls.length);
      const { from, to } = walls.splice(randomIndex, 1)[0];
  
      // if the cell on the opposite side is unvisited
      if (!grid[to.row][to.col].visited) {
        // Remove the wall and mark the cell as visited!
        removeWall(grid, from.row, from.col, to.row, to.col);
        grid[to.row][to.col].visited = true;
  
        // Add the neighboring walls of the newly visited cell
        walls.push(
          ...getNeighbors(grid, to.row, to.col).map((neighbor) => ({
            from: { row: to.row, col: to.col },
            to: neighbor,
          }))
        );
      }
  
      drawGrid();
      requestAnimationFrame(step);
    };
  
    step();
  };

  const kruskalAlgorithm = (context, width, height, cellSize) => {

    // create a grid where each cell is a seperate set
    // create a list of all walls in the grid
    // randomly shuffle these walls

    // While there are walls in the list
      // remove a wall from the list
      // if the cells seperated by the wall are in different sets
      // merge the sets of the two cells

    const cols = Math.floor(width / cellSize);
    const rows = Math.floor(height / cellSize);
  
    // Initialize the grid
    const grid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({
        walls: { top: true, right: true, bottom: true, left: true },
      }))
    );
  
    const edges = [];
    const sets = [];
  
    // utility function
    const findSet = (cell) => {
      for (const set of sets) {
        if (set.has(cell)) return set;
      }
      return null;
    };
    
    // merges sets
    const unionSets = (setA, setB) => {
      setA.forEach((cell) => setB.add(cell));
      sets.splice(sets.indexOf(setA), 1);
    };
  
    // creates all the edges between sets
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cellIndex = row * cols + col;
        sets.push(new Set([cellIndex]));
  
        // horizontal edge (right neighbor)
        if (col < cols - 1) {
          edges.push({
            from: cellIndex,
            to: cellIndex + 1,
            direction: "right",
          });
        }
  
        // vertical edge (bottom neighbor)
        if (row < rows - 1) {
          edges.push({
            from: cellIndex,
            to: cellIndex + cols,
            direction: "bottom",
          });
        }
      }
    }
  
    // Shuffle for randomization
    for (let i = edges.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [edges[i], edges[j]] = [edges[j], edges[i]];
    }
  
    // maze gen logic
    const drawGrid = () => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = 'black';
      context.fillRect(0, 0, width, height);
  
      context.strokeStyle = 'white';
      context.lineWidth = 2;
  
      grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const x = colIndex * cellSize;
          const y = rowIndex * cellSize;
  
          if (cell.walls.top) {
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x + cellSize, y);
            context.stroke();
          }
          if (cell.walls.right) {
            context.beginPath();
            context.moveTo(x + cellSize, y);
            context.lineTo(x + cellSize, y + cellSize);
            context.stroke();
          }
          if (cell.walls.bottom) {
            context.beginPath();
            context.moveTo(x, y + cellSize);
            context.lineTo(x + cellSize, y + cellSize);
            context.stroke();
          }
          if (cell.walls.left) {
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x, y + cellSize);
            context.stroke();
          }
        });
      });
    };
  
    const removeWall = (from, to, direction) => {
      const fromRow = Math.floor(from / cols);
      const fromCol = from % cols;
      const toRow = Math.floor(to / cols);
      const toCol = to % cols;
  
      if (direction === "right") {
        grid[fromRow][fromCol].walls.right = false;
        grid[toRow][toCol].walls.left = false;
      } else if (direction === "bottom") {
        grid[fromRow][fromCol].walls.bottom = false;
        grid[toRow][toCol].walls.top = false;
      }
    };
  
    const step = () => {
      if (edges.length === 0) {
        drawGrid();
        return;
      }
  
      const edge = edges.pop();
      const setA = findSet(edge.from);
      const setB = findSet(edge.to);
  
      // if they are in different sets connect them
      if (setA !== setB) {
        removeWall(edge.from, edge.to, edge.direction);
        unionSets(setA, setB);
      }
      
      // every frame we are redrawing the grid.
      drawGrid();
      requestAnimationFrame(step); // animate this thing
    };
  
    step();
  };
  
  // TODO: implement ellers...
  const ellerAlgorithm = (context, width, height, cellSize) => {

    // initialize the first row of the grid, assigning each cell to a unique set
    // For each row
      // vertical connection
        // for each cell
          // randomly decided wether to connect it to the next cell in the same row
          // if connected merge their sets
      // Horizontal connection
        // for each set
          // Ensure that at least one cell in the set connects to the row below
          // randomly select one or more cells in the set to connect vertically to new cells in the next row
      // Create a new row, enheriting sets from vertical connections

    // For the last row
      // Merge any remaining disjointed sets by removing horizontal walls.
      
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.fillStyle = 'white';
    context.fillText("Eller's Algorithm Coming Soon!", width / 4, height / 2);
  };

  // Draws an empty board
  const defaultBoard = (context, width, height, cellSize) => {
    const cols = Math.floor(width / cellSize);
    const rows = Math.floor(height / cellSize);

    const drawGrid = () => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = 'black';
      context.fillRect(0, 0, width, height);
      context.strokeStyle = 'white';
      context.lineWidth = 2;
  
      grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const x = colIndex * cellSize;
          const y = rowIndex * cellSize;
  
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(x + cellSize, y);
          context.stroke();

          context.beginPath();
          context.moveTo(x + cellSize, y);
          context.lineTo(x + cellSize, y + cellSize);
          context.stroke();

          context.beginPath();
          context.moveTo(x, y + cellSize);
          context.lineTo(x + cellSize, y + cellSize);
          context.stroke();

          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(x, y + cellSize);
          context.stroke();
        });
      });
    };

    drawGrid();
  };

  const drawMaze = (context, width, height, cellSize) => {
    switch (algorithm) {
      case 'default':
        defaultBoard(context, width, height, cellSize);
        break;
      case 'Recursive Backtracking':
        recursiveBacktracking(context, width, height, cellSize);
        break;
      case 'Prim’s Algorithm':
        primAlgorithm(context, width, height, cellSize);
        break;
      case 'Kruskal’s Algorithm':
        kruskalAlgorithm(context, width, height, cellSize);
        break;
      case 'Eller’s Algorithm':
        ellerAlgorithm(context, width, height, cellSize);
        break;
      default:
        console.error("Unknown algorithm");
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const cellSize = 20;

    drawMaze(context, canvas.width, canvas.height, cellSize);
  }, [algorithm]);

  return (
    <div>
      <canvas ref={canvasRef} width={500} height={500} />
      <div className="buttons">
        <button onClick={() => setAlgorithm('Recursive Backtracking')}>Recursive Backtracking</button>
        <button onClick={() => setAlgorithm('Prim’s Algorithm')}>Prim’s Algorithm</button>
        <button onClick={() => setAlgorithm('Kruskal’s Algorithm')}>Kruskal’s Algorithm</button>
        <button onClick={() => setAlgorithm('Eller’s Algorithm')}>Eller’s Algorithm</button>
      </div>
    </div>
  );
};

export default Canvas;
