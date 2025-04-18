import React, { useState } from 'react';
import HindiKeyboard from '../keyboard.jsx';
import '../styles/CreatePage.css';

const CreatePage = ({ addFlashcard }) => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [message, setMessage] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const handleKeyPress = (key) => {
    if (key === 'BACKSPACE') {
      setFront(front.slice(0, -1));
    } else if (key === 'SPACE') {
      setFront(front + ' ');
    } else {
      setFront(front + key);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (front.trim() === '' || back.trim() === '') {
      setMessage('Both fields are required.');
      return;
    }
    addFlashcard({ front, back });
    setFront('');
    setBack('');
    setMessage('🎉 Flashcard created! Great job!');
    setTimeout(() => setMessage(''), 3000);
  };
  return (
    <div className="createContainer">
      <h1 className="pageTitle">Create a Flashcard</h1>
      <form onSubmit={handleSubmit} className="createForm">
        <div className="formGroup">
          <label className="formLabel">Hindi Word</label>
          <input
            type="text"
            value={front}
            onChange={e => setFront(e.target.value)}
            onFocus={() => setShowKeyboard(true)}
            className="formInput"
            placeholder="🌸 Type or use the keyboard!"
            autoComplete="off"
          />
          {showKeyboard && <HindiKeyboard onKeyPress={handleKeyPress} />}
        </div>
        <div className="formGroup">
          <label className="formLabel">English Translation</label>
          <input
            type="text"
            value={back}
            onChange={e => setBack(e.target.value)}
            onFocus={() => setShowKeyboard(false)}
            className="formInput"
            placeholder="🦋 Type the English!"
          />
        </div>
        <button type="submit" className="submitButton">✨ Create</button>
        {message && (
          <div className={message ? (message.includes('successfully') ? 'message-success' : 'message-error') : ''}>{message}</div>
        )}
      </form>
    </div>
  );
};

export default CreatePage;
