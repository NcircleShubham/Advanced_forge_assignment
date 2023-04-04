const fs = require('fs');

const path = require('path');
const { getAccessToken } = require('../auth');
const { default: axios } = require('axios');

let accessToken;

getAccessToken((err,token)=>{
if(err){
    console.log(err)
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
            console.log('upload 22')
            await axios.put(url, chunk, {headers});
            console.log(`Uploded chunk ${chunkIndex +1} of ${numberOfChunks}`)
        }catch(error){
            console.log(`failed to upload chunk ${chunkIndex +1} of ${numberOfChunks}: ${error.message}`)
            throw error
        }
    }

    console.log(`File '${path.basename(filePath)}'uploaded successfully!`)
}

module.exports = {uploadFile};

