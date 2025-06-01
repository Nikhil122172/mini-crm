import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
// import Home from './pages/Home';
import Customers from './pages/Customers';
import OrdersPage from './pages/OrdersPage';
import Campaigns from './pages/Campaign';
import SegmentForm from './pages/SegmentForm';
import DashBoard from './pages/Dashboard';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <nav className='navbar'>
        <NavLink to="/customers" className={({ isActive }) => isActive ? 'active-link' : ''}>Customers</NavLink>
        <NavLink to="/orders" className={({ isActive }) => isActive ? 'active-link' : ''}>Orders</NavLink>
      </nav>

      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/customers" element={<Customers />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/segments" element={<SegmentForm />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/dashboard" element={<DashBoard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
