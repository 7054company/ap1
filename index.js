const express = require('express');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();

// Passport OAuth2 Strategy for GitHub
passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: 'https://github.com/login/oauth/authorize',
      tokenURL: 'https://github.com/login/oauth/access_token',
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.REDIRECT_URI,
    },
    function (accessToken, refreshToken, profile, done) {
      if (!accessToken) {
        return done(new Error('Access token is missing'));
      }
      return done(null, { accessToken, profile });
    }
  )
);

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

let temporaryCode = '';

app.get('/', (req, res) => {
  res.send('<a href="/auth">Log in with GitHub</a>');
});

// OAuth2 login
app.get('/auth', passport.authenticate('oauth2', { scope: ['user', 'read:user'] }));

app.get(
  '/auth/callback',
  async (req, res, next) => {
    temporaryCode = req.query.code;
    if (!temporaryCode) {
      return res.status(400).send('No code received');
    }
    next();
  },
  passport.authenticate('oauth2', { failureRedirect: '/' }),
  async (req, res) => {
    try {
      const tokenResponse = await axios.post(
        'https://github.com/login/oauth/access_token',
        null,
        {
          params: {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code: temporaryCode,
          },
          headers: {
            Accept: 'application/json',
          },
        }
      );

      const accessToken = tokenResponse.data.access_token;

      if (!accessToken) {
        return res.status(400).send('Access token is missing');
      }

      // Write the token to a file in the tmp directory
      const tokenPath = path.join('/tmp', 'data.txt');
      fs.writeFileSync(tokenPath, accessToken);
      console.log('Access Token successfully written to /tmp/data.txt');

      // Fetch user data from GitHub API
      const userResponse = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      res.json(userResponse.data);
    } catch (error) {
      console.error('Error during GitHub OAuth callback:', error);
      res.redirect('/');
    }
  }
);

// Profile route to display authenticated user info
app.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }

  // Read the token from the tmp directory
  const tokenPath = path.join('/tmp', 'data.txt');
  if (!fs.existsSync(tokenPath)) {
    return res.status(400).send('Access token not found');
  }

  const accessToken = fs.readFileSync(tokenPath, 'utf-8');
  if (!accessToken) {
    return res.status(400).send('Access token is missing');
  }

  // Fetch user data from GitHub API
  axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  .then(userResponse => res.json(userResponse.data))
  .catch(error => {
    console.error('Error fetching user profile:', error);
    res.status(500).send('Error fetching user profile');
  });
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
