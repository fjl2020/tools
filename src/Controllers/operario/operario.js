const db=require('../../Utils/database');
const httpMsgs=require('../../Utils/httpMsgs');

operario={};


operario.getOperarios=(req,res)=>{
    const {DSP_Numero} =req.body
    db.executeSql("select per.IDPERSONA,op.IDOPERARIO,"+
    "per.nombre,per.apellido1,per.apellido2"+
    " from dbo.PERSONAS as per inner join dbo.OPERARIOS AS op ON op.IDPERSONA=per.IDPERSONA",
    (data,err)=>{
        if(err)
        {
            httpMsgs.show500(req,res,err);
        }else{
            var dataToSend=[];
            data.recordsets[0].forEach(element => {
                dataToSend.push({
                    IDOPERARIO:element.IDOPERARIO,
                    IDPERSONA:element.IDPERSONA,
                    Nombre:element.nombre.trim()+" "+element.apellido1.trim()+" "+element.apellido2.trim()
                })

            }); 
            const datos={
                data:dataToSend
            }
            db.executeSql("update Stack SET STK_Estado=2 where STK_Accion LIKE '%getOperario%' AND STK_IdDispositivoDestino="
                +DSP_Numero,
                (data,err)=>{
                    if(err)
                    {
                        console.log('error :',err);
                    }else{
                        console.log('marco ok');
                    }});

            
            httpMsgs.sendJsonMsg(req,res,'exito',{data:dataToSend});
        }
    });
}

module.exports=operario;

