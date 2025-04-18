import React, { useState, useEffect } from 'react';
import preloadedFlashcards from './data';
import './App.css';
import ReviewPage from './components/ReviewPage.jsx';
import SearchPage from './components/SearchPage.jsx';
import StatsPage from './components/StatsPage.jsx';
import CreatePage from './components/CreatePage.jsx';
import Sidebar from './components/Sidebar.jsx';

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

}

export default App;
