import { useState, useEffect } from 'react';
import axios from 'axios';
import './Campaigns.css';

export default function Campaigns() {
  const [segments, setSegments] = useState([]);
  const [campaignName, setCampaignName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('');
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetchSegments();
    fetchCampaigns();
  }, []);

  const fetchSegments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/segments');
      setSegments(res.data);
    } catch (err) {
      console.error('Failed to fetch segments:', err);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/campaigns');
      setCampaigns(res.data);
    } catch (err) {
      console.error('Failed to fetch campaigns:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!campaignName || !message || !selectedSegment) return alert('Please fill all fields.');

    try {
      await axios.post('http://localhost:5000/api/campaigns', {
        name: campaignName,
        message,
        segmentId: selectedSegment,
        // userId: 'currentUserId', // replace with actual user id from auth context
        userId: process.env.ID
      });
      setCampaignName('');
      setMessage('');
      setSelectedSegment('');
      fetchCampaigns();
    } catch (err) {
      console.error('Failed to launch campaign:', err);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Campaigns</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Campaign Name"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          className="input"
          required
        />
        <textarea
          placeholder="Message (e.g. Hi {{name}}, here's 10% off!)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="textarea"
          required
          rows={4}
        />
        <select
          value={selectedSegment}
          onChange={(e) => setSelectedSegment(e.target.value)}
          className="select"
          required
        >
          <option value="">Select Segment</option>
          {segments.map((segment) => (
            <option key={segment._id} value={segment._id}>
              {segment.name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn">
          Launch Campaign
        </button>
      </form>

      <h2 className="subtitle">Past Campaigns</h2>
      {campaigns.length === 0 ? (
        <p>No campaigns yet.</p>
      ) : (
        <ul className="campaign-list">
          {campaigns.map((c) => (
            <li key={c._id} className="campaign-item">
              <div className="campaign-header">
                <strong>{c.name}</strong>
                <span>{new Date(c.createdAt).toLocaleString()}</span>
              </div>
              <p>Audience: {c.audienceSize}</p>
              <p>
                Sent: {c.sent} | Failed: {c.failed}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
