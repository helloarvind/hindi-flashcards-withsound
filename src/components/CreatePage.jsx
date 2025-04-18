import React, { useState } from 'react';
import HindiKeyboard from '../keyboard.jsx';
import '../styles/createpage.css';

const CreatePage = ({ addFlashcard }) => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [message, setMessage] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);
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
    addFlashcard({ front, back }, () => {
      setFront('');
      setBack('');
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 2000);
    });
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
        {showAnimation && (
          <div className="thankyou-animation" style={{textAlign:'center',fontSize:'2rem',color:'#FF7EB9',marginTop:'1rem',animation:'pop 0.5s'}}>🎉 Thank you! Flashcard created! 🎉</div>
        )}
        {message && (
          <div className={message ? (message.includes('successfully') ? 'message-success' : 'message-error') : ''}>{message}</div>
        )}
      </form>
    </div>
  );
};

export default CreatePage;
