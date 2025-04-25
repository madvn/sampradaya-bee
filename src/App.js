// App.js - Web Version
import React, { useState, useEffect } from 'react';
import './App.css';

// Sample CSV data - first column is the 9 letters, other columns are valid words
const GAME_DATA = [
  ['abcdefghi', 'ace', 'bad', 'cab', 'dab', 'each', 'face', 'fade', 'fad', 'gab', 'had', 'ice', 'bid'],
  ['rstuvwxyz', 'rust', 'trust', 'try', 'wry', 'very', 'sure', 'vest', 'rest', 'test', 'zest', 'vex'],
  ['nopqrstuv', 'not', 'pot', 'top', 'stop', 'spot', 'post', 'pour', 'our', 'out', 'quit', 'sort'],
  ['cfilorsuv', 'for', 'four', 'fill', 'oil', 'soil', 'coil', 'solid', 'circus', 'focus', 'sir', 'us'],
  ['aeilmnrst', 'meals', 'steam', 'teams', 'mines', 'smile', 'leans', 'stain', 'train', 'trail', 'enter']
];

function App() {
  const [currentGame, setCurrentGame] = useState(null);
  const [currentGameIndex, setCurrentGameIndex] = useState(null);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [foundWords, setFoundWords] = useState([]);
  const [feedback, setFeedback] = useState(null);
  
  useEffect(() => {
    startNewGame();
  }, []);
  
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setFeedback(null);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [feedback]);
  
  const startNewGame = () => {
    // Randomly select a game from the data
    const randomIndex = Math.floor(Math.random() * GAME_DATA.length);
    setCurrentGameIndex(randomIndex);
    const game = GAME_DATA[randomIndex];
    setCurrentGame(game);
    setSelectedLetters([]);
    setCurrentWord('');
    setFoundWords([]);
    setFeedback(null);
  };
  
  const handleLetterPress = (letter, index) => {
    setSelectedLetters([...selectedLetters, { letter, index }]);
    setCurrentWord(currentWord + letter);
  };
  
  const handleDelete = () => {
    if (selectedLetters.length > 0) {
      const newSelected = [...selectedLetters];
      newSelected.pop();
      setSelectedLetters(newSelected);
      setCurrentWord(currentWord.slice(0, -1));
    }
  };
  
  const handleSubmit = () => {
    if (currentWord.length === 0) return;
    
    // Check if the word is valid (in the game data) and not already found
    const isValid = currentGame.slice(1).includes(currentWord.toLowerCase());
    const isAlreadyFound = foundWords.includes(currentWord.toLowerCase());
    
    if (isValid && !isAlreadyFound) {
      // Word is valid and not already found
      setFoundWords([...foundWords, currentWord.toLowerCase()]);
      setFeedback('success');
    } else {
      if (!isAlreadyFound){
      // Word is invalid 
      setFeedback('failure');
      } else {
        // Word was already found
        setFeedback('found')
      }
    }
    
    // Reset current word
    setSelectedLetters([]);
    setCurrentWord('');
  };
  
  const renderGrid = () => {
    if (!currentGame) return null;
    
    const letters = currentGame[0].split('');
    
    return (
      <div className="grid">
        {letters.map((letter, index) => (
          <button
            key={index}
            className={`cell ${selectedLetters.some(item => item.index === index) ? 'selected-cell' : ''}`}
            onClick={() => handleLetterPress(letter, index)}
          >
            {letter.toUpperCase()}
          </button>
        ))}
      </div>
    );
  };
  
  const renderProgressBar = () => {
    if (!currentGame) return null;
    
    const totalPossibleWords = currentGame.length - 1;
    const wordsFound = foundWords.length;
    const progress = (wordsFound / totalPossibleWords) * 100;
    
    return (
      <div className="progress-container">
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="progress-text">
          {wordsFound} / {totalPossibleWords} words found
        </div>
      </div>
    );
  };
  
  const renderFeedback = () => {
    if (!feedback) return null;

    if (feedback == 'success') {
      return (
        <div className={`feedback-container ${feedback}`}>
          <div className="success-feedback">✓</div>
        </div>
      )
    };
    
    if (feedback == 'failure') {
      return (
        <div className={`feedback-container ${feedback}`}>
          <div className="failure-feedback">✗</div>
        </div>
      )
    };

    if (feedback == 'found') {
      return (
        <div className={`feedback-container ${feedback}`}>
          <div className="found-feedback">Already\nFound!</div>
        </div>
      )
    };

  };
  
  return (
    <div className="app">
      <h1 className="title">Word Finder</h1>
      
      <button className="new-game-button" onClick={startNewGame}>
        New Game
      </button>
      
      {renderProgressBar()}
      
      {renderGrid()}
      
      <div className="word-container">
        <div className="word-text">{currentWord.toUpperCase()}</div>
      </div>
      
      <div className="buttons-container">
        <button className="button delete-button" onClick={handleDelete}>
          Delete
        </button>
        
        <button className="button submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
      
      {renderFeedback()}
      
      <div className="found-words-container">
        <h2 className="found-words-title">Found Words:</h2>
        <div className="found-words-list">
          {foundWords.map((word, index) => (
            <div key={index} className="found-word">
              {word}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;