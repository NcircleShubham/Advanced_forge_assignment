const express = require('express')
const {getAccessToken} = require('./auth/index.js')
const {checkBucketExists, createBucket} = require('./bucket/index.js')
const {uploadFile} = require('./upload/index.js')
const {copyObject} = require('./copyobj/index.js')
const { deleteObject } = require('./deleteObj/index.js')
const app = express()

let bucketName = 'forgeapimy-bucket0989'
let filePath = './skyscrapers.obj'
let objectName = 'skyscrapers.obj'
let newObjectName = 'skyscrapers.obj'
app.get('/', (req, res) => {
    getAccessToken(async(err, accessToken) => {
      if (err) {
                (err)
                res.status(500).send('error occurres while creating access token')
                return ;
        }
        (`Access token: ### ${accessToken}###`)
        accessToken =await  accessToken;
        console.log(accessToken)
        checkBucketExists(accessToken,bucketName,(err,exists)=>{
            if(err){
                (err);
                res.status(500).send('Error occcured while checking for existing Bucket')
                return ;
            }
            if(!exists){
                (`${bucketName} not found!`);}    //if bucket found
            if(exists) {
                (`Bucket ${bucketName} already exists!`);
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
                        (`Bucket with name ${bucketName} created successfully!`);
                        res.send(`Bucket with name ${bucketName} created successfully`);
                        return;
                    }  
                });
            }
        })
        
    })
})
console.log("line no 51")
//uploading the file
app.get('/upload', (req, res) => {
    console.log("Line no 54",filePath,bucketName, objectName)
    uploadFile(filePath, bucketName, objectName);
    res.send('File upload started');
  });

  app.get('/copyObject', (req, res) => {
    copyObject(bucketName, objectName ,newObjectName);
    res.send('Object copy suceesfully created successfully')
    if(newObjectName){
        objectName = newObjectName
        console.log(objectName)
    }
  })

  app.get('/deleteObject', (req, res) => {
    deleteObject(bucketName,objectName)
    res.send(`${objectName}are deleted successfully`)
  })
  app.listen(3000,async()=>{

    try {
    console.log('server listening on port 3000')
    } catch (error) {
        console.log(error)
    }

  })

