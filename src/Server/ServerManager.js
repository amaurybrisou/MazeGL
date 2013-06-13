var mmo = module.exports = { worlds : {}, worlds_count:0 };
var UUID = require('node-uuid');
var verbose = true;

//Since we are sharing code with the browser, we
//are going to include some values to handle that.
global.window = global.document = global;

//Import shared game library code.
require('../Core/WorldCore.js');
var UUID = require('node-uuid');
var Client = require('./Client.js');

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

var Clients = [];

mmo.AddClient = function(socket){
    var userid = UUID();
    var client = new Client();
    Clients[userid] = { userid : userid, x:0, y:0, z:0 }; 
    return { 'userid' : userid, 'client' : client };
};

mmo.getClients = function(userid){
    var c = [];
    for(var client in Clients){
        if(Clients[client] != undefined || client !== userid){
            c.push(Clients[client]);
        }
    }
    return c;
};

mmo.delClient  = function(userid){
    if(Clients.hasOwnProperty(userid)){
        delete Clients[userid];
    }
};

mmo.send_server_update = function(data){
    this.io.send_server_update(data);
};

mmo.createWorld = function(io) {
    //store socket io in order to broadcast world updates;
    this.io = io;

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
    world.worldcore.update( new Date().getTime() );

    mmo.log('server host at ' + world.worldcore.local_time);
    
    //return it
    return world;

}; //game_server.createGame