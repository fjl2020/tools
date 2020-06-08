const {Router} =require('express');
// const {addObra,updateObra,getAllObras,deleteObra,getObra}=require('../Controllers/obrasController');
const {getStack,getStackByIdDispositivo,stackRecibido,stackAgregar}=require('../Controllers/stack/stack.js');


const route=Router();

route.route('/')
    .get(getStack)
    .post(stackAgregar)   
     // .put(actualizarObra)
    // .delete(borrarObra);
// route.get('/:Nombre',obtenerObra);
route.route('/byIdDispositivo')
    .get(getStackByIdDispositivo)
route.route('/stackRecibido')
    .put(stackRecibido)

module.exports=route;