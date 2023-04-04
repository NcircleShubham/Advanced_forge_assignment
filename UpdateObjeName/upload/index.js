const fs = require('fs');

const path = require('path');
const { getAccessToken } = require('../auth');
const axios = require('axios');
const { copyObject } = require('../copyobj');

let accessToken;

const NEWOBJ_KEY = 'rename-object';
getAccessToken((err,token)=>{
if(err){
    (err)
    return;
}
accessToken = token;
});

const CHUNK_SIZE = 5*1024*1024

const uploadFile = async (filePath, BUCKET_NAME,OBJECT_NAME,callback) =>{
    const fileSize = fs.statSync(filePath).size;
    const numberOfChunks = Math.ceil(fileSize/CHUNK_SIZE);
    const fileStream = fs.createReadStream(filePath)
    for(let chunkIndex = 0; chunkIndex < numberOfChunks; chunkIndex++){
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE,fileSize);
        const chunksize = Math.ceil(end - start)
        const chunk = fileStream.read(chunksize);
        const headers = {
            'Authorization':`Bearer ${accessToken}`,
            'Content-Type': `application/octet-stream`,
            'Content-Range':`bytes ${start}-${end - 1}/ ${fileSize}`,
        };
        const url = `https://developer.api.autodesk.com/oss/v2/buckets/${BUCKET_NAME}/objects/${OBJECT_NAME}`
        try{
            await axios.put( url,chunk,{headers});
                                                           
            // copyObject(accessToken,BUCKET_NAME,OBJECT_NAME,NEWOBJ_KEY,(err,exists)=>{
            //     console.log("BUCKET_NAME,OBJECT_NAME,NEWOBJ_KEY")
            //     if(err){
            //         console.log(err);
            //         res.status(500).send('Error occured while checking for existing Bucket')
            //     }
            //     if(!exists){
            //         console.log(`${BUCKET_NAME} need to upload`)
            //     }else{
            //    console.log(`${NEWOBJ_KEY} is updated successfully`)
            //     }
            // })
            console.log(`Uploded chunk ${chunkIndex +1} of ${numberOfChunks}`)
          
        }catch(error){
            console.log(`failed to upload chunk ${chunkIndex +1} of ${numberOfChunks}: ${error.message}`)
            throw error
        }
    }

    console.log(`File '${path.basename(filePath)}'uploaded successfully!`)
}

module.exports = {uploadFile};


