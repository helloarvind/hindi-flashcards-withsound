import React from 'react';
import '../styles/sidebar.css';

function isMobile() {
  if (typeof window !== 'undefined') {
    return window.innerWidth <= 700;
  }
  return false;
}

const BottomNav = ({ activePage, setActivePage }) => (
  <nav className="bottom-nav">
    <button className={activePage === 'review' ? 'bottom-nav-btn active' : 'bottom-nav-btn'} onClick={() => setActivePage('review')}>
      🃏<div>Play</div>
    </button>
    <button className={activePage === 'search' ? 'bottom-nav-btn active' : 'bottom-nav-btn'} onClick={() => setActivePage('search')}>
      🔍<div>Search</div>
    </button>
    <button className={activePage === 'create' ? 'bottom-nav-btn active' : 'bottom-nav-btn'} onClick={() => setActivePage('create')}>
      ✏️<div>Create</div>
    </button>
    <button className={activePage === 'stats' ? 'bottom-nav-btn active' : 'bottom-nav-btn'} onClick={() => setActivePage('stats')}>
      📊<div>Stats</div>
    </button>
  </nav>
);

const Sidebar = ({ activePage, setActivePage, sidebarClassName }) => {
  // Use a media query to determine mobile view
  const [mobile, setMobile] = React.useState(isMobile());
  React.useEffect(() => {
    const handleResize = () => setMobile(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (mobile) {
    return <BottomNav activePage={activePage} setActivePage={setActivePage} />;
  }
  return (
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

    </div>
  );
};

export default Sidebar;
