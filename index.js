const express = require('express');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const axios = require('axios');
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
  '/auth/callback1',
  passport.authenticate('oauth2', { failureRedirect: '/' }),
  async (req, res) => {
    try {
      const temporaryCode = req.query.code; // Extract the code directly from the URL

      if (!temporaryCode) {
        console.error('No authorization code received');
        return res.status(400).send('No code received');
      }

      console.log('Received authorization code:', temporaryCode);

      // Prepare data for request to GitHub OAuth access token URL
      const requestData = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: temporaryCode,
      };

      const requestUrl = 'https://github.com/login/oauth/access_token';
      console.log('Request URL:', requestUrl);
      console.log('Request Data:', requestData);

      // Exchange the code for an access token using GitHub's token URL
      const tokenResponse = await axios.post(requestUrl, null, {
        params: requestData,
        headers: {
          Accept: 'application/json',
        },
      });

      // Log the response to the console for debugging
      console.log('Token Response:', tokenResponse.data);

      // Check if the access token is present in the response
      const accessToken = tokenResponse.data.access_token;

      // If no access token, log an error and display it on the page
      if (!accessToken) {
        console.error('Access token not received');
        return res.send(`
          <html>
            <body>
              <h1>Error: Access token not received</h1>
              <pre>
                Request URL: ${requestUrl}
                Request Data: ${JSON.stringify(requestData, null, 2)}
                Response: ${JSON.stringify(tokenResponse.data, null, 2)}
              </pre>
            </body>
          </html>
        `);
      }

      // Display the access token and response for debugging
      res.send(`
        <html>
          <body>
            <h1>Access Token Received:</h1>
            <pre>${accessToken}</pre>
            <p>Redirecting to profile...</p>
            <script>
              // Redirect after a brief delay for debugging
              setTimeout(function() {
                window.location.href = '/profile?accessToken=' + '${accessToken}';
              }, 2000); // Adjust the delay as needed
            </script>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Error during token exchange:', error);
      res.redirect('/'); // Redirect in case of an error
    }
  }
);



app.get('/auth/callback', (req, res) => {
  // The req.query object has the query params that
  // were sent to this route. We want the `code` param
  const requestToken = req.query.code
  axios({
    // make a POST request
    method: 'post',
    // to the Github authentication API, with the client ID, client secret
    // and request token
    url: `https://github.com/login/oauth/access_token?client_id=Ov23liDrVAJajOOviu2C&client_secret=6b368a2183d02483669632ed92e36a04c3284c49&code=${requestToken}`,
    // Set the content type header, so that we get the response in JSOn
    headers: {
      accept: 'application/json'
    }
  }).then((response) => {
    // Once we get the response, extract the access token from
    // the response body
    const accessToken = response.data.access_token
    // redirect the user to the welcome page, along with the access token
    res.redirect(`/profile?access_token=${accessToken}`)
  })
})


// Profile route to display authenticated user info
app.get('/profile', async (req, res) => {
  const accessToken = req.query.accessToken;

  if (!accessToken) {
    return res.status(400).send('No access token found');
  }

  try {
    // Fetch user profile information using the access token
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Display the user profile information
    res.json(userResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching user profile');
  }
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
