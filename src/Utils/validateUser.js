const jwt=require('jsonwebtoken');
const CryptoJS = require('crypto-js');

const httpMsgs=require('./httpMsgs');

async function validateUser(req,res,next){
//    console.log(req.headers);
    // let jwtEncrypt=req.headers['x-access-token']    
    // console.log(jwtEncrypt);
    // let token= CryptoJS.AES.decrypt(jwtEncrypt,'sc2020').toString(CryptoJS.enc.Utf8)
    // console.log(token);
    // jwt.verify(JSON.parse(token).token,req.app.get('key'),function (err,decoded){
    jwt.verify(req.headers['x-access-token'],req.app.get('key'),function (err,decoded){
        if (err){
            // res.json({'estado':'error',mensaje:err.message,data:null});
            httpMsgs.sendJsonMsg(req,res,'Error',err.message)
        }else
        {   
            req.body.DSP_Numero=decoded.DSP_Numero
            req.body.DSP_Rol=decoded.DSP_Rol;
            req.body.DSP_IdPersona=parseInt(decoded.DSP_IdPersona);
            // console.log('rol',req.body.DSP_Rol);
            next();
        }
    });
}
module.exports=validateUser;