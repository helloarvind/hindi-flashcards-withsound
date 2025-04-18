import React, { useState, useEffect, useRef } from 'react';
import '../styles/ReviewPage.css';

const ReviewPage = ({ flashcards, saveFlashcards, updateStats, stats, setStats, soundEnabled, reviewHistory, setReviewHistory }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffled, setShuffled] = useState([]);
  const cardRef = useRef(null);

  useEffect(() => {
    // Shuffle flashcards and for each, randomly decide to show correct or incorrect English
    const shuffledCards = [...flashcards].sort(() => Math.random() - 0.5).map(card => {
      // 50% chance to show incorrect English
      if (Math.random() < 0.5 && flashcards.length > 1) {
        // Pick a random incorrect back
        let wrong;
        do {
          wrong = flashcards[Math.floor(Math.random() * flashcards.length)];
        } while (wrong.id === card.id);
        return { ...card, shownBack: wrong.back, isMatch: false };
      } else {
        return { ...card, shownBack: card.back, isMatch: true };
      }
    });
    setShuffled(shuffledCards);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [flashcards]);

  const [feedback, setFeedback] = useState(null);
  const [feedbackAnim, setFeedbackAnim] = useState('');
  // Complex logic: If response is 'Correct', check if Hindi-English match is correct for this card (always true in this app), but in future, could compare user input. For now, treat 'Correct' as factually correct.
  const recordResponse = (response) => {
    const card = shuffled[currentIndex];
    // FACTUAL CHECK: Is the shownBack the correct translation for the Hindi?
    const isActuallyMatch = card.isMatch === true;
    const childThinksMatch = response === 'Correct';
    // Child is correct if their answer matches the actual match
    const isFactuallyCorrect = isActuallyMatch === childThinksMatch;
    const entry = {
      card: { front: card.front, shownBack: card.shownBack, correctBack: card.back },
      response,
      time: new Date().toISOString(),
      actualResult: isFactuallyCorrect ? 'Correct' : 'Incorrect',
      wasMatch: isActuallyMatch
    };
    const updatedHistory = [entry, ...reviewHistory];
    setReviewHistory(updatedHistory);
    localStorage.setItem('reviewHistory', JSON.stringify(updatedHistory));
    updateStats(isFactuallyCorrect, stats, setStats);
    setFeedback(isFactuallyCorrect ? '👏' : '😞');
    setFeedbackAnim('animate');
    setTimeout(() => {
      setFeedback(null);
      setFeedbackAnim('');
      if (currentIndex < shuffled.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      }
    }, 1200);
  };

  // Speech Synthesis
  const speak = (text, lang) => {
    if (!soundEnabled) return;
    if (!window.speechSynthesis) return;
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    // Try to pick a suitable voice
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const match = voices.find(v => v.lang === lang);
      if (match) utterance.voice = match;
    }
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    window.speechSynthesis.speak(utterance);
  };

  const handleSpeak = () => {
    const card = shuffled[currentIndex];
    if (!card) return;
    if (!isFlipped) {
      speak(card.front, 'hi-IN');
    } else {
      speak(card.shownBack, 'en-US');
    }
  };

  const handleKeyDown = (e) => {
    if (e.code === 'Space') {
      flipCard();
    } else if (e.code === 'ArrowRight') {
      nextCard();
    } else if (e.code === 'ArrowLeft') {
      prevCard();
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, isFlipped]);
  const flipCard = () => setIsFlipped(!isFlipped);
  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };
  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };
  const markCorrect = () => {
    if (!reviewMode) return;
    const updatedCards = [...flashcards];
    const card = updatedCards[currentIndex];
    card.lastReviewed = new Date().toISOString();
    card.correct += 1;
    saveFlashcards(updatedCards);
    updateStats(true);
  };
  const markIncorrect = () => {
    if (!reviewMode) return;
    const updatedCards = [...flashcards];
    const card = updatedCards[currentIndex];
    card.lastReviewed = new Date().toISOString();
    card.incorrect += 1;
    saveFlashcards(updatedCards);
    updateStats(false);
  };
  return (
    <div className="reviewContainer">
      <h1 className="pageTitle">Let's Play</h1>
      {shuffled.length > 0 && (
        <div className="review-content">
          <div ref={cardRef} className="flashcard" onClick={() => !feedback && flipCard()} style={{position: 'relative'}}>
            <h2>{isFlipped ? shuffled[currentIndex].shownBack : shuffled[currentIndex].front}</h2>
            <div style={{fontSize: '1rem', color: '#888', marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              {isFlipped ? 'English' : 'Hindi'}
              <span
                onClick={e => { e.stopPropagation(); if (soundEnabled) handleSpeak(); }}
                style={{
                  marginLeft: 8,
                  cursor: soundEnabled ? 'pointer' : 'not-allowed',
                  color: soundEnabled ? '#7CFFCB' : '#ccc',
                  fontSize: '1.4em',
                  userSelect: 'none',
                  opacity: soundEnabled ? 1 : 0.5
                }}
                title={soundEnabled ? (isFlipped ? 'Speak English' : 'Speak Hindi') : 'Sound Off'}
                aria-label={soundEnabled ? (isFlipped ? 'Speak English' : 'Speak Hindi') : 'Sound Off'}
                tabIndex={soundEnabled ? 0 : -1}
                role="button"
                onKeyDown={e => { if (soundEnabled && (e.key === 'Enter' || e.key === ' ')) { handleSpeak(); } }}
              >
                {soundEnabled ? '🔊' : '🔇'}
              </span>
            </div>
          </div>
          <div className={`feedbackButtons${isFlipped ? ' feedbackButtons--visible' : ''}`} style={{marginTop: 24, opacity: isFlipped ? 1 : 0, pointerEvents: isFlipped ? 'auto' : 'none', transition: 'opacity 0.5s cubic-bezier(.4,0,.2,1)'}}>
            <button className="correctButton" style={{fontSize: '1.5rem', padding: '1rem 2rem'}} onClick={() => recordResponse('Correct')} disabled={!isFlipped || !!feedback}>✅ Correct</button>
            <button className="incorrectButton" style={{fontSize: '1.5rem', padding: '1rem 2rem'}} onClick={() => recordResponse('Incorrect')} disabled={!isFlipped || !!feedback}>❌ Incorrect</button>
          </div>
          {feedback && (
            <div className={`feedback-emoji ${feedbackAnim}`} style={{
              fontSize: '3rem',
              margin: '1.2rem 0',
              fontWeight: 600,
              transition: 'transform 0.3s',
              animation: feedbackAnim ? (feedback === '👏' ? 'clap-bounce 0.9s' : 'disappoint-shake 0.9s') : undefined
            }}>{feedback}</div>
          )}
          <div className="cardCounter" style={{marginTop: 16, fontWeight: 700, fontSize: '1.2rem', color: '#1a6ee6'}}>
            Card {currentIndex + 1} of {shuffled.length}
          </div>

        </div>
      )}
    </div>
  );
};

export default ReviewPage;
