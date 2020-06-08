const {Router} =require('express');
// const {addObra,updateObra,getAllObras,deleteObra,getObra}=require('../Controllers/obrasController');
const {getMaquinas}=require('../Controllers/maquina/maquina');


const route=Router();

route.route('/')
    .get(getMaquinas)
    // .post(agregarObra)
    // .put(actualizarObra)
    // .delete(borrarObra);
// route.get('/:Nombre',obtenerObra);
module.exports=route;