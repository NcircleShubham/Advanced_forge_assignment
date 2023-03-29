const express = require('express');
const request = require('request');
const fs = require('fs');

const app = express();

const FORGE_CLIENT_ID = 'IZfMruLNJJOzoJtz5Gb9RkFPWnYfk3St';
const FORGE_CLIENT_SECRET = 'VGGWJKx3YNvLA1hM';
const FORGE_CALLBACK_URL = 'http://localhost:3000/api/forge/callback/oauth';
const FORGE_API_BASE_URL = 'https://developer.api.autodesk.com';

let access_token = null;
let refresh_token = null;
const scopes = [
  'data:read',
  'data:write',
  'data:create',
  'data:search',
  'bucket:create',
  'bucket:read',
  'bucket:update'
];
const scope = encodeURIComponent(scopes.join(' '));
if (fs.existsSync('tokens.json')) {
  const tokens = JSON.parse(fs.readFileSync('tokens.json'));
  access_token = tokens.access_token;
  refresh_token = tokens.refresh_token;
}

// Routes

app.get('/api/forge/oauth', (req, res) => {
    const url =
      FORGE_API_BASE_URL +
      '/authentication/v1/authorize' +
      `?response_type=code` +
      `&client_id=${FORGE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(FORGE_CALLBACK_URL)}` +
      `&scope=${scope}`;
  
    res.redirect(url);
  });

  
app.get('/api/forge/callback/oauth', (req, res) => {
    const code = req.query.code;
  
    const options = {
      method: 'POST',
      url: `${FORGE_API_BASE_URL}/authentication/v1/gettoken`,
      form: {
        grant_type: 'authorization_code',
        code,
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
  
      fs.writeFile('tokens.json', JSON.stringify(data), (err) => {
        if (err) throw err;
        console.log('Access Token & Refresh Token are saved to file!');
      });
  
      console.log(`Access Token: ${access_token}`);
      console.log(`Refresh Token: ${refresh_token}`);
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
      
      });
      res.redirect('/createBucket');
    });
  });
  

// Create a new bucket with the specified name and region
const  createBucket = async(bucketName, region) => {
 return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      url: `${FORGE_API_BASE_URL}/oss/v2/buckets`,
      headers: {
        Authorization: `Bearer ${access_token}`
      },
      json: true,
      body: {
        bucketKey: bucketName,
        policyKey: 'transient',
        region
      }
    };
    
    request(options, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        reject(error || body);
      } else {
        resolve(body);
      }

    });
  });

}


app.get('/createBucket', async (req, res) => {

  try {
    // Create a new bucket for the project
    const projectName = 'myProject';
    const region = 'us';
    const bucketName = `${projectName}_${region}`;
    console.log('Creating bucket', bucketName);

    await createBucket(bucketName, region);
    console.log(bucketName,"118")

    res.status(200).send(`Bucket ${bucketName} created successfully!`);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating bucket');
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
