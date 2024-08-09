import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { FaGithub, FaLinkedin } from "react-icons/fa"; // Import icons

const MAX_SIZE = 6; // Maximum board size

function Square({ value, onSquareClick }) {
  return (
    <button
      className="square btn btn-light p-2 m-1"
      onClick={onSquareClick}
      style={{ width: "60px", height: "60px" }}
    >
      {value}
    </button>
  );
}

function Board({ size, squares, onSquareClick }) {
  const rows = [];
  for (let row = 0; row < size; row++) {
    const cols = [];
    for (let col = 0; col < size; col++) {
      const index = row * size + col;
      cols.push(
        <Square
          key={index}
          value={squares[index]}
          onSquareClick={() => onSquareClick(index)}
        />
      );
    }
    rows.push(
      <div key={row} className="board-row d-flex justify-content-center">
        {cols}
      </div>
    );
  }

  return <>{rows}</>;
}

function App() {
  const initialSize = 3;
  const [size, setSize] = useState(initialSize);
  const [squares, setSquares] = useState(
    Array(initialSize * initialSize).fill(null)
  );
  const [xIsNext, setXIsNext] = useState(true);
  const [expanding, setExpanding] = useState(false);
  const [message, setMessage] = useState(""); // New state for messages

  const isBoardFull = (squares) => squares.every((square) => square !== null);

  function handlePlay(i) {
    if (squares[i] || expanding) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);

    const winner = calculateWinner(nextSquares, size);
    if (winner) {
      return;
    }

    if (isBoardFull(nextSquares)) {
      if (size < MAX_SIZE) {
        setExpanding(true);
      } else {
        setMessage("Maximum board size reached!");
      }
    } else {
      setXIsNext(!xIsNext);
    }
  }

  const expandBoard = useCallback(() => {
    if (expanding && size < MAX_SIZE) {
      const newSize = size + 1;
      const newSquares = Array(newSize * newSize).fill(null);

      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          newSquares[row * newSize + col] = squares[row * size + col];
        }
      }

      setSize(newSize);
      setSquares(newSquares);
      setXIsNext(!xIsNext);
      setExpanding(false);
      setMessage(""); // Clear the message when expanding
    }
  }, [expanding, size, squares, xIsNext]);

  function resetGame() {
    setSize(initialSize);
    setSquares(Array(initialSize * initialSize).fill(null));
    setXIsNext(true);
    setExpanding(false);
    setMessage(""); // Clear the message on reset
  }

  useEffect(() => {
    if (expanding) {
      expandBoard();
    }
  }, [expanding, expandBoard]);

  const winner = calculateWinner(squares, size);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <header className="transparent-header">
        <h1 className="h4 custom-header">Play Until You Win</h1>
      </header>

      <div className="game container text-center">
        <div className="status alert alert-info">{status}</div>
        {message && <div className="alert alert-danger">{message}</div>}{" "}
        {/* Display message */}
        <div className="game-board">
          <Board size={size} squares={squares} onSquareClick={handlePlay} />
        </div>
        <div className="game-info mt-3">
          <button className="start-button btn btn-primary" onClick={resetGame}>
            Start New Game
          </button>
        </div>
      </div>
      <footer className="game-footer fs-5">
        <p>Developed by Syed Muhammad Abbas</p>
        <a
          href="https://github.com/SyedAbbas6319"
          target="_blank"
          rel="noopener noreferrer"
          className="text-decoration-none text-dark fs-7"
        >
          <FaGithub /> GitHub
        </a>{" "}
        |
        <a
          href="https://www.linkedin.com/in/syed-muhammad-abbas-7a1201215"
          target="_blank"
          rel="noopener noreferrer"
          className="text-decoration-none  fs-7"
        >
          <FaLinkedin /> LinkedIn
        </a>
      </footer>
    </>
  );
}

function calculateWinner(squares, size) {
  const lines = [];
  for (let i = 0; i < size; i++) {
    lines.push(Array.from({ length: size }, (_, j) => i * size + j));
    lines.push(Array.from({ length: size }, (_, j) => j * size + i));
  }
  lines.push(Array.from({ length: size }, (_, i) => i * size + i));
  lines.push(Array.from({ length: size }, (_, i) => (size - 1 - i) * size + i));

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const [a] = line;
    if (squares[a] && line.every((index) => squares[index] === squares[a])) {
      return squares[a];
    }
  }
  return null;
}

export default App;
