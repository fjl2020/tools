const {Router} =require('express');
// const {addObra,updateObra,getAllObras,deleteObra,getObra}=require('../Controllers/obrasController');
const {getMovMaquinas,getMovMaquinasByIdOpeario,postMovMaquinas}=require('../Controllers/movMaquina/movMaquina');


const route=Router();

route.route('/')
    .get(getMovMaquinas)
    .post(postMovMaquinas)   
     // .put(actualizarObra)
    // .delete(borrarObra);
// route.get('/:Nombre',obtenerObra);
route.route('/byOperario')
    .get(getMovMaquinasByIdOpeario)
module.exports=route;