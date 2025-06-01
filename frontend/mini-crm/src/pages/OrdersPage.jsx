import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Orders.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);

  // New order form state
  const [newOrder, setNewOrder] = useState({
    customerId: '',
    amount: 0,
    items: [{ name: '', quantity: 1, price: 0 }],
  });

  // Edit order state
  const [editOrder, setEditOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
  }, []);

  useEffect(() => {
    // Filter orders by email search
    if (!searchEmail.trim()) {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) =>
        order.customerId?.email.toLowerCase().includes(searchEmail.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  }, [searchEmail, orders]);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders');
      setOrders(res.data);
      setFilteredOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch customers for dropdown
  const fetchCustomers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle changes in new order item inputs
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newOrder.items];
    updatedItems[index][field] = field === 'name' ? value : Number(value);
    setNewOrder({
      ...newOrder,
      items: updatedItems,
      amount: calculateAmount(updatedItems),
    });
  };

  // Add new empty item row in new order form
  const addItem = () => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { name: '', quantity: 1, price: 0 }],
    });
  };

  // Calculate total amount for items
  const calculateAmount = (items) => {
    return items.reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
      0
    );
  };

  // Submit new order
  const handleAddOrder = async () => {
    if (!newOrder.customerId) {
      alert('Please select a customer');
      return;
    }
    if (newOrder.items.some((item) => !item.name || item.quantity <= 0 || item.price < 0)) {
      alert('Please fill all item fields correctly');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/orders', newOrder);
      alert('Order added');
      setNewOrder({ customerId: '', amount: 0, items: [{ name: '', quantity: 1, price: 0 }] });
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('Failed to add order');
    }
  };

  // Delete order
  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/orders/${id}`);
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('Failed to delete order');
    }
  };

  // Open edit modal with order data
  const openEditModal = (order) => {
    // Clone the order to avoid direct mutation
    setEditOrder({
      ...order,
      items: order.items.map((item) => ({ ...item })),
    });
  };

  // Handle edit order item changes
  const handleEditItemChange = (index, field, value) => {
    const updatedItems = [...editOrder.items];
    updatedItems[index][field] = field === 'name' ? value : Number(value);
    setEditOrder({
      ...editOrder,
      items: updatedItems,
      amount: calculateAmount(updatedItems),
    });
  };

  // Add new item row in edit modal
  const addEditItem = () => {
    setEditOrder({
      ...editOrder,
      items: [...editOrder.items, { name: '', quantity: 1, price: 0 }],
    });
  };

  // Remove item row in edit modal
  const removeEditItem = (index) => {
    const updatedItems = editOrder.items.filter((_, i) => i !== index);
    setEditOrder({
      ...editOrder,
      items: updatedItems,
      amount: calculateAmount(updatedItems),
    });
  };

  // Submit edited order update
  const submitEdit = async () => {
    if (!editOrder.customerId) {
      alert('Customer is required');
      return;
    }
    if (editOrder.items.some((item) => !item.name || item.quantity <= 0 || item.price < 0)) {
      alert('Please fill all item fields correctly');
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/orders/${editOrder._id}`, editOrder);
      alert('Order updated');
      setEditOrder(null);
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('Failed to update order');
    }
  };


//   const [filters, setFilters] = useState({
//   email: '',
//   startDate: '',
//   endDate: '',
//   minAmount: '',
//   maxAmount: ''
// });

// const fetchOrders = async (filterParams = {}) => {
//   const query = new URLSearchParams(filterParams).toString();
//   const res = await axios.get(`http://localhost:5000/api/orders?${query}`);
//   setOrders(res.data);
// };

// useEffect(() => {
//   fetchOrders();
// }, []);

// const handleFilterChange = (field, value) => {
//   const newFilters = { ...filters, [field]: value };
//   setFilters(newFilters);
//   fetchOrders(newFilters);
// };


  return (
    
    <div className="orders-container">
      <h1>Orders</h1>

      {/* Search by customer email */}
      <input
        type="text"
        placeholder="Search by customer email"
        value={searchEmail}
        onChange={(e) => setSearchEmail(e.target.value)}
        style={{ marginBottom: '20px', padding: '8px', width: '300px' }}
      />

      {/* New Order Form */}
      <div className="new-order-form">
        <h2>Add New Order</h2>

        <select
          value={newOrder.customerId}
          onChange={(e) => setNewOrder({ ...newOrder, customerId: e.target.value })}
          required
        >
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} ({c.email})
            </option>
          ))}
        </select>

        {newOrder.items.map((item, idx) => (
          <div key={idx} className="item-input">
            <input
              placeholder="Item Name"
              value={item.name}
              onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
              required
            />
            <input
              type="number"
              min="1"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
              required
            />
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Price"
              value={item.price}
              onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
              required
            />
          </div>
        ))}
        <button type="button" onClick={addItem} style={{ marginTop: '8px' }}>
          Add Item
        </button>

        <p>
          <strong>Total Amount:</strong> ₹{newOrder.amount.toFixed(2)}
        </p>

        <button type="button" onClick={handleAddOrder}>
          Submit Order
        </button>
      </div>

      {/* Orders List */}
      <div className="orders-list">
        <h2>Existing Orders</h2>
        {filteredOrders.length === 0 && <p>No orders found</p>}
        {filteredOrders.map((order) => (
          <div className="order-card" key={order._id}>
            <h3>
              Customer: {order.customerId?.name} ({order.customerId?.email})
            </h3>
            <p>Amount: ₹{order.amount.toFixed(2)}</p>
            <p>Date: {new Date(order.orderDate).toLocaleString()}</p>
            <ul>
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} - {item.quantity} x ₹{item.price}
                </li>
              ))}
            </ul>
            <button onClick={() => openEditModal(order)}>Edit</button>{' '}
            <button onClick={() => handleDeleteOrder(order._id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* Edit Order Modal */}
      {editOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Order</h2>

            <select
              value={editOrder.customerId}
              onChange={(e) => setEditOrder({ ...editOrder, customerId: e.target.value })}
              required
            >
              <option value="">Select Customer</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>

            {editOrder.items.map((item, idx) => (
              <div key={idx} className="item-input">
                <input
                  placeholder="Item Name"
                  value={item.name}
                  onChange={(e) => handleEditItemChange(idx, 'name', e.target.value)}
                  required
                />
                <input
                  type="number"
                  min="1"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) => handleEditItemChange(idx, 'quantity', e.target.value)}
                  required
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => handleEditItemChange(idx, 'price', e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => removeEditItem(idx)}
                  disabled={editOrder.items.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}

            <button type="button" onClick={addEditItem}>
              Add Item
            </button>

            <p>
              <strong>Total Amount:</strong> ₹{editOrder.amount.toFixed(2)}
            </p>

            <button type="button" onClick={submitEdit}>
              Save Changes
            </button>
            <button type="button" onClick={() => setEditOrder(null)} style={{ marginLeft: '10px' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;












// const [filters, setFilters] = useState({
//   email: '',
//   startDate: '',
//   endDate: '',
//   minAmount: '',
//   maxAmount: ''
// });

// const fetchOrders = async (filterParams = {}) => {
//   const query = new URLSearchParams(filterParams).toString();
//   const res = await axios.get(`http://localhost:5000/api/orders?${query}`);
//   setOrders(res.data);
// };

// useEffect(() => {
//   fetchOrders();
// }, []);

// const handleFilterChange = (field, value) => {
//   const newFilters = { ...filters, [field]: value };
//   setFilters(newFilters);
//   fetchOrders(newFilters);
// };

// return (
//   <div className="filters">
//     <input
//       type="text"
//       placeholder="Search by customer email"
//       value={filters.email}
//       onChange={(e) => handleFilterChange('email', e.target.value)}
//     />
//     <input
//       type="text"
//       value={filters.startDate}
//       onChange={(e) => handleFilterChange('startDate', e.target.value)}
//     />
//     <input
//       type="date"
//       value={filters.endDate}
//       onChange={(e) => handleFilterChange('endDate', e.target.value)}
//     />
//     <input
//       type="number"
//       placeholder="Min amount"
//       value={filters.minAmount}
//       onChange={(e) => handleFilterChange('minAmount', e.target.value)}
//     />
//     <input
//       type="number"
//       placeholder="Max amount"
//       value={filters.maxAmount}
//       onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
//     />
//   </div>
// );
