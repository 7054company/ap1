app.get('/auth/callback', async (req, res) => {
  const requestToken = req.query.code;

  if (!requestToken) {
    console.error('No authorization code received');
    return res.status(400).send('No code received');
  }

  // Prepare request data with client ID, client secret, and code
  const requestData = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,  // Do not display this in debug logs
    code: requestToken,
  };

  const requestUrl = 'https://github.com/login/oauth/access_token';

  // Debugging without revealing sensitive info
  console.log('Request URL:', requestUrl);
  console.log('Request Data:', {
    client_id: requestData.client_id,
    client_secret: '**HIDDEN**',  // Hide the client secret
    code: requestData.code,
  });

  try {
    // Make the POST request to GitHub to exchange the code for an access token
    const tokenResponse = await axios.post(requestUrl, null, {
      params: requestData,
      headers: {
        Accept: 'application/json',
      },
    });

    // Log the response to check the received data
    console.log('Token Response:', tokenResponse.data);

    // Check if the access token is present
    const accessToken = tokenResponse.data.access_token;

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

    // Redirect to profile page with the access token
    res.redirect(`/profile?access_token=${accessToken}`);
  } catch (error) {
    console.error('Error during token exchange:', error);
    res.redirect('/'); // Redirect in case of an error
  }
});
