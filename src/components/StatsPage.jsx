import React, { useState } from 'react';
import '../styles/statspage.css';

const PAGE_SIZE = 10;

const StatsPage = ({ stats, reviewHistory, setReviewHistory }) => {

  // Calculate total responses and accuracy from reviewHistory
  const totalResponses = reviewHistory.length;
  const correctResponses = reviewHistory.filter(r => r.actualResult === 'Correct').length;
  const accuracy = totalResponses > 0 ? Math.round((correctResponses / totalResponses) * 100) : 0;

  // --- Pagination and Filters ---
  const [page, setPage] = useState(1);
  const [resultFilter, setResultFilter] = useState('all');
  

  // Filtered history based on filters
  const filtered = reviewHistory.filter(item => {
    let match = true;
    if (resultFilter === 'correct') {
      match = item.actualResult === 'Correct';
    } else if (resultFilter === 'incorrect') {
      match = item.actualResult === 'Incorrect';
    }
    return match;
  });
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  return (
    <div className="statsContainer" style={{ width: '100%', maxWidth: '100%', marginLeft: 0, marginRight: 0, flex: 1 }}>
      <h1 className="pageTitle">Statistics</h1>
      <div className="statsSummary" style={{ marginBottom: '2rem' }}>
        <div><strong>Total Reviews:</strong> {totalResponses}</div>
        <div><strong>Accuracy:</strong> {accuracy}%</div>
      </div>

      <div className="statsFilterBar" style={{display:'flex',alignItems:'center',gap:'1.2rem',marginBottom:'1.5rem',flexWrap:'wrap'}}>
        <span style={{marginLeft:'auto', fontSize:'0.95em'}}>Attempts: {filtered.length}</span>
        <label>Result:
          <select value={resultFilter} onChange={e => {setResultFilter(e.target.value); setPage(1);}} style={{marginLeft:'0.5rem'}}>
            <option value="all">All</option>
            <option value="correct">Correct</option>
            <option value="incorrect">Incorrect</option>
          </select>
        </label>
        <button
          onClick={() => {
            localStorage.removeItem('reviewHistory');
            localStorage.removeItem('reviewStats');
            setReviewHistory([]);
            if (typeof setStats === 'function') setStats({ reviewCount: 0, correctCount: 0, reviewsByDate: {} });
          }}
          style={{background:'#FF7EB9',color:'#fff',padding:'0.5rem 1.2rem',border:'none',borderRadius:'8px',fontWeight:'bold',cursor:'pointer',marginLeft:'1rem'}}
        >
          Clear All
        </button>
      </div>
      <div className="historyTableWrap">
        <table className="historyTable">
          <thead>
            <tr>
              <th className="tableHeader">Hindi</th>
              <th className="tableHeader">English</th>
              <th className="tableHeader">Your Answer</th>
              <th className="tableHeader">Result</th>
              <th className="tableHeader">Time</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(paged) && paged.length > 0 && paged.every(item => item.card) && paged.map((item, i) => (
              <tr key={i}>
                <td className="tableCell">{item.card.front}</td>
                <td className="tableCell">{item.card.shownBack || item.card.correctBack || item.card.back || ''}</td>
                <td className="tableCell">{item.response}</td>
                <td className="tableCell">{item.actualResult || 'N/A'}</td>
                <td className="tableCell">{new Date(item.time).toLocaleString()}</td>
              </tr>
            ))}
            {(!paged || paged.length === 0) && (
              <tr><td className="tableCell" colSpan={5} style={{textAlign:'center',color:'#FF7EB9'}}>No review attempts yet.</td></tr>
            )}
          </tbody>
        </table>
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:'1rem', margin:'1rem 0'}}>
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{padding:'0.5rem 1.1rem', borderRadius:'8px', border:'none', background:'#FFB86E', color:'#fff', fontWeight:'bold', cursor:page===1?'not-allowed':'pointer'}}>Prev</button>
          <span>Page {page} of {totalPages || 1}</span>
          <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages||totalPages===0} style={{padding:'0.5rem 1.1rem', borderRadius:'8px', border:'none', background:'#FFB86E', color:'#fff', fontWeight:'bold', cursor:page===totalPages||totalPages===0?'not-allowed':'pointer'}}>Next</button>
        </div>
      </div>
      <div className="bottom-nav-spacer"></div>
    </div>
  );
};

export default StatsPage;
