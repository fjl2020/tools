const db=require('../../Utils/database');
const httpMsgs=require('../../Utils/httpMsgs');
const tables=require('../../Models/tables')
const util=require('util')
const helpers=require('../../Utils/helpers')
movMaquina={};


movMaquina.getMovMaquinas=(req,res)=>{
    const {DSP_IdPersona,DSP_Numero}=req.body
    // console.log(req.body);
    var sqlStr="WITH ultimo_mov_maquinas (id_maquina,fecha) as "
        sqlStr+=" (  SELECT TOP (1000) IDMAQUINA,MAX(FECHA)"
        sqlStr+=" FROM "+tables.table_movMaquinas +" GROUP BY IDMAQUINA) "
        sqlStr+=" SELECT mm.IDMAQUINA,mm.FECHA,mm.IDOPERARIODESTINO FROM dbo.movmaquina AS mm "
        sqlStr+=" INNER JOIN ultimo_mov_maquinas AS umm ON mm.IDMAQUINA=umm.id_maquina AND mm.FECHA=umm.fecha "
        // sqlStr+=" where mm.IDOPERARIODESTINO="+util.format("%d",DSP_IdPersona);

    console.log(sqlStr);
    db.executeSql(sqlStr,
    (data,err)=>{
        if(err)
        {
            httpMsgs.show500(req,res,err);
        }else{
            var datos=[];
            // console.log(data.recordsets[0]);
            data.recordsets[0].forEach(el=>{
                var d=new Date(el.FECHA);
                datos.push({
                    IDMAQUINA:el.IDMAQUINA,
                    FECHA:d.getTime(),
                    IDOPERARIO:el.IDOPERARIODESTINO
                });
            })
            db.executeSql("UPDATE Stack SET STK_Estado=2 where STK_Accion LIKE '%getMovMaquinas%' "+
                "AND STK_IdDispositivoDestino="+DSP_Numero,
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
}
movMaquina.postMovMaquinas=(req,res)=>{
    const {
        idMaquina,
        idOperarioDest,
        idOperarioOrigen,
        idObraOrigen,
        idObraDest,
        tipoMov,
        fecha}=req.body
        var fTime=helpers.tsToStr(fecha);
        
    var sqlStr="SELECT * FROM "+tables.table_movMaquinas 
    sqlStr+=" WHERE  FECHA='"+fTime+"' AND IDMAQUINA="+idMaquina //+" AND IDOPERARIOORIGEN="+idOperarioOrigen
    console.log(sqlStr);
    db.executeSql(sqlStr,
       (data,err)=>{
            if(err)
            {
                console.log(err);
                httpMsgs.show500(req,res,err);
            }else{
                console.log("ok");
                if (data.rowsAffected[0]==0){
                    //inserto movimiento
                    sqlStr="INSERT INTO "+tables.table_movMaquinas
                    sqlStr+=" (IDMAQUINA,IDOPERARIODESTINO,IDOPERARIOORIGEN,IDOBRADESTINO,IDOBRAORIGEN,TIPOMOVIMIENTO,FECHA) VALUES ("
                    sqlStr+=util.format("%d,%d,%d,%d,%d,'%s','",idMaquina,idOperarioDest,idOperarioOrigen
                            ,idObraOrigen,idObraDest,tipoMov)+fTime+"'  )"
                }else{
                    // actualizo movimiento
                    sqlStr="UPDATE "+tables.table_movMaquinas+ " SET "
                    sqlStr+=" IDMAQUINA="+util.format("%d",idMaquina)+ ", "
                    sqlStr+=" IDOPERARIODESTINO="+util.format("%d",idOperarioDest)+ ", "
                    sqlStr+=" IDOPERARIOORIGEN="+util.format("%d",idOperarioOrigen)+ ", "
                    sqlStr+=" IDOBRADESTINO="+util.format("%d",idObraDest)+ ", "
                    sqlStr+=" IDOBRAORIGEN="+util.format("%d",idObraOrigen)+ ", "
                    sqlStr+=" TIPOMOVIMIENTO="+util.format("'%s'",tipoMov)+ ", "
                    sqlStr+=" FECHA='"+fTime+"' "
                    sqlStr+=" WHERE  FECHA='"+fTime+"' AND IDMAQUINA="+idMaquina//+" AND IDOPERARIOORIGEN="+idOperarioOrigen
                }
                // console.log(data);
                
                console.log(sqlStr);
                db.executeSql(sqlStr,
                    (data,err)=>{
                         if(err)
                         {
                             console.log(err);  
                                                          httpMsgs.show500(req,res,err);
                         }else{
                            httpMsgs.sendJsonMsg(req,res,"exito","movimiento agregado");
                         
                        }
                    }
                );

            }
        });
            // db.executeSql(sqlStr,
    //     (data,err)=>{
    //         if(err)
    //         {
    //             httpMsgs.show500(req,res,err);
    //         }else{
    //             httpMsgs.sendJsonMsg(req,res,"exito","movimiento agregado");
    //         }
    //     });

}

movMaquina.getMovMaquinasByIdOpeario=(req,res)=>{
    const {idOperario}=req.body;
    console.log('operario:',idOperario);
    // var sqlStr="SELECT TOP 1000 * FROM "+tables.table_movMaquinas ;
    // sqlStr+="WHERE idOperario= "+util.format("%d",idOperario);
    var sqlStr="WITH ultimo_mov_maquinas (id_maquina,fecha) as "
        sqlStr+=" (  SELECT TOP (1000) IDMAQUINA,MAX(FECHA)"
        sqlStr+=" FROM "+tables.table_movMaquinas +" GROUP BY IDMAQUINA) "
        sqlStr+=" SELECT mm.IDMAQUINA,mm.FECHA,mm.IDOPERARIODESTINO FROM dbo.movmaquina AS mm "
        sqlStr+=" INNER JOIN ultimo_mov_maquinas AS umm ON mm.IDMAQUINA=umm.id_maquina AND mm.FECHA=umm.fecha "
        sqlStr+=" where mm.IDOPERARIODESTINO="+util.format("%d",idOperario);

    console.log(sqlStr);
    db.executeSql(sqlStr,

    (data,err)=>{

        if(err)
        {
            httpMsgs.show500(req,res,err);
        }else{
            httpMsgs.sendJsonMsg(req,res,'exito',{data:data.recordsets[0]});
        }
    });
}

module.exports=movMaquina;

