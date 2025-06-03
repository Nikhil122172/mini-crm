import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Customers.css';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  // const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' });
  const [newCustomer, setNewCustomer] = useState({
  name: '',
  email: '',
  phone: '',
  totalSpend: '',
  visits: ''
});

const [editingCustomerId, setEditingCustomerId] = useState(null);


  const fetchCustomers = async () => {
    const res = await axios.get('https://mini-crmb.onrender.com/api/customers');
    setCustomers(res.data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

const handleSubmit = async () => {
  if (editingCustomerId) {
    // Editing mode
    await axios.put(`https://mini-crmb.onrender.com/api/customers/${editingCustomerId}`, {
      ...newCustomer,
      totalSpend: Number(newCustomer.totalSpend),
      visits: Number(newCustomer.visits),
    });
  } else {
    // Adding mode
    await axios.post('https://mini-crmb.onrender.com/api/customers', {
      ...newCustomer,
      totalSpend: Number(newCustomer.totalSpend),
      visits: Number(newCustomer.visits),
    });
  }

  setNewCustomer({ name: '', email: '', phone: '', totalSpend: '', visits: '' });
  setEditingCustomerId(null);
  fetchCustomers();
};


  const handleDelete = async (id) => {
    await axios.delete(`https://mini-crmb.onrender.com/api/customers/${id}`);
    fetchCustomers();
  };

  const handleEdit = (customer) => {
  setNewCustomer({
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    totalSpend: customer.totalSpend || '',
    visits: customer.visits || '',
  });
  setEditingCustomerId(customer._id);
};


  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="container">
      <div className="header">
        <h1>Customer Management</h1>
        <div className="add-form">
          <input
            type="text"
            placeholder="Name"
            value={newCustomer.name}
            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={newCustomer.email}
            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone"
            value={newCustomer.phone}
            onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
          />
          <input
            type="number"
            placeholder="Total Spend"
            value={newCustomer.totalSpend}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, totalSpend: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Visits"
            value={newCustomer.visits}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, visits: e.target.value })
            }
          />

          <button onClick={handleSubmit}>{editingCustomerId ? 'Update Customer' : 'Add Customer'}</button>

        </div>
      </div>

      <input
        className="search"
        placeholder="Search by name, email, or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid">
        {filteredCustomers.length === 0 ? (
          <div className="no-results">No customers found.</div>
        ) : (
          filteredCustomers.map((customer) => (
            <div className="card" key={customer._id}>
              <h2>{customer.name}</h2>
                  <p>Email: {customer.email}</p>
                  <p>Phone: {customer.phone}</p>
                  <p>Total Spend: ₹{customer.totalSpend ?? 0}</p>
                  <p>Visits: {customer.visits ?? 0}</p>
              <div className="actions">
                <button onClick={() => handleEdit(customer)}>Edit</button>
                <button onClick={() => handleDelete(customer._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomersPage;
