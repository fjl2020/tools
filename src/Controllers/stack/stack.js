const db=require('../../Utils/database');
const httpMsgs=require('../../Utils/httpMsgs');
const tables=require('../../Models/tables')
const util=require('util')
const helpers=require('../../Utils/helpers')
stack={};


stack.getStack=(req,res)=>{
    console.log(req.body);
    var sqlStr="SELECT * FROM dbo.stack";
    db.executeSql(sqlStr,(data,err)=>{
        if(err)
        {
            httpMsgs.show500(req,res,err);
        }else{
            httpMsgs.sendJsonMsg(req,res,"exito",data.recordsets[0])
        }
    });

    

}
stack.getStackByIdDispositivo=(req,res)=>{
    // console.log(req.body);
    const {DSP_Numero}=req.body;
    var sqlStr="SELECT * FROM dbo.stack WHERE STK_IdDispositivoDestino="+DSP_Numero;
    sqlStr+=" AND STK_Estado=0";// ORDER BY STK_Fecha desc"
    db.executeSql(sqlStr,(data,err)=>{
        if(err)
        {
            httpMsgs.show500(req,res,err);
        }else{
            var datos=[];
            // console.log(data.recordsets[0]);
            data.recordsets[0].forEach(element => {
                var d=new Date(element.STK_Fecha);
                datos.push({
                    STK_Id:parseInt(element.STK_Id),
                    STK_Fecha:d.getTime(),
                    STK_Estado:element.STK_Estado,
                    STK_IdDispositivoDestino:element.STK_IdDispositivoDestino.trim(),
                    STK_Accion:element.STK_Accion
                })
            });
            httpMsgs.sendJsonMsg(req,res,"exito",{data:datos})
        }
    });
}
stack.stackAgregar=(req,res)=>{
    const {
        STK_Fecha,
        STK_FechaUpdate,
        STK_Estado,
        STK_IdDispositivoDestino,
        STK_Accion,
        DSP_Numero,
    }=req.body
    var sqlStr="DECLARE @RETURN_VAL INT;"; 
    sqlStr+="EXEC @RETURN_VAL= dbo.insertStack ";
    sqlStr+=util.format("@stk_Fecha='%s',",helpers.tsToStr(STK_Fecha))
    sqlStr+=util.format("@stk_Fecha_Update='%s',",helpers.tsToStr(STK_FechaUpdate))
    sqlStr+=util.format("@stk_estado=%d,",STK_Estado)
    sqlStr+=util.format("@stk_idDispositivoDestino='%s',",STK_IdDispositivoDestino)
    sqlStr+=util.format("@stk_Accion='%s'",STK_Accion)+";"
    sqlStr+="SELECT @RETURN_VAL as id;";
    // console.log(sqlStr);
    db.executeSql(sqlStr,(data,err)=>{
        if(err)
        {
            httpMsgs.show500(req,res,err);
        }else{
            // console.log('data',data);
            var existe=(data.recordset[0].id);
            // console.log(existe);
            stackRet={
                id:existe,
                msg:existe>0?"Stack agregado":"Stack Existe"
            }
            httpMsgs.sendJsonMsg(req,res,"exito",stackRet)
            
        }
    });

}
stack.stackRecibido=(req,res)=>{
    // console.log(req.body);
    const {DSP_Numero,STK_Id}=req.body;
    var stks="-1,"
    if (STK_Id instanceof Array)
    {
        STK_Id.forEach(st=>{
            stks+=""+st+","
        })
        stks+='-1'
        
    }else{

        stks+=STK_Id
    }
    var sqlStr="UPDATE dbo.stack  SET STK_ESTADO=1 WHERE STK_Id IN ("+stks+") AND STK_IdDispositivoDestino="+DSP_Numero;
    db.executeSql(sqlStr,(data,err)=>{
        if(err)
        {
            httpMsgs.show500(req,res,err);
        }else{
            httpMsgs.sendJsonMsg(req,res,"exito","Cumplido")
        }
    });

}
module.exports=stack;