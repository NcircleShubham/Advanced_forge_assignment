const fs = require('fs');
const ForgeSDK = require('forge-apis');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const CLIENT_ID = 'EhWZbNTySHAGqfaagryxlUDxmSbDnek4';
const CLIENT_SECRET = 'MuhsuRLdF0biSf6D';
const BUCKET_KEY = 'forgeapimy-bucket1';
const FILE_NAME = 'myProject_us';

let token = null;
let chunks = [];

async function getAccessToken() {
  const oAuth2TwoLegged = new ForgeSDK.AuthClientTwoLegged(CLIENT_ID, CLIENT_SECRET, [
    'data:read',
    'data:write',
    'data:create',
    'data:delete',
    'bucket:read',
    'bucket:write',
    'bucket:create',
    'data:search',
    'bucket:read',
    'bucket:create'
  ].join(' ')); 
  // <-- concatenate the array of scopes using join method

  const credentials = await oAuth2TwoLegged.authenticate();
  return credentials.access_token;
}

async function createBucket() {
  const bucketsApi = new ForgeSDK.BucketsApi();
  const policyKey = 'temporary';
  const createBucketJson = {
    'bucketKey': BUCKET_KEY,
    'policyKey': policyKey
  };
  const createBucketData = await bucketsApi.createBucket(createBucketJson, {}, null, token);
  console.log(createBucketData);
}


async function createObject() {
  const objectsApi = new ForgeSDK.ObjectsApi();
  const createObjectJson = {
    'name': FILE_NAME,
    'bucketKey': BUCKET_KEY
  };
  const createObjectData = await objectsApi.createObject(BUCKET_KEY, createObjectJson, {}, null, token);
  console.log(createObjectData);
}

async function mergeChunks() {
  const objectsApi = new ForgeSDK.ObjectsApi();
  const createObjectJson = {
    'name': FILE_NAME,
    'bucketKey': BUCKET_KEY,
    'objectSize': chunks.reduce((sum, chunk) => sum + chunk.length, 0)
  };
  const uploadIdData = await objectsApi.initializeUpload(BUCKET_KEY, createObjectJson, {}, null, token);
  console.log(uploadIdData);

  const parts = chunks.map((chunk, index) => ({
    'number': index + 1,
    'size': chunk.length
  }));

  const completeUploadData = await objectsApi.completeUpload(BUCKET_KEY, FILE_NAME, uploadIdData.body.uploadId, parts, {}, null, token);
  console.log(completeUploadData);
}

app.post('/upload', async (req,res) => {
  const { chunk, chunkNumber } = req.body;

  chunks[chunkNumber] = chunk;
  res.send('OK');

  if (chunks.length === parseInt(req.headers['total-chunks'])) {
    await mergeChunks();
    chunks = [];
  }
});


app.listen(port, async () => {
    try {
        token = await getAccessToken();
        await createBucket();
        await createObject();
        console.log(`Server listening at http://localhost:${port}`);
    } catch (error) {
        console.log(error)
    }
});
