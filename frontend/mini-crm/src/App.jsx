import { BrowserRouter, Routes, Route, NavLink,Navigate} from 'react-router-dom';
import { useState,useEffect } from 'react';
// import Home from './pages/Home';
import Customers from './pages/Customers';
import OrdersPage from './pages/OrdersPage';
import Campaigns from './pages/Campaign';
import SegmentForm from './pages/SegmentForm';
import DashBoard from './pages/Dashboard';
import Login from './pages/Login';
import LoginSuccess from './pages/LoginSuccess';
import HomePage from './pages/Home';
// import ProtectedRoute from './components/ProtectedRoute';
// import { useAuth } from "./components/AuthContext";

import './App.css';

function App() {
  // const { user } = useAuth();
  // console.log("user hai",user);
    const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // track fetch status

  useEffect(() => {
    fetch('https://mini-crmb.onrender.com/api/me', {
      credentials: 'include',
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setUser(data);
        setLoading(false);
        console.log("user hai", data);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>Loading...</h2>; // don't render routes yet

  
  return (
    <BrowserRouter>
      <nav className='navbar'>
        <NavLink to="/customers" className={({ isActive }) => isActive ? 'active-link' : ''}>Customers</NavLink>
        <NavLink to="/orders" className={({ isActive }) => isActive ? 'active-link' : ''}>Orders</NavLink>
        <NavLink to="/campaigns" className={({ isActive }) => isActive ? 'active-link' : ''}>Campaign</NavLink>
        <NavLink to="/segments" className={({ isActive }) => isActive ? 'active-link' : ''}>Segment</NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active-link' : ''}>Dashboard</NavLink>
      </nav>

      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/customers" element={<Customers />} />
        {/* <Route path="/customers" element={ <ProtectedRoute>
        <Customers />
      </ProtectedRoute>} /> */}


        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />}/>
{/* <Route path="/login" element={<Login />} /> */}
<Route path="/dashboard" element={user ? <DashBoard /> : <Navigate to="/login" />} />

        <Route path="/orders" element={user ? <OrdersPage /> :<Navigate to="/login" />} />
        <Route path="/segments" element={user ? <SegmentForm /> : <Navigate to="/login" />} />
        <Route path="/campaigns" element={user ? <Campaigns />:<Navigate to="/login" />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-success" element={<LoginSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
