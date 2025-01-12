const express = require('express');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const axios = require('axios'); // For making API calls
require('dotenv').config();

const app = express();

// Passport OAuth2 Strategy for GitHub
passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: 'https://github.com/login/oauth/authorize', // GitHub Authorization URL
      tokenURL: 'https://github.com/login/oauth/access_token', // GitHub Token URL
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.REDIRECT_URI,
    },
    function (accessToken, refreshToken, profile, done) {
      // Pass along the access token and profile for future use
      return done(null, { accessToken, profile });
    }
  )
);

// Serialize user for session
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Middleware
app.use(
  require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Define a temporary storage for the code received in the callback
let temporaryCode = '';

// Routes
app.get('/', (req, res) => {
  res.send('<a href="/auth">Log in with GitHub</a>');
});

// OAuth2 login
app.get(
  '/auth',
  passport.authenticate('oauth2', { scope: ['user', 'read:user'] })
);

// Callback route where GitHub redirects after user login
app.get(
  '/auth/callback',
  async (req, res, next) => {
    // Capture the code from the query parameters
    temporaryCode = req.query.code;

    if (!temporaryCode) {
      return res.status(400).send('No code received');
    }

    // Proceed to the OAuth2 token exchange
    next();
  },
  passport.authenticate('oauth2', { failureRedirect: '/' }),
  async (req, res) => {
    try {
      // Exchange the code for an access token using GitHub's token URL
      const tokenResponse = await axios.post(
        'https://github.com/login/oauth/access_token',
        null,
        {
          params: {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code: temporaryCode, // Use the code saved in memory
          },
          headers: {
            Accept: 'application/json',
          },
        }
      );

      // Extract the access token from the response
      const accessToken = tokenResponse.data.access_token;

      // Fetch user data from GitHub API using the obtained access token
      const userResponse = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Display user profile information
      res.json(userResponse.data);
    } catch (error) {
      console.error(error);
      res.redirect('/'); // Redirect in case of an error
    }
  }
);

// Profile route to display authenticated user info
app.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.json(req.user);
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


console.log('Access Token:', accessToken);
