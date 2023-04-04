const express = require('express')
const {getAccessToken} = require('./auth/index.js')
const {checkBucketExists, createBucket} = require('./bucket/index.js')
const {uploadFile} = require('./upload/index.js')
const app = express()

const bucketName = 'forgeapimy-bucket7'
const filePath = './skyscrapers.obj'
const objectName = 'skyscrapers.obj'

app.get('/', (req, res) => {
    getAccessToken(async(err, accessToken) => {
      if (err) {
                console.log(err)
                res.status(500).send('error occurres while creating access token')
                return ;
        }
        console.log(`Access token: ### ${accessToken}###`)
        accessToken =await  accessToken;
        checkBucketExists(accessToken,bucketName,(err,exists)=>{
            if(err){
                console.log(err);
                res.status(500).send('Error occcured while checking for existing Bucket'
                )
                return ;
            }
            if(!exists){
                console.log(`${bucketName} not found!`);
            }    //if bucket found
            if(exists) {
                console.log(`Bucket ${bucketName} already exists!`);
                res.send(`Bucket ${bucketName} already exists`);
                return;
            }else{
                //creating bucket if not found.
                createBucket(accessToken, bucketName, (err, response) => {
                    if(err){
                        console.error(err);
                        res.status(500).send('Error occurred while creating new bucket')
                        return;
                    } else {
                        console.log(`Bucket with name ${bucketName} created successfully!`);
                        res.send(`Bucket with name ${bucketName} created successfully`);
                        return;
                    }  
                });
            }
        })
        
    })
})

//uploading the file
app.get('/upload', (req, res) => {
    uploadFile(filePath, bucketName, objectName);
    res.send('File upload started');
  });

app.listen(3000,async(req,res)=>{

    try {
    console.log('server listening on port 3000')
    } catch (error) {
        console.log(error)
    }

})

