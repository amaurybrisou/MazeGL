
var mmo = module.exports = { worlds : {}, worlds_count:0 };
var UUID = require('node-uuid');

var verbose = true;

//Since we are sharing code with the browser, we
//are going to include some values to handle that.
global.window = global.document = global;

//Import shared game library code.
require('../Core/WorldCore.js');
var Client = require('../Core/Controls.js');

mmo.log = function() {
    if(verbose) console.log.apply(this,arguments);
};




var Clients = [];


mmo.AddClient = function(world_id){
    var userid = UUID();
    var client = new Client(true);
    Clients[userid] = { 'userid' : userid,
                        'position': this.worlds[world_id].AVATAR_POSITION }; 
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

mmo.delClient  = function(userid, world_id){
    if(Clients.hasOwnProperty(userid)){
        delete Clients[userid];
        this.worlds[world_id].worldcore.deletePlayer(userid);
    }
};

mmo.send_server_update = function(data, world_id){
    this.worlds[world_id].io.send_server_update(data);
};

mmo.clear = function(world_id){
    for(var userid in Clients){
        delete Clients[userid];
        this.worlds[world_id].worldcore.deletePlayer(userid);
    }
}

mmo.createWorld = function(id, io ) {
    //Create a new game instance

    var world = {
            id : id, //generate a new id for the game
            player_client:null, //nobody else joined yet, since its new
            player_count:0, //for simple checking of state
            io : io
        };


	//Store it in the list of game
    this.worlds[ world.id ] = world;

    //Keep track
    this.worlds_count++;

    //Create a new game core instance, this actually runs the
    //game code like collisions and such.
    world.worldcore = new world_core( world );
    //Start updating the game loop on the server
    world.worldcore.update( new Date().getTime());

    mmo.log('server host at ' + world.worldcore.local_time);
    
    //return it
    return world;

}; //game_server.createGame

