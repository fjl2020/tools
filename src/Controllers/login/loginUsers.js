const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
// const pool = require('../Utils/database');
// const helpers = require('../Utils/helpers');
// const logger = require('../Utils/logger');
// const tables = require('../Models/tables');

const loginController = {}


loginController.getLogin = async (req, res) => {
    const { Usuario, Contrasena, ts } = req.body;
    
    try {
        
        let response = await pool.query('SELECT * FROM ' + tables.table_usuario);
        // console.log(response);
        if (response!=null && response.length == 0) {
            // si no existen usuarios crea uno superadmin y sin clave para luego reutilizarlo
            const nuevoUsuario = {
                USR_Usuario: Usuario,
                USR_Contrasena: Contrasena,
                USR_NombreCompleto: "usuario administrador",
                USR_RolId: 10
            };

            nuevoUsuario.USR_Contrasena = await helpers.encryptPassword(Contrasena);
            response = await pool.query('INSERT INTO ' + tables.table_usuario + ' set ?', [nuevoUsuario]);
            await logger.log(response.insertId, 'Nuevo usuario creado' + Usuario);
            await res.json({ estado: "Nuevo usuario creado", Mensaje: "Por favor cambie el password" });
        } else {
            //si existen usuarios
            user = await pool.query('SELECT * FROM ' + tables.table_usuario + ' WHERE ?', [{ USR_Usuario: Usuario }]);
            let passwordAuth;
            if (user[0]) passwordAuth = await helpers.matchPassword(Contrasena, user[0].USR_Contrasena);
            if (passwordAuth != null && passwordAuth === true) {
                await logger.log(user[0].USR_Id, 'Identificación usuario ' + Usuario);
                //si el usuario existe y sus credenciales son correctas
                const token = jwt.sign({
                    usuarioMaestro: user[0].USR_Usuario,
                    idUsuarioMaestro: user[0].USR_Id,
                    rolIdMaestro: user[0].USR_RolId,
                }, req.app.get('key'), { expiresIn: 60 * 60 });
                var userToSend = {
                    id:user[0].USR_Id,
                    NombreCompleto: user[0].USR_NombreCompleto,
                    RolId: user[0].USR_RolId,
                    Usuario: user[0].USR_Usuario,
                    key: req.app.get('key')
                };
                let userJsonString = JSON.stringify(userToSend);
                let userEncoded = CryptoJS.AES.encrypt(userJsonString, ts ? 'sc2020' + ts.toString() : 'sc2020');

                await res.json({
                    estado: "exito", Mensaje: "Usuario Encontrado!!!",
                    datoAEnviar: { usr: userEncoded.toString(), token: token }
                });
            } else {
                // await pool.end( );

                await logger.log(-1, 'Identificación error Usuario: ' +Usuario);

                await res.json({ estado: "error", mensaje: "Identificación no exitosa" });
            }
        }
    } catch (error) {
        console.log('catch error: ', error.code)
        await res.json({ estado: "error", mensaje: "Error en DB" });
        flagconErr = true
    }
}

module.exports = loginController;
