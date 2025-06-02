import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './Home.css';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/me', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error('Error fetching user:', err));
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:to-gray-800 p-6 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl p-8 w-full max-w-3xl border border-gray-200 dark:border-gray-700 text-center"
      >
        {/* <motion.img
          src={user.photo}
          alt="Profile"
          className="w-28 h-28 rounded-full mx-auto mb-5 shadow-lg border-4 border-blue-500"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/100';
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 120 }}
        /> */}

       <motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ type: 'spring', stiffness: 120 }}
  className="flex justify-center mb-5"
>
  <img
    src={user.photo}
    alt="Profile"
    onError={(e) => {
      e.target.src = 'https://via.placeholder.com/100';
    }}
    className="profile-img"
  />
</motion.div>


        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          Welcome, {user.name.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Manage customers, campaigns, and insights all in one place.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {[
            { label: 'Customers', emoji: '🧑‍💼', color: 'blue' },
            { label: 'Campaigns', emoji: '📣', color: 'green' },
            { label: 'Segments', emoji: '🧩', color: 'yellow' },
            { label: 'Reports', emoji: '📊', color: 'purple' },
          ].map((card, index) => (
            <motion.div
              key={card.label}
              className={`rounded-2xl p-5 text-center text-white shadow-md bg-${card.color}-500 hover:bg-${card.color}-600 transition duration-300`}
              whileHover={{ scale: 1.05 }}
              transition={{ delay: index * 0.1 }}
            >
              <p className="text-3xl mb-2">{card.emoji}</p>
              <p className="font-semibold">{card.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
