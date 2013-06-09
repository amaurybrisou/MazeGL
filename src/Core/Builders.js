if(typeof global != 'undefined'){
    var THREE = require('three');
    var WorldUtils = require('./WorldUtils.js');
    var Attributes = require('./Attributes.js');
}

var Builders = {
    StoneBuilder : function(scene,
     NB_STONES, STONES_FACES_MAT, STONES_EDGES_MAT, WORLDSIZE, STONES_SIZE_RATIO){

        var x, y, z, width, height, depth;
        var stones = [];

        for(var i=0; i<NB_STONES; i++){

            // STONE
            height = Math.random()*WORLDSIZE/STONES_SIZE_RATIO;
            width = Math.random()*height*3/4 + 100;
            depth = Math.random()*height*3/4 + 100;

            x = Math.random()*WORLDSIZE - WORLDSIZE/2;
            y = height/2;
            z = Math.random()*WORLDSIZE - WORLDSIZE/2;

            stones[i] = WorldObjects.Stone(
                x, y, z, width, height, depth, STONES_FACES_MAT, STONES_EDGES_MAT);
            scene.add(stones[i]);
        }
    }
}

if( 'undefined' != typeof global ) {
    module.exports = global.Builders = Builders;
}

