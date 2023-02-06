import React, { useEffect, useState } from "react";
import { bfs } from "../algos/bfs";
import "./pathfinder.css";
import Node from "./Node/Node";
import { dfs } from "../algos/dfs";
import { aStar } from "../algos/astar";
import { dijkstra } from "../algos/dijkstra";
export default function Pathfinder() {
  const [grid, setGrid] = useState([]);
  const [startNodeRow, setStartNodeRow] = useState(5);
  const [finishNodeRow, setFinishNodeRow] = useState(5);
  const [startNodeCol, setStartNodeCol] = useState(5);
  const [finishNodeCol, setFinishNodeCol] = useState(15);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [rowCount, setRowCount] = useState(25);
  const [colCount, setColCount] = useState(35);
  const [mobileRowCount, setMobileRowCount] = useState(10);
  const [mobileColCount, setMobileColCount] = useState(20);
  var isRunning=false;
  const [isStartNode, setIsStartNode] = useState(false);
  const [isFinishNode, setIsFinishNode] = useState(false);
  const [isWallNode, setIsWallNode] = useState(false);
  const [currRow, setCurrRow] = useState(0);
  const [currCol, setCurrCol] = useState(0);
  const [isDeskTopView, setIsDeskTopView] = useState(true);
  useEffect(() => {
    const grid = getInitialGrid();
    setGrid(grid);
  }, []);
  function handleMouseDown(row, col) {
    if (!isRunning) {
      if (isGridClear()) {
        if (
          document.getElementById(`node-${row}-${col}`).className ===
          "node node-start"
        ) {
          setMouseIsPressed(true);
          setIsStartNode(true);
          setCurrRow(row);
          setCurrCol(col);
        } else if (
          document.getElementById(`node-${row}-${col}`).className ===
          "node node-finish"
        ) {
          setMouseIsPressed(true);
          setIsFinishNode(true);
          setCurrRow(row);
          setCurrCol(col);
        } else {
          const newGrid = getNewGridWithWallToggled(grid, row, col);
          setGrid(newGrid);
          setMouseIsPressed(true);
          setIsWallNode(true);
          setCurrRow(row);
          setCurrCol(col);
        }
      }
    } else {
      clearGrid();
    }
  }
  function isGridClear() {
    for (const row of grid) {
      for (const node of row) {
        const nodeClassName = document.getElementById(
          `node-${node.row}-${node.col}`
        ).className;
        if (
          nodeClassName === "node node-visited" ||
          nodeClassName === "node node-shortest-path"
        ) {
          return false;
        }
      }
    }
    return true;
  }
  function handleMouseEnter(row, col) {
    if (!isRunning) {
      if (mouseIsPressed) {
        const nodeClassName = document.getElementById(
          `node-${row}-${col}`
        ).className;
        if (isStartNode) {
          if (nodeClassName !== "node node-wall") {
            const prevStartNode = grid[currRow][currCol];
            prevStartNode.isStart = false;
            document.getElementById(`node-${currRow}-${currCol}`).className =
              "node";
            setCurrRow(row);
            setCurrCol(col);
            const currStartNode = grid[row][col];
            currStartNode.isStart = true;
            document.getElementById(`node-${row}-${col}`).className =
              "node node-start";
          }
          setStartNodeRow(row);
          setStartNodeCol(col);
        } else if (isFinishNode) {
          if (nodeClassName !== "node node-wall") {
            const prevFinishNode = grid[currRow][currCol];
            prevFinishNode.isFinish = false;
            document.getElementById(`node-${currRow}-${currCol}`).className =
              "node";
            setCurrRow(row);
            setCurrCol(col);
            const currFinishNode = grid[row][col];
            currFinishNode.isFinish = true;
            document.getElementById(`node-${row}-${col}`).className =
              "node node-finish";
          }
          setFinishNodeRow(row);
          setFinishNodeCol(col);
        } else if (isWallNode) {
          const newGrid = getNewGridWithWallToggled(grid, row, col);
          setGrid(newGrid);
        }
      }
    }
  }
  function handleMouseUp(row, col) {
    if (!isRunning) {
      setMouseIsPressed(false);
      if (isStartNode) {
        setIsStartNode(!isStartNode);
        //setStartNodeRow(row);
        // setStartNodeCol(col);
      } else if (isFinishNode) {
        setIsFinishNode(!isFinishNode);
        //setFinishNodeCol(col);
        //setFinishNodeRow(row);
      }
      //getInitialGrid();
    }
  }
  function handleMouseLeave() {
    if (isStartNode) {
      setIsStartNode(false);
      setMouseIsPressed(false);
    } else if (isFinishNode) {
      setIsFinishNode(false);
      setMouseIsPressed(false);
    } else if (isWallNode) {
      setIsWallNode(false);
      setMouseIsPressed(false);
      getInitialGrid();
    }
  }
  function clearGrid() {
    if (!isRunning) {
      const newGrid = grid.slice();
      for (const row of newGrid) {
        for (const node of row) {
          let nodeClassName = document.getElementById(
            `node-${node.row}-${node.col}`
          ).className;
          if (
            nodeClassName !== "node node-start" &&
            nodeClassName !== "node node-finish" &&
            nodeClassName !== "node node-wall"
          ) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node";
            node.isVisited = false;
            node.distance = Infinity;
            node.distanceToFinishNode =
              Math.abs(finishNodeRow - node.row) +
              Math.abs(finishNodeCol - node.col);
          }
          if (nodeClassName === "node node-finish") {
            node.isVisited = false;
            node.distance = Infinity;
            node.distanceToFinishNode = 0;
          }
          if (nodeClassName === "node node-start") {
            node.isVisited = false;
            node.distance = Infinity;
            node.distanceToFinishNode =
              Math.abs(finishNodeRow - node.row) +
              Math.abs(finishNodeCol - node.col);
            node.isStart = true;
            node.isWall = false;
            node.previousNode = null;
            node.isNode = true;
          }
        }
      }
    }
  }
  function clearWalls() {
    if (!isRunning) {
      const newGrid = grid.slice();
      for (const row of newGrid) {
        for (const node of row) {
          let nodeClassName = document.getElementById(
            `node-${node.row}-${node.col}`
          ).className;
          if (nodeClassName === "node node-wall") {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node";
            node.isWall = false;
          }
        }
      }
    }
  }
  function visualize(algo) {
    if (!isRunning) {
      clearGrid();
      isRunning=true;
      console.log(isRunning);
      const grid1 = grid;
      const startNode = grid1[startNodeRow][startNodeCol];
      const finishNode = grid1[finishNodeRow][finishNodeCol];
      let visitedNodesInOrder;
      switch (algo) {
        case 'Dijkstra':
          visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
          break;
        case 'Astar':
          visitedNodesInOrder = aStar(grid, startNode, finishNode);
          break;
        case 'BFS':
          visitedNodesInOrder = bfs(grid, startNode, finishNode);
          break;
        case 'DFS':
          visitedNodesInOrder = dfs(grid, startNode, finishNode);
          break;
        default:
          break;
      }
      console.log(visitedNodesInOrder);
      const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
      nodesInShortestPathOrder.push("end");
      animate(visitedNodesInOrder, nodesInShortestPathOrder);
      console.log(isRunning);
    }
  }
  function animate(visitedNodesInOrder, nodesInShortestPathOrder) {
    console.log(visitedNodesInOrder);
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        const nodeClassName = document.getElementById(
          `node-${node.row}-${node.col}`
        ).className;
        if (
          nodeClassName !== "node node-start" &&
          nodeClassName !== "node node-finish"
        ) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visited";
        }
      }, 10 * i);
    }
  }
  function animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
     if (nodesInShortestPathOrder[i] === "end") {
        setTimeout(() => {
          isRunning=false;
          console.log(isRunning);
        },i*50);
      } else {
        setTimeout(() => {
          const node = nodesInShortestPathOrder[i];
          const nodeClassName = document.getElementById(
            `node-${node.row}-${node.col}`
          ).className;
          if (
            nodeClassName !== "node node-start" &&
            nodeClassName !== "node node-finish"
          ) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-shortest-path";
          }
        }, i * 40);
      }
    }
  }

 
  function toggleView() {
    if (!isRunning) {
      clearGrid();
      clearWalls();
      const isDeskTop = !isDeskTopView;
      let grid;
      if (isDeskTop) {
        grid = getInitialGrid(rowCount, colCount);
        setIsDeskTopView(isDeskTop);
        setGrid(grid);
      }
     else {
      if (
        startNodeRow > mobileRowCount ||
        finishNodeRow > mobileRowCount ||
        startNodeCol > mobileColCount ||
        finishNodeCol > mobileColCount
      ) {
        alert("start & finish nodes must be within 10 rows x 20 columns");
      } else {
        grid = getInitialGrid(mobileRowCount, mobileColCount);
        setIsDeskTopView(isDeskTop);
        setGrid(grid);
      }
    }
  }
}
  const getInitialGrid = (r = rowCount, c = colCount) => {
    const initialGrid = [];
    for (let row = 0; row < r; row++) {
      const currentRow = [];
      for (let col = 0; col < c; col++) {
        currentRow.push(createNode(row, col));
      }
      initialGrid.push(currentRow);
    }
    return initialGrid;
  };
  const createNode = (row, col) => {
    return {
      row,
      col,
      isStart: row === startNodeRow && col === startNodeCol,
      isFinish: row === finishNodeRow && col === finishNodeCol,
      distance: Infinity,
      distanceToFinishNode:
        Math.abs(finishNodeRow - row) + Math.abs(finishNodeCol - col),
      isVisited: false,
      isWall: false,
      previousNode: null,
      isNode: true,
    };
  };

  return (
    <div className="main">
      <nav className="navbar navbar-exoand-lg navbar-dark bg-dark">
        <div className="Links">
          <a className="navbar-brand" href="https://trpnayak.github.io/PathFinder/">
            <b className="path-text">PathFinding Visualizer</b>
          </a>
          {" "}{" "}
          <a className="navbar-brand" href="https://github.com/trpnayak/PathFinder">
            <br/><b className="path-text">PathFinding Visualizer Code</b>
          </a>
        </div>
      </nav>
      <table className="grid-container" onMouseLeave={() => handleMouseLeave()}>
        <tbody className="grid">
          {grid.map((row, rowIndex) => {
            return (
              <tr key={rowIndex}>
                {row.map((node, nodeIndex) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      row={row}
                      key={nodeIndex}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => handleMouseDown(row, col)}
                      onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                      onMouseUp={(row,col) => handleMouseUp(row, col)}
                    ></Node>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="btnpos">
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => clearGrid()}
        >
          Clear Grid
        </button>
        <button
          type="button"
          className="btn btn-warning"
          onClick={() => clearWalls()}
        >
          Clear Walls
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => visualize('BFS')}
        >
          BFS
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => visualize('DFS')}
        >
          DFS
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => visualize('Astar')}
        >
          Astar
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => visualize('Dijkstra')}
        >
          Dijkstra
        </button>
      </div>
    </div>
  );
}
const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  if (!node.isStart && !node.isFinish && node.isNode) {
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
  }
  return newGrid;
};
function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
