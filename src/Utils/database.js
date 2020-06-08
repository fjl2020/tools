const sqlDb = require( 'mssql' );
const settings = require( './settings' );

exports.executeSql = async ( sql, callback ) => {
    // var conn = new sqlDb.con( settings.dbConfig );
    try {
        var pool = await sqlDb.connect( settings.dbConfig )
        var result1 = await pool.request().query( sql );
        // console.log('result1',result1)
        callback( result1 )
    } catch ( error ) {
        // console.log(err);
        callback( null, error );
    }

};                              