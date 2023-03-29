const express = require('express')
const request = require('request')
const app = express()

const FORGE_CLIENT_ID = 'IZfMruLNJJOzoJtz5Gb9RkFPWnYfk3St';
const FORGE_CLIENT_SECRET = 'VGGWJKx3YNvLA1hM';
const FORGE_CALLBACK_URL = 'http://localhost:3000/api/forge/callback/oauth';


const url =
 'https://developer.api.autodesk.com' +
 '/authentication/v1/authorize' +
 `?response_type=code` +
 `&client_id=${FORGE_CLIENT_ID}` +
 `&redirect_uri=${encodeURIComponent(FORGE_CALLBACK_URL)}` +
 `&scope=data:read data:write data:create data:search bucket:create bucket:read`;

 app.get('/api/forge',(req,res)=>{
    res.redirect(url);
 })


 app.get('/api/forge/callback/oauth',(req,res)=>{
    const code = req.query.code;

    const options = {
        method: 'POST',
        url: 'https://developer.api.autodesk.com/authentication/v1/gettoken',
        form: {
          grant_type: 'authorization_code',
          code: code,
          client_id: FORGE_CLIENT_ID,
          client_secret: FORGE_CLIENT_SECRET,
          redirect_uri: FORGE_CALLBACK_URL
        }
      };
      
      request(options, (error, response, body) => {
        if (error || response.statusCode !== 200) {
          res.send('Error: cannot get access token');
          return;
        }
      
        const data = JSON.parse(body);
        access_token = data.access_token;
        refresh_token = data.refresh_token;

        console.log(`Access token: ${access_token}`, `refresh token: ${refresh_token}`)

        const optionss = {
            method: 'POST',
            url: 'https://developer.api.autodesk.com/authentication/v1/refreshtoken',
            form: {
              grant_type: 'refresh_token',
              refresh_token: refresh_token,
              client_id: FORGE_CLIENT_ID,
              client_secret: FORGE_CLIENT_SECRET
            }
          };
          
          request(optionss, (error, response, boddy) => {
            if (error || response.statusCode !== 200) {
                console.log('response',res)
                response.send('Error: cannot refresh access token');
              return;
            }
          
            const data = JSON.parse(boddy);
            access = data.access_token;
            refresh = data.refresh_token;
            console.log('data:' + refresh)  
            res.send(`'access token get successfully updated',${refresh}`)
            return
          });
      });

 })

 app.listen(3000, () => {
  console.log('Server started on port 3000')});

  