const {Router}=require('express');
// const {getLogin}=require('../Controllers/loginUsers');
const {getLoginDisp}=require('../Controllers/login/loginDispositivo');

const route=Router();

route.route('/disp').post(getLoginDisp);

module.exports=route;