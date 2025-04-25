// App.js with Dictionary-based Game Generation
import React, { useState, useEffect } from 'react';
import './App.css';

// Function to load dictionary and create game data
const createGameFromDictionary = async (dictionaryPath, minWordsRequired = 10) => {
  try {
    // Load the dictionary file
    const response = await fetch(dictionaryPath);
    const text = await response.text();
    
    // Split into words and filter out invalid ones (too long or too short)
    const dictionary = text.split('\n')
      .map(word => word.trim().toLowerCase())
      .filter(word => word.length >= 2);
    
    // Keep trying until we find a set with enough valid words
    let attempts = 0;
    let gameData = null;
    
    while (!gameData && attempts < 50) {
      attempts++;
      
      // Pick 9 random letters
      const letters = generateRandomLetters(9);
      
      // Find all valid words that can be formed with these letters
      const validWords = findValidWords(letters, dictionary);
      
      // If we have enough words, create the game data
      if (validWords.length >= minWordsRequired) {
        gameData = [letters.join(''), ...validWords];
      }
    }
    
    if (!gameData) {
      console.error('Failed to create game after multiple attempts');
      return null;
    }
    
    return [gameData]; // Return as array to match expected format
  } catch (error) {
    console.error('Error creating game from dictionary:', error);
    return null;
  }
};

// Generate random letters, ensuring at least 3 vowels
const generateRandomLetters = (count) => {
  const vowels = 'aeiou';
  const consonants = 'bcdfghjklmnpqrstvwxyz';
  
  let letters = [];
  
  // Add at least 3 vowels
  for (let i = 0; i < 3; i++) {
    letters.push(vowels.charAt(Math.floor(Math.random() * vowels.length)));
  }
  
  // Fill the rest with consonants
  for (let i = 3; i < count; i++) {
    letters.push(consonants.charAt(Math.floor(Math.random() * consonants.length)));
  }
  
  // Shuffle the letters
  return letters.sort(() => Math.random() - 0.5);
};

// Find all valid words that can be formed with the given letters
const findValidWords = (letters, dictionary) => {
  // Create frequency map of available letters
  const letterMap = {};
  letters.forEach(letter => {
    letterMap[letter] = (letterMap[letter] || 0) + 1;
  });
  
  // Check each dictionary word
  return dictionary.filter(word => {
    // Since the problem description states that letters can be reused in the same word,
    // we only need to ensure that the word uses letters from our set
    for (let i = 0; i < word.length; i++) {
      if (!letters.includes(word[i])) {
        return false;
      }
    }
    return true;
  });
};


function App() {
  const [gameData, setGameData] = useState([]);
  const [currentGame, setCurrentGame] = useState(null);
  const [currentGameIndex, setCurrentGameIndex] = useState(null);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [foundWords, setFoundWords] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load the dictionary and create game when the component mounts
  useEffect(() => {
    const loadGameData = async () => {
      setIsLoading(true);
      const data = await createGameFromDictionary(process.env.PUBLIC_URL + '/dictionary.txt', 10);
      if (data && data.length > 0) {
        setGameData(data);
      } else {
        console.error('Failed to create game data');
        // Set some fallback data
        setGameData([['abcdefghi', 'ace', 'bad', 'cab', 'dab', 'each', 'face']]);
      }
      setIsLoading(false);
    };
    
    loadGameData();
  }, []);  

  // Start a new game when game data is loaded
  useEffect(() => {
    if (gameData.length > 0 && !currentGame) {
      startNewGame();
    }
  }, [gameData, currentGame]);
  
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setFeedback(null);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [feedback]);
  
  const startNewGame = async () => {
    setIsLoading(true);
    
    try {
      // Create a new game directly from the dictionary
      const newGameData = await createGameFromDictionary(process.env.PUBLIC_URL + '/dictionary.txt', 10);
      
      if (newGameData && newGameData.length > 0) {
        setGameData(newGameData);
        setCurrentGameIndex(0);
        setCurrentGame(newGameData[0]);
      } else {
        // If failed to create new game, use existing game or fallback
        const randomIndex = Math.floor(Math.random() * gameData.length);
        setCurrentGameIndex(randomIndex);
        setCurrentGame(gameData[randomIndex]);
      }
    } catch (error) {
      console.error('Error starting new game:', error);
      // Use existing game data as fallback
      const randomIndex = Math.floor(Math.random() * gameData.length);
      setCurrentGameIndex(randomIndex);
      setCurrentGame(gameData[randomIndex]);
    }
    
    // Reset game state
    setSelectedLetters([]);
    setCurrentWord('');
    setFoundWords([]);
    setFeedback(null);
    setIsLoading(false);
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
          <div className="found-feedback"><p>Already</p><p>Found!</p></div>
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