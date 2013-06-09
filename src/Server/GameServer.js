var mmo = module.exports = { worlds : {}, worlds_count:0 };
var UUID = require('node-uuid');
var verbose = true;

//Since we are sharing code with the browser, we
//are going to include some values to handle that.
global.window = global.document = global;

//Import shared game library code.
require('../Core/WorldCore.js');

mmo.log = function() {
    if(verbose) console.log.apply(this,arguments);
};

mmo.fake_latency = 0;
mmo.local_time = 0;
mmo._dt = new Date().getTime();
mmo._dte = new Date().getTime();
    //a local queue of messages we delay if faking latency
mmo.messages = [];

setInterval(function(){
    mmo._dt = new Date().getTime() - mmo._dte;
    mmo._dte = new Date().getTime();
    mmo.local_time += mmo._dt/1000.0;
}, 4);

mmo.createWorld = function() {

    //Create a new game instance
    var world = {
            id : UUID(), //generate a new id for the game
            player_client:null, //nobody else joined yet, since its new
            player_count:0 //for simple checking of state
        };

	//Store it in the list of game
    this.worlds[ world.id ] = world;

    //Keep track
    this.worlds_count++;

    //Create a new game core instance, this actually runs the
    //game code like collisions and such.
    world.worldcore = new world_core( world );
    //Start updating the game loop on the server
    world.worldcore.animate( new Date().getTime() );

    mmo.log('server host at ' + world.worldcore.local_time);
    
    //return it
    return world;

}; //game_server.createGame