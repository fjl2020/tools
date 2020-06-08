const settings = require( '../Utils/settings' );

exports.show500 = ( req, res, err ) => {
    if ( settings.httpMsgsFormat === 'HTML' ) {
        res.writeHead( 500, "Iternal error", { 'Content-type': 'text/html' } );
        res.write( "<html><head><title>500</title></head><body>500: internal error details : " + err + "</body></html>" )
    } else {
        res.writeHead( 500, "Internal error", { 'Content-type': 'application/json' } );
        res.write( JSON.stringify( { data: "ERROR ocurred: "+err } ) );

    }
    res.end();

}

exports.sendJson = ( req, res, data ) => {

    res.writeHead( 200, "Successfull", { 'Content-type': 'application/json' } );
    if ( data ) {
        res.write( JSON.stringify( data.recordset ) );
    }

    res.end();
};
exports.sendJsonMsg = ( req, res, estado,msg ) => {

    res.writeHead( 200, "Successfull", { 'Content-type': 'application/json' } );
    if ( msg ) {
        // console.log(msg)
        res.write(JSON.stringify({estado,msg})  ) ;
    }

    res.end();
};
exports.show405 = ( req, res ) => {

    if ( settings.httpMsgsFormat === 'HTML' ) {
        res.writeHead( 405, "Method not supported", { 'Content-type': 'text/html' } );
        res.write( "<html><head><title>405</title></head><body>405: Method not supported </body></html>" )
    } else {
        res.writeHead( 405, "Method not supported", { 'Content-type': 'application/json' } );
        res.write( JSON.stringify( { data: "Method not supported" } ) );
    }
    res.end();
}
exports.show404 = ( req, res ) => {

    if ( settings.httpMsgsFormat === 'HTML' ) {
        res.writeHead( 404, "Resource not found", { 'Content-type': 'text/html' } );
        res.write( "<html><head><title>404</title></head><body>404: Resource not found </body></html>" )
    } else {
        res.writeHead( 404, "Resource not found", { 'Content-type': 'application/json' } );
        res.write( JSON.stringify( { data: "Resource not found" } ) );
    }
    res.end();
}
exports.show413 = ( req, res ) => {

    if ( settings.httpMsgsFormat === 'HTML' ) {
        res.writeHead( 413, "Request entity too Large", { 'Content-type': 'text/html' } );
        res.write( "<html><head><title>413</title></head><body>413: Request entity too Large </body></html>" )
    } else {
        res.writeHead( 413, "Request entity too Large", { 'Content-type': 'application/json' } );
        res.write( JSON.stringify( { data: "Request entity too Large" } ) );
    }
    res.end();
}
exports.send200 = ( req, res ) => {
    res.writeHead( 200, { 'Content-type': 'application/json' } );
    res.end();
}

exports.showHome = ( req, res ) => {
    if ( settings.httpMsgsFormat === 'HTML' ) {
        res.writeHead( 200, { 'Content-type': 'text/html' } );
        res.write( "<html><head><title>Home</title></head><body>Valid endspoints:<br>/employees -get list of employees <br>/employees/{empno} - get information about an employee</body></html>" )
    } else {
        res.writeHead( 200, { 'Content-type': 'application/json' } );
        res.write( JSON.stringify( [
            { url: "/employees", operation: "GET", description: "Get a list of employees" },
            { url: "/employees/{empno}", operation: "GET", description: "Get information about an employee" },
        ] ) );
    }
    res.end();
}