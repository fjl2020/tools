const db=require('../../Utils/database');
const httpMsgs=require('../../Utils/httpMsgs');
const tables=require('../../Models/tables')

maquina={};


maquina.getMaquinas=(req,res)=>{
    const {DSP_Numero}=req.body;
    db.executeSql("SELECT TOP 1000 * FROM "+tables.table_maquinas,
    (data,err)=>{
        if(err)
        {
            httpMsgs.show500(req,res,err);
        }else{
            var datos=[];
           data.recordsets[0].forEach(element => {
               datos.push({
                'IDMAQUINA':element.IDMAQUINA,
                'NOMBRE':element.NOMBRE,
                'PHVENTA':element.PHVENTA,
                'TIPOMAQUINA':element.TIPOMAQUINA,
                'FACTURABLE':(element.FACTURABLE)?1:0,
                'PHCOSTE':element.PHCOSTE,

               });
           });
           db.executeSql("update Stack SET STK_Estado=2 where STK_Accion LIKE '%getMaquina%' AND STK_IdDispositivoDestino="
           +DSP_Numero,
           (data,err)=>{
               if(err)
               {
                   console.log('error :',err);
               }else{
                   console.log('marco ok');
               }});

            httpMsgs.sendJsonMsg(req,res,'exito',{data:datos});
        }

    });
    // console.log('getOperarios')
    
    
}

module.exports=maquina;

