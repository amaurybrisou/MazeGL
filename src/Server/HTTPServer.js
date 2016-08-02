

//var minifier = require('Minifier.js');
var express = require('express'),
    http = require('http');

var HTTPServer = (function () {
    return function(address, port, dirname, verbose) {
        var verbose = verbose || false;
        var gameport = port || process.env.PORT || 9999;

        var app = express();
        var httpServer = http.createServer(app);
        
        app.get( '/', function( req, res ){
                res.sendFile( 'index.html', {'root': __dirname+'/../'} );
            });

        app.get( '/*' , function( req, res, next ) {

            //This is the current file they have requested
            var file = req.params[0];

                //For debugging, we can track what files are requested.
            if(verbose) console.log('\t :: Express :: file requested : ' + file);

                //Send the requesting client the file.
            res.sendFile( file, {'root': __dirname+'/../'} );

        });

        httpServer.listen(gameport, address);

        httpServer.on('listening', function() {
            console.log('Express httpServer started on port %s at %s',
             httpServer.address().port, httpServer.address().address);
        });

        
        
        return httpServer;
    };

}());

module.exports = HTTPServer;