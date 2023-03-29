const fs = require('fs');
const APS = require('forge-apis');
const {APS_CLIENT_ID,APS_CLIENT_SECRET} = require('../config')

let internalAuthclient = new APS.AuthClientTwoLegged(APS_CLIENT_ID,APS_CLIENT_SECRET,['bucket:read','bucket:create','data:read','data:write','data:create'])
let publicAuthClient = new APS.AuthClientTwoLegged(APS_CLIENT_ID, APS_CLIENT_SECRET, ['viewables:read'], true);

const service = module.exports ={};

service.getinternalToken = async() => {
    if(!internalAuthclient.isAuthorized()){
        await internalAuthclient.authenticate()
    }
    return internalAuthclient.getCredentials() 
}

service.getPublicToken = async() => {
    if(!publicAuthClient.isAuthorized()){

        await publicAuthClient.authenticate()
    console.log("Public Token")

    }

    return publicAuthClient.getCredentials()

}