var assetManager = require('connect-assetmanager');
var assetHandler = require('connect-assetmanager-handlers');

var Minifier = (function(){
    var path = __dirname + "../../Client/";

    var assetManagerGroups = {
        'js': {
            'route': /\/static\/js\/[0-9]+\/.*\.js/
            , 'path': path+'./js/'
            , 'dataType': 'javascript'
            , 'files': [
            ''
            ]
        }, 'css': {
            'route': /\/static\/css\/[0-9]+\/.*\.css/
            , 'path': path+'./css/'
            , 'dataType': 'css'
            , 'files': [
            'reset.css'
            ]
        }
    };
}());
