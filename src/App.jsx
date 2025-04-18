import React, { useState, useEffect, useRef } from 'react';
import HindiKeyboard from './keyboard.jsx';
import preloadedFlashcards from './data';
import './App.css';

const initializeFlashcards = () => {
  const storedCards = localStorage.getItem('flashcards');
  if (!storedCards) {
    localStorage.setItem('flashcards', JSON.stringify(preloadedFlashcards));
    return preloadedFlashcards;
  }
  return JSON.parse(storedCards);
};

const initializeStats = () => {
  const storedStats = localStorage.getItem('reviewStats');
  if (!storedStats) {
    const initialStats = { reviewCount: 0, correctCount: 0, reviewsByDate: {} };
    localStorage.setItem('reviewStats', JSON.stringify(initialStats));
    return initialStats;
  }
  return JSON.parse(storedStats);
};

const App = () => {
  // For detailed review history
  // ... (existing state declarations)

  // Save flashcards to state and localStorage
  const saveFlashcards = (updatedCards) => {
    setFlashcards(updatedCards);
    localStorage.setItem('flashcards', JSON.stringify(updatedCards));
  };

  // Save stats to state and localStorage (must be inside App to access setStats)
  const saveStats = (updatedStats) => {
    setStats(updatedStats);
    localStorage.setItem('reviewStats', JSON.stringify(updatedStats));
  };

  // For detailed review history
  const [reviewHistory, setReviewHistory] = useState(() => {
    const stored = localStorage.getItem('reviewHistory');
    return stored ? JSON.parse(stored) : [];
  });
  const [flashcards, setFlashcards] = useState([]);
  const [stats, setStats] = useState({});
  const [activePage, setActivePage] = useState('review');
  const [menuOpen, setMenuOpen] = useState(false); // For mobile/child-friendly menu
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const stored = localStorage.getItem('soundEnabled');
    return stored === null ? true : stored === 'true';
  });

  useEffect(() => {
    setFlashcards(initializeFlashcards());
    setStats(initializeStats());
    // On first load, if no detailed history, simulate 100 incorrect answers
    const stored = localStorage.getItem('reviewHistory');
    if (!stored) {
      const allCards = initializeFlashcards();
      let indices = Array.from({length: allCards.length}, (_, i) => i);
      indices = indices.sort(() => Math.random() - 0.5).slice(0, 100);
      const now = Date.now();
      const history = indices.map(idx => ({
        card: allCards[idx],
        response: 'Incorrect',
        time: new Date(now - Math.floor(Math.random()*100000000)).toISOString()
      }));
      localStorage.setItem('reviewHistory', JSON.stringify(history));
      setReviewHistory(history);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('soundEnabled', soundEnabled);
  }, [soundEnabled]);

  // Hide menu in review mode by default, show floating button
  // Utility to detect mobile
  const isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 700px)').matches;

  const handleMenuNav = (page) => {
    setActivePage(page);
    if (isMobile) setMenuOpen(false);
  };

  const handleToggleSound = () => setSoundEnabled((prev) => !prev);

  return (
    <div className={isMobile ? 'app-container' : 'app-container'}>
      {/* Hamburger menu overlay backdrop for mobile */}
      {isMobile && menuOpen && (
        <div
          className="sidebar-backdrop"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.18)',
            zIndex: 99
          }}
          onClick={() => setMenuOpen(false)}
        />
      )}
      {/* Sidebar always visible on desktop, togglable on mobile */}
      {(!isMobile || (isMobile && menuOpen)) && (
        <Sidebar
          activePage={activePage}
          setActivePage={handleMenuNav}
          setMenuOpen={setMenuOpen}
          menuOpen={menuOpen}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          sidebarClassName={isMobile && menuOpen ? 'sidebar sidebar--open' : 'sidebar'}
        />
      )}
      {/* Hamburger menu button always visible on mobile */}
      {isMobile && !menuOpen && (
        <div style={{ position: 'fixed', top: 12, left: 12, zIndex: 15 }}>
          <button
            className="menu-fab"
            onClick={() => setMenuOpen(true)}
            aria-label="Open Menu"
            style={{ margin: 0 }}
          >
            ☰
          </button>
        </div>
      )}
      <div className={activePage === 'review' ? 'review-content' : 'main-content'}>
        {activePage === 'review' && (
          <ReviewPage flashcards={flashcards} saveFlashcards={saveFlashcards} updateStats={updateStats} stats={stats} setStats={setStats} soundEnabled={soundEnabled} reviewHistory={reviewHistory} setReviewHistory={setReviewHistory} />
        )}
        {activePage === 'search' && (
          <SearchPage flashcards={flashcards} />
        )}
        {activePage === 'stats' && (
          <StatsPage stats={stats} reviewHistory={reviewHistory} setReviewHistory={setReviewHistory} />
        )}
        {activePage === 'create' && (
          <CreatePage addFlashcard={addFlashcard} />
        )}
      </div>
    </div>
  );
};

// Playful sidebar with icons for kids
const Sidebar = ({ activePage, setActivePage, setMenuOpen, menuOpen, sidebarClassName }) => (
  <div className={sidebarClassName || "sidebar"}>
    <div className="sidebarTitle">Flashcards</div>
    <button className="navButton" style={{ background: activePage === 'review' ? '#FFE066' : undefined, color: activePage === 'review' ? '#FF7EB9' : undefined }} onClick={() => setActivePage('review')}>
      🃏 Play
    </button>
    <button className="navButton" style={{ background: activePage === 'search' ? '#FFE066' : undefined, color: activePage === 'search' ? '#FF7EB9' : undefined }} onClick={() => setActivePage('search')}>
      🔍 Search
    </button>
    <button className="navButton" style={{ background: activePage === 'create' ? '#FFE066' : undefined, color: activePage === 'create' ? '#FF7EB9' : undefined }} onClick={() => setActivePage('create')}>
      ✏️ Create
    </button>
    <button className="navButton" style={{ background: activePage === 'stats' ? '#FFE066' : undefined, color: activePage === 'stats' ? '#FF7EB9' : undefined }} onClick={() => setActivePage('stats')}>
      📊 Stats
    </button>
    
    {menuOpen && (
      <button className="navButton" style={{ marginTop: '2rem', background: '#FFB86E' }} onClick={() => setMenuOpen(false)}>
        ❌ Close Menu
      </button>
    )}
  </div>
);

// (Removed duplicate App component definition that started here)

  const updateStats = (isCorrect, stats, setStats) => {
    const today = new Date().toISOString().split('T')[0];
    const newStats = { ...stats };
    newStats.reviewCount = (newStats.reviewCount || 0) + 1;
    if (isCorrect) {
      newStats.correctCount = (newStats.correctCount || 0) + 1;
    }
    if (!newStats.reviewsByDate) {
      newStats.reviewsByDate = {};
    }
    if (!newStats.reviewsByDate[today]) {
      newStats.reviewsByDate[today] = { total: 0, correct: 0 };
    }
    newStats.reviewsByDate[today].total += 1;
    if (isCorrect) {
      newStats.reviewsByDate[today].correct += 1;
    }
    setStats(newStats);
  };

  const addFlashcard = (newCard) => {
    const newId = flashcards.length > 0 ? Math.max(...flashcards.map(card => card.id)) + 1 : 1;
    const card = {
      id: newId,
      front: newCard.front,
      back: newCard.back,
      lastReviewed: null,
      correct: 0,
      incorrect: 0
    };
    const updatedCards = [...flashcards, card];
    saveFlashcards(updatedCards);
  };



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

  // --- Remove duplicate state declarations below ---
  // const [currentIndex, setCurrentIndex] = useState(0);
  // const [isFlipped, setIsFlipped] = useState(false);
  // const [reviewMode, setReviewMode] = useState(false);
  // const cardRef = useRef(null);
  // (removed duplicate state declarations below, only the new ones above remain)


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

const SearchPage = ({ flashcards }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    const results = flashcards.filter(card => (
      card.front.toLowerCase().includes(query) || card.back.toLowerCase().includes(query)
    ));
    setSearchResults(results);
  }, [searchQuery, flashcards]);
  return (
    <div className="searchContainer">
      <h1 className="pageTitle" style={{fontSize: '2.5rem'}}>🔍 Search</h1>
      <div className="searchBox">
        <input
          type="text"
          placeholder="🔎 Type Hindi or English..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="searchInput"
        />
      </div>
      <div className="searchResults">
        {searchResults.length > 0 ? (
          <table className="resultTable">
            <thead>
              <tr>
                <th className="tableHeader" style={{fontSize: '1.3rem'}}>🐘 Hindi</th>
                <th className="tableHeader" style={{fontSize: '1.3rem'}}>🦋 English</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map(card => (
                <tr key={card.id} className="tableRow">
                  <td className="tableCell">{card.front}</td>
                  <td className="tableCell">{card.back}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          searchQuery.trim() !== '' && (
            <p className="noResults">No cards found. Try a different word!</p>
          )
        )}
      </div>
    </div>
  );
};

const StatsPage = ({ stats, reviewHistory, setReviewHistory }) => {
  // Calculate total responses and accuracy from reviewHistory
  const totalResponses = reviewHistory.length;
  const correctResponses = reviewHistory.filter(r => r.actualResult === 'Correct').length;
  const accuracy = totalResponses > 0 ? Math.round((correctResponses / totalResponses) * 100) : 0;
  const canvasRef = useRef(null);
  useEffect(() => {
    if (stats && stats.reviewsByDate && Object.keys(stats.reviewsByDate).length > 0) {
      import('chart.js/auto').then((Chart) => {
        const ctx = canvasRef.current.getContext('2d');
        const dates = Object.keys(stats.reviewsByDate).sort();
        const reviewData = dates.map(date => stats.reviewsByDate[date].total);
        const correctData = dates.map(date => stats.reviewsByDate[date].correct || 0);
        if (window.myChart) {
          window.myChart.destroy();
        }
        window.myChart = new Chart.default(ctx, {
          type: 'bar',
          data: {
            labels: dates,
            datasets: [
              {
                label: 'Total Reviewed',
                data: reviewData,
                backgroundColor: 'rgba(74, 111, 165, 0.7)',
                borderColor: '#2c3e50',
                borderWidth: 1
              },
              {
                label: 'Correct Answers',
                data: correctData,
                backgroundColor: 'rgba(124, 255, 203, 0.7)',
                borderColor: '#6EC1E4',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
              tooltip: {
                enabled: true,
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: ${context.parsed.y}`;
                  }
                }
              }
            },
            scales: {
              y: { beginAtZero: true, title: { display: true, text: 'Number of Reviews' } },
              x: { title: { display: true, text: 'Date' } }
            }
          }
        });
      });
    }
  }, [stats]);
  return (
    <div className="statsContainer">
      <h1 className="pageTitle">Review Statistics</h1>
      <div className="statsSummary">
        <div className="statCard">
          <h3 className="statTitle">Total Responses</h3>
          <p className="statValue">{totalResponses}</p>
        </div>
        <div className="statCard">
          <h3 className="statTitle">Accuracy</h3>
          <p className="statValue">{accuracy}%</p>
        </div>
      </div>
      <div style={{margin: '2rem 0', display: 'flex', justifyContent: 'flex-end'}}>
        <button className="incorrectButton" style={{background: '#FF7EB9', color: '#fff', fontSize: '1.1rem'}} onClick={() => {
          setReviewHistory([]); localStorage.removeItem('reviewHistory');
        }}>Clear Results</button>
      </div>
      <div className="chartContainer">
        <h3 className="chartTitle">Review Activity</h3>
        {stats && stats.reviewsByDate && Object.keys(stats.reviewsByDate).length > 0 ? (
          <canvas ref={canvasRef} width="600" height="300"></canvas>
        ) : (
          <p className="noData">No review data available yet. Start reviewing to see statistics.</p>
        )}
      </div>
      <div style={{marginTop: '2rem'}}>
        <h3 className="chartTitle">Detailed Results</h3>
        <div style={{overflowX: 'auto', maxHeight: 320}}>
          <table className="resultTable">
            <thead>
              <tr>
                <th className="tableHeader">Hindi</th>
                <th className="tableHeader">English</th>
                <th className="tableHeader">Response</th>
                <th className="tableHeader">Actual Result</th>
                <th className="tableHeader">Time</th>
              </tr>
            </thead>
            <tbody>
              {reviewHistory.length === 0 && (
                <tr><td colSpan="5" style={{textAlign: 'center', color: '#aaa', fontSize: '1.2rem'}}>No results yet.</td></tr>
              )}
              {reviewHistory.map((item, i) => (
                <tr key={i}>
                  <td className="tableCell">{item.card.front}</td>
                  <td className="tableCell">{item.card.shownBack || item.card.correctBack || ''}</td>
                  <td className="tableCell">{item.response}</td>
                  <td className="tableCell">{item.actualResult}</td>
                  <td className="tableCell">{new Date(item.time).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

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
      <h1 className="pageTitle" style={{fontSize: '2.5rem'}}>🦄 Create</h1>
      <form onSubmit={handleSubmit} className="createForm">
        <div className="formGroup">
          <label className="formLabel">Hindi Word</label>
          <input
            type="text"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            onFocus={() => setShowKeyboard(true)}
            className="formInput"
            placeholder="🐘 Type a Hindi word!"
            autoComplete="off"
          />
          <button type="button" className="keyboard-toggle" onClick={() => setShowKeyboard((show) => !show)} style={{ marginTop: 8, marginBottom: 8 }}>
            {showKeyboard ? 'Hide Keyboard' : 'Show Hindi Keyboard'}
          </button>
          {showKeyboard && (
            <HindiKeyboard onKeyPress={handleKeyPress} />
          )}
        </div>
        <div className="formGroup">
          <label className="formLabel">English Translation</label>
          <input
            type="text"
            value={back}
            onChange={(e) => setBack(e.target.value)}
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

// Inline styles object (copy from your previous app.js styles)


export default App;
