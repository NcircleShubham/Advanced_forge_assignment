const { default: axios } = require("axios");
const { getAccessToken } = require("../auth");
// const { accessToken } = require("../auth")
let accessToken ;

getAccessToken((err,token)=>{
    if(err){
        (err)
        return;
    }
    accessToken = token;
    });

const copyObject = async (BUCKET_NAME,OBJECT_NAME,NEWOBJ_KEY,callback) => {
    console.log(BUCKET_NAME,OBJECT_NAME,NEWOBJ_KEY)
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': `application/octet-stream`,
    }
    const url =`https://developer.api.autodesk.com/oss/v2/buckets/${BUCKET_NAME}/objects/${OBJECT_NAME}/copyto/${NEWOBJ_KEY}`
    try {
        await axios.put(url,null, {headers}).then((res)=>{
            const found = res.data.objectKey
            console.log("NEWOBJ_KEY",found)
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {copyObject}