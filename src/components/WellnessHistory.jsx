import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { format } from 'date-fns';

const WellnessHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Map section values to labels and colors
  const sectionMeta = {
    'Your': { label: 'Me', color: '#047051' },
    'You': { label: 'You', color: '#2E7D32' },
    'Us': { label: 'Us', color: '#ED6C02' }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        const response = await axios.get('/wp/v2/wellness-history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const historyData = Array.isArray(response.data?.data) ? response.data.data : [];
        const sortedHistory = historyData.sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at));
        setHistory(sortedHistory);
      } catch (error) {
        console.error('Error fetching wellness history:', error);
        setError('Failed to load wellness history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="wellness-history-container">
      {history.length === 0 ? (
        <p className="text-secondary">You haven't completed any wellness activities yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Page</th>
                <th>Activity Pdf</th>
                <th>Feeling</th>
                <th>Activity</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => {
                const meta = sectionMeta[item.section] || { label: item.section, color: '#6c757d' };

                return (
                  <tr key={index}>
                    <td>{format(new Date(item.completed_at), 'MMM dd, yyyy')}</td>
                    <td>
                      <span className="badge" style={{ backgroundColor: meta.color, color: 'white' }}>
                        {meta.label}
                      </span>
                    </td>
                    <td>
                      {item.activity_pdf_url ?
                      <a className="badge" href={item.activity_pdf_url} style={{ backgroundColor: 'yellowgreen', color: 'white' }} target="_blank" rel="noopener noreferrer">   
                        {item.activity_pdf_url ? 'Download PDF' : 'No Attached PDF'}
                      </a>
                    : <span className="badge" style={{ backgroundColor: 'GrayText' }}>   
                        {item.activity_pdf_url ? 'Download PDF' : 'No Attached PDF'}
                      </span>}
                    </td>
                    <td>{item.feeling}</td>
                    <td>{item.activity}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WellnessHistory;
