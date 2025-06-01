import React, { useState } from 'react';
import './SegmentForm.css';

const SegmentForm = () => {
  const [name, setName] = useState('');
  const [rules, setRules] = useState([{ field: '', operator: '', value: '' }]);
  const [success, setSuccess] = useState(false);

  const handleRuleChange = (index, e) => {
    const updatedRules = [...rules];
    updatedRules[index][e.target.name] = e.target.value;
    setRules(updatedRules);
  };

  const addRule = () => {
    setRules([...rules, { field: '', operator: '', value: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name,
      rules: rules.map(rule => ({
        field: rule.field,
        operator: rule.operator,
        value: parseFloat(rule.value)
      }))
    };

    try {
      const res = await fetch('http://localhost:5000/api/segments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setName('');
        setRules([{ field: '', operator: '', value: '' }]);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }
    } catch (err) {
      console.error('Error creating segment:', err);
    }
  };

  const [previewCount, setPreviewCount] = useState(null);

const handlePreview = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/segments/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rules }),
    });
    const data = await res.json();
    console.log(data.count);
    setPreviewCount(data.count);
  } catch (err) {
    console.error('Preview error:', err);
  }
};


  return (
    <div className="segment-form">
      <h2>Create Segment</h2>
      <form onSubmit={handleSubmit}>
        <label>Segment Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <h4>Rules:</h4>
        {rules.map((rule, index) => (
          <div className="rule-row" key={index}>
            <select name="field" value={rule.field} onChange={(e) => handleRuleChange(index, e)} required>
              <option value="">Field</option>
              <option value="totalSpend">Total Spend</option>
              <option value="visits">Visits</option>
            </select>

            <select name="operator" value={rule.operator} onChange={(e) => handleRuleChange(index, e)} required>
              <option value="">Operator</option>
              <option value=">">&gt;</option>
              <option value="<">&lt;</option>
              <option value="==">==</option>
            </select>

            <input
              type="number"
              name="value"
              placeholder="Value"
              value={rule.value}
              onChange={(e) => handleRuleChange(index, e)}
              required
            />
          </div>
        ))}

        <button type="button" onClick={addRule}>+ Add Rule</button>
        <button type="submit">Create Segment</button>

        {/* <button type="button" onClick={handlePreview}>🔍 Preview Audience</button> */}

      </form>
{/* {previewCount !== null && <p>Estimated audience size: {previewCount}</p>} */}

      {success && <p className="success-msg">Segment created successfully ✅</p>}
    </div>
  );
};

export default SegmentForm;
