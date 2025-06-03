// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const customerRoutes = require('./routes/customerRoutes');
const isAuthenticated = require('./middlewares/authMiddleware');
const orderRoutes = require('./routes/orderRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
// const authRoutes = require('./routes/authRoutes');
const segmentRoutes = require('./routes/segment');

const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User'); 
const isCustomer = require('./middlewares/isCustomer');
const aiRoute = require('./routes/ai.js');
// import aiRoute from './routes/ai.js';

const app = express();
const PORT = process.env.PORT || 5000;

// app.use(cors());
app.use(cors({
  origin: 'https://mini-crm-edgj.onrender.com', // ✅ specify your frontend origin
  credentials: true                // ✅ allow cookies and credentials
}));

app.use(express.json());




// app.use(session({
//   secret: 'your_secret_key',  // isse replace kar dena kuch strong se
//   resave: false,
//   saveUninitialized: false,
// }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultSecretForDevOnly',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set to true if using https
    httpOnly: true,
    sameSite: 'lax'
  }
}));

app.use(passport.initialize());
app.use(passport.session());


// app.use('/api/campaigns', require('./routes/campaign'));

// User serialization (session me user store karne ke liye)
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

// passport.serializeUser((user, done) => {
//   done(null, user.id); // mongoDB _id
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });

// Google OAuth strategy setup
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK
},async function(accessToken, refreshToken, profile, done) {
  // Yahan pe aap user ko DB me save kar sakte ho agar chaho to
   try {
    const existingUser = await User.findOne({ googleId: profile.id });

    if (existingUser) {
      return done(null, existingUser); // Already registered
    }

    // New user save karo
    const newUser = new User({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      photo: profile.photos[0].value
    });

    const savedUser = await newUser.save();
    return done(null, savedUser);
  } catch (err) {
    return done(err, null);
  }
  console.log('Google profile:', profile);
  return done(null, profile);
}));



// app.use((req, res, next) => {
//   console.log('Session data:', req.session);
//   console.log('Authenticated:', req.isAuthenticated());
//   console.log('User:', req.user);
//   next();
// });


// Routes

// 1. Login route (redirects to Google login page)
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'],prompt: 'select_account',
    accessType: 'offline', }));

// 2. Callback route (Google redirects here after login)
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login-failure' }),
  function(req, res) {
    // Successful login, redirect where chahiye
    // res.redirect('http://localhost:5173/');
    res.redirect('http://localhost:5173/login-success');
  });

  app.get('/api/me', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json(req.user);
  }
  res.status(401).json({ error: 'Not logged in' });
});

// 3. Logout route
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Protected route example
app.get('/dashboard',isAuthenticated, (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send('Please login first');
  }
  res.send(`Welcome ${req.user.displayName}`);
});

app.get('/api/secret-data',isAuthenticated, (req, res) => {
  res.json({ secret: 'This is protected data for logged-in users only.' });
});


// Routes
// app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);

app.use('/api/segments', segmentRoutes);

// app.use('/api/campaigns', campaignRoutes);
app.use('/api/campaigns', require('./routes/campaignRoutes'));

app.use('/api', aiRoute);


// MongoDB connection
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB connected");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.log(err));
