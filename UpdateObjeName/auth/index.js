
const request = require('request');

const CLIENT_ID = 'EhWZbNTySHAGqfaagryxlUDxmSbDnek4';
const CLIENT_SECRET = 'MuhsuRLdF0biSf6D';

function getAccessToken(callback){

    const option={
        url:'https://developer.api.autodesk.com/authentication/v1/authenticate',
        header:{
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form:{
            client_id : CLIENT_ID,
            client_secret:CLIENT_SECRET,
            grant_type:'client_credentials',
            scope:'data:read data:write data:create bucket:create bucket:read bucket:delete account:read',
        },
    }
    request.post(option,(err,resp,body)=>{
        if(err){
            return callback(err);
        }
        if(resp.statusCode!==200){
        return callback(new Error(`Failed to obtained acess token. status code:${resp.statusCode}. Body:${body}`));
    }
const data = JSON.parse(body);
const accessToken = data.access_token;
callback(null,accessToken);
    })
}

module.exports = {
    getAccessToken
}

