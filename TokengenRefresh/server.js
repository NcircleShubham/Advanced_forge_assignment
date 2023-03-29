// const express = require('express');
// const request = require('request');
// const fs = require('fs');
// const app = express();

// // Forge configuration
// const FORGE_CLIENT_ID = 'IZfMruLNJJOzoJtz5Gb9RkFPWnYfk3St';
// const FORGE_CLIENT_SECRET = 'VGGWJKx3YNvLA1hM';
// const FORGE_CALLBACK_URL = 'http://localhost:3000/api/forge/callback/oauth';

// // Store the access token and refresh token
// let access_token = null;
// let refresh_token = null;

// // Routes
// app.get('/api/forge/oauth', (req, res) => {
//   const url =
//     'https://developer.api.autodesk.com' +
//     '/authentication/v1/authorize' +
//     `?response_type=code` +
//     `&client_id=${FORGE_CLIENT_ID}` +
//     `&redirect_uri=${encodeURIComponent(FORGE_CALLBACK_URL)}` +
//     `&scope=data:read data:write data:create data:search bucket:create bucket:read`;

//   res.redirect(url);
// });


// app.get('/api/forge/callback/oauth', (req, res) => {
//   const code = req.query.code;
//   if (!code) {
//     res.send('Error: missing code');
//     return;
//   }

//   const options = {
//     method: 'POST',
//     url: 'https://developer.api.autodesk.com/authentication/v1/gettoken',
//     form: {
//       grant_type: 'authorization_code',
//       code: code,
//       client_id: FORGE_CLIENT_ID,
//       client_secret: FORGE_CLIENT_SECRET,
//       redirect_uri: FORGE_CALLBACK_URL
//     }
//   };

//   request(options, (error, response, body) => {
//     if (error || response.statusCode !== 200) {
//       res.send('Error: cannot get access token');
//       return;
//     }

//     const data = JSON.parse(body);
//     access_token = data.access_token;
//     refresh_token = data.refresh_token;

//     fs.writeFile('tokens.json', JSON.stringify(data), (err) => {
//     if (err) throw err;
//     console.log('Access Token & Refresh Token are saved to file!');
//     });

//     console.log(`Access Token: ${access_token}`);
//     console.log(`Refresh Token: ${refresh_token}`);
//     res.send('Authentication successful!');

//   });
  
// });

// Start server
// app.listen(3000, () => {
//   console.log('Server started on port 3000')});