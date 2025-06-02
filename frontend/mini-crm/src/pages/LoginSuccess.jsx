import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginSuccess() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/me', {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then(data => {
        setUser(data);
      })
      .catch(err => {
        console.error('Error fetching user:', err);
      });
  }, []);

  // Redirect after user is set
  useEffect(() => {
    if (user) {
      navigate('/'); // React Router navigation
    }
  }, [user, navigate]);

  return <h2>Logging in...</h2>;
}
