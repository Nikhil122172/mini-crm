import { useState, useEffect } from 'react';
import axios from 'axios';
import './Campaigns.css';
import React from 'react';
// const { user } = useAuth();
// import { useAuth } from '../components/AuthContext'; // adjust path
// const { user } = useAuth();


export default function Campaigns() {
  const [segments, setSegments] = useState([]);
  const [campaignName, setCampaignName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const [user, setUser] = useState(null);

useEffect(() => {
  axios.get('https://mini-crmb.onrender.com/api/me', { withCredentials: true })
    .then(res => {
      setUser(res.data);
    })
    .catch(err => {
      console.error('User not authenticated', err);
    });
}, []);

  useEffect(() => {
    fetchSegments();
    fetchCampaigns();
  }, []);

  const fetchSegments = async () => {
    try {
      const res = await axios.get('https://mini-crmb.onrender.com/api/segments');
      // console.log(res.data);
      
      setSegments(res.data);
    } catch (err) {
      console.error('Failed to fetch segments:', err);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get('https://mini-crmb.onrender.com/api/campaigns');
      setCampaigns(res.data);
    } catch (err) {
      console.error('Failed to fetch campaigns:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!campaignName || !message || !selectedSegment) return alert('Please fill all fields.');

    try {
      console.log(user.uid);
      await axios.post('https://mini-crmb.onrender.com/api/campaigns', {
        name: campaignName,
        message,
        segmentId: selectedSegment,
        // userId: 'currentUserId', // replace with actual user id from auth context
        userId: user._id
      });
      setCampaignName('');
      setMessage('');
      setSelectedSegment('');
      fetchCampaigns();
    } catch (err) {
      console.error('Failed to launch campaign:', err);
    }
  };

  const handleGenerateMessage = async () => {
  if (!campaignName || !selectedSegment) {
    alert("Please enter a campaign name and select a segment before generating a message.");
    return;
  }
  setIsGenerating(true);
  try {
    const res = await axios.post('https://mini-crmb.onrender.com/api/generate', {
      name: campaignName
    });
    setMessage(res.data.message);
  } catch (err) {
    console.error("AI message generation failed:", err);
    alert("Failed to generate message.");
  } finally {
    setIsGenerating(false);
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
  <button
    type="button"
    className="btn secondary"
    onClick={handleGenerateMessage}
    disabled={isGenerating}
  >
    {isGenerating ? "Generating..." : "✨ Generate with AI"}
  </button>


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
