import React, { useState, useEffect } from 'react';
import '../styles/SearchPage.css';

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
      <h1 className="pageTitle">Search Flashcards</h1>
      <input
        type="text"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className="formInput"
        placeholder="🔍 Type Hindi or English..."
        style={{ marginBottom: 24 }}
      />
      <div className="searchResults">
        {searchResults.length > 0 ? (
          <table className="resultsTable">
            <thead>
              <tr>
                <th className="tableHeader">Hindi</th>
                <th className="tableHeader">English</th>
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

export default SearchPage;
