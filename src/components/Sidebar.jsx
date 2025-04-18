import React from 'react';
import '../styles/Sidebar.css';

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

export default Sidebar;
