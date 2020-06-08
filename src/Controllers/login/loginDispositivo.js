const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const db = require('../../Utils/database');
const helpers = require('../../Utils/helpers');
// const logger = require('../Utils/logger');
const tables = require('../../Models/tables');
const httpMsgs=require('../../Utils/httpMsgs');
const util=require('util')

const loginController = {}


loginController.getLoginDisp = async (req, res) => {
    const { DSP_Numero,DSP_Password } = req.body;
    var {ts}=req.body;
    // console.log('llego login')
    if (DSP_Numero && DSP_Password) {

        sqlStr='SELECT * FROM ' + tables.table_dispositivos;
        sqlStr+=' WHERE DSP_Numero=';
        sqlStr+=util.format("'%s'",DSP_Numero);

        await db.executeSql(sqlStr,async (data,error)=>{
            if (error){
                //error de base datos
                httpMsgs.show500(req,res,error);
            }else
            {
                //sin errores 
                if (data==null)
                {
                    httpMsgs.sendJsonMsg(req,res,'Error','no hay datos');
                }else if (data.recordset.length==0)
                {
                    const nuevoDisp={
                        DSP_Numero,
                        DSP_Password,
                        DSP_Rol:0,
                        DSP_Activo:0, 
                        DSP_IdPersona:0
                    }
                    nuevoDisp.DSP_Password=await helpers.encryptPassword(DSP_Password);
                    console.log('longitud 0');
                    var sqlStr='INSERT INTO '+tables.table_dispositivos
                    +' (DSP_Numero,DSP_Password,DSP_idPersona,DSP_Activo,DSP_rol) VALUES ';
                    
                    sqlStr+=util.format("('%s','%s',%d,%d,%d)",
                        nuevoDisp.DSP_Numero,
                        nuevoDisp.DSP_Password,
                        nuevoDisp.DSP_IdPersona,
                        nuevoDisp.DSP_Activo,
                        nuevoDisp.DSP_Rol);
                    console.log(sqlStr)
                    await db.executeSql(sqlStr,(data,err)=>{
                        if (err){
                            console.log(err)
                            httpMsgs.show405(req,res,err);
                        }else{
                            console.log('datacreated',data)
                            httpMsgs.sendJsonMsg(req,res,'exito','dispositivo '+DSP_Numero+' creado');
                        }
                        
                    });
                    console.log('salida')
                }else
                {
                    //dispositivo existente 
                    // console.log(data.recordset[0])
                    var dispEncontrado=data.recordset[0];
                    var passwordAuth;
                    if (dispEncontrado.DSP_Password!=null && dispEncontrado.DSP_Password!="" 
                        && dispEncontrado.DSP_Password){
                            passwordAuth=await helpers.matchPassword(DSP_Password, dispEncontrado.DSP_Password);
                        }
                    if (passwordAuth){
                        if (dispEncontrado.DSP_Activo==1)
                        {

                            // console.log("dispoEnc",dispEncontrado)
                            const token =  jwt.sign({
                                    DSP_Numero: dispEncontrado.DSP_Numero,
                                    DSP_Rol: dispEncontrado.DSP_Rol,
                                    DSP_IdPersona: parseInt(dispEncontrado.DSP_IdPersona),
                                }, req.app.get('key'), { expiresIn: 60 * 60 });
                            httpMsgs.sendJsonMsg(req,res,'exito',token)
                            // let tokenEncode =null
                            // try{
                            //     //  if (!ts) ts=Date.now();
                            //     var tokenToSend=JSON.stringify({token:token})
                            //     // console.log(tokenToSend);
                            //     let tokenEncode= CryptoJS.AES.encrypt(tokenToSend, ts? 'sc2020' + ts.toString() : 'sc2020');
                            //     // let tokenEncode= CryptoJS.AES.encrypt('Test', 'sc2020');
                            //     // console.log(tokenEncode.toString());
                            //     httpMsgs.sendJsonMsg(req,res,'exito',tokenEncode.toString())
                            // }catch (e){
                                // console.log(e)
                                // httpMsgs.sendJsonMsg(req,res,'error',e)
                            // }
                            
                            

                        }else
                        {
                            httpMsgs.sendJsonMsg(req,res,'Error','Dispositivo no activo')
                        }
                        
                    }else{
                        httpMsgs.sendJsonMsg(req,res,'Error','Dispositivo no autorizado');
                    }
                    
                }

                
                //
            }
       });
    }else{
        console.log("falta parametros de entrada")
        httpMsgs.sendJsonMsg(req,res,'Error','falta parametros de entrada');
    }
}

module.exports = loginController;
