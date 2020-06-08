const {Router} =require('express');
// const {addObra,updateObra,getAllObras,deleteObra,getObra}=require('../Controllers/obrasController');
const {getOperarios}=require('../Controllers/operario/operario');


const route=Router();

route.route('/')
    .get(getOperarios)
    // .post(agregarObra)
    // .put(actualizarObra)
    // .delete(borrarObra);
// route.get('/:Nombre',obtenerObra);
module.exports=route;