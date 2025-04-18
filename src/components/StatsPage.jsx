import React, { useRef, useEffect } from 'react';
import '../styles/StatsPage.css';

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
        if (ctx && stats.reviewsByDate) {
          new Chart.default(ctx, {
            type: 'bar',
            data: {
              labels: Object.keys(stats.reviewsByDate),
              datasets: [{
                label: 'Reviews',
                data: Object.values(stats.reviewsByDate).map(v => v.total),
                backgroundColor: '#FFB86E',
              }, {
                label: 'Correct',
                data: Object.values(stats.reviewsByDate).map(v => v.correct),
                backgroundColor: '#7CFFCB',
              }]
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return `${context.dataset.label}: ${context.parsed.y}`;
                    }
                  }
                }
              }
            }
          });
        }
      });
    }
  }, [stats]);
  return (
    <div className="statsContainer">
      <h1 className="pageTitle">Statistics</h1>
      <div className="statsSummary">
        <div><strong>Total Reviews:</strong> {totalResponses}</div>
        <div><strong>Accuracy:</strong> {accuracy}%</div>
      </div>
      <div style={{ margin: '2rem 0' }}>
        <canvas ref={canvasRef} width={600} height={200} />
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
  );
};

export default StatsPage;
