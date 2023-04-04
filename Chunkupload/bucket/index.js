const request = require('request');
const axios = require('axios');
const REGION = 'US';

//Function to check the bucket
function checkBucketExists(accessToken, BUCKET_NAME, callback) {
    //sending GET request using the axios with access token & url in the header
    axios.get('https://developer.api.autodesk.com/oss/v2/buckets', {
    headers: {
    'Authorization': `Bearer ${accessToken}`
  }
    }).then((response) => {
    //checking the name of bucket in response
    const foundBucket = response.data.items.find((bucket) => bucket.bucketKey === BUCKET_NAME);

    console.log(response.data)
    if (foundBucket) {
        //if bucket found, sending true using callback function
        callback(null, true);
    } else {
        //if not bucket found, sending false using callback function
        callback(null, false);
    }
    }).catch((error) => {
    console.error(error);
    });

}

//Function to create new bucket
function createBucket(accessToken, BUCKET_NAME, callback) {
    const options = {
        url: 'https://developer.api.autodesk.com/oss/v2/buckets',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            bucketKey: BUCKET_NAME,
            policyKey: 'transient',
            region: REGION,
        }),
    };

    //sending POST request by relevant header and body
    request.post(options, (err, resp, body) => {
        if (err) {
          return callback(err);
        }
        if (resp.statusCode !== 200 && resp.statusCode !== 201) {
          return callback(new Error(`Failed to create bucket. Status code: ${resp.statusCode}. Body: ${body}`));
        } else{
            callback(null, resp);
        }
      });
}
module.exports = {
    checkBucketExists,
    createBucket
};