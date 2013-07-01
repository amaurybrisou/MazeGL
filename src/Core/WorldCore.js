if(typeof global != 'undefined'){
	var FileDescriptor = require('./FileDescriptor.js');
    var WorldObjects = require('./WorldObjects.js');
    var Configuration = require("./Configuration.js");
    var WorldClientCore = require('./WorldClientCore.js');
	var THREE = require('three');
}

var frame_time = 60/1000; // run the local game at 16ms/ 60hz
if('undefined' != typeof(global)) frame_time = 45; //on server we run at 45ms, 22hz

( function () {

    var lastTime = 0;
    var vendors = [ 'ms', 'moz', 'webkit', 'o' ];

    for ( var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x ) {
        window.requestAnimationFrame = window[ vendors[ x ] + 'RequestAnimationFrame' ];
        window.cancelAnimationFrame = window[ vendors[ x ] + 'CancelAnimationFrame' ] || 
            window[ vendors[ x ] + 'CancelRequestAnimationFrame' ];
    }

    if ( !window.requestAnimationFrame ) {
        window.requestAnimationFrame = function ( callback, element ) {
            var currTime = Date.now(), timeToCall = Math.max(
                0, frame_time - ( currTime - lastTime ) );
            var id = window.setTimeout( function() { 
                callback( currTime + timeToCall ); }, timeToCall );
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if ( !window.cancelAnimationFrame ) {
        window.cancelAnimationFrame = function ( id ) { clearTimeout( id ); };
    }

}());



var world_core = function(world_instance){
    THREE.Scene.call(this);

    var that = this;

    for(var key in WorldClientCore){
        this[key] = WorldClientCore[key];
    }

    this.Clients = [];
    //Store the instance, if any
    this.instance = world_instance;
    //Store a flag if we are the server
    this.server = this.instance !== undefined;

    this._pdt = 0.0001; //The physics update delta time
    this._pdte = new Date().getTime(); //The physics update last delta time
    //A local timer for precision on server and client
    this.local_time = 0.016; //The local timer
    this._dte = new Date().getTime(); //The local timer last frame time
    this._dt = new Date().getTime(); //The local timer delta

    //     //Start a physics loop, this is separate to the rendering
    //     //as this happens at a fixed frequency
    //this.create_physics_simulation();

    var object = new Configuration(this.server);
    for (var key in object ){
        this[key] = object[key];
    }

    if(!this.server ){
        this.client_create_world();
        this.FileDescriptor = Network.FileDescriptor(
            this.SERVER_ADDR,
            this.SERVER_PORT);
    } else { //if server
        //Start a fast paced timer for measuring time easier
        this.create_timer();
        this.server_time = new Date().getTime();
    }
}; //world.constructor

world_core.prototype = Object.create(THREE.Scene.prototype);


world_core.prototype.stop_update = function() { window.cancelAnimationFrame( this.updateid ); };
Number.prototype.fixed = function(n) { n = n || 3; return parseFloat(this.toFixed(n)); };


world_core.prototype.update = function(t){
    this.dt = this.lastframetime ? ( (t - this.lastframetime)/1000.0).fixed() : 0.016;

    //Store the last frame time
    this.lastframetime = t;

    if(!this.server && typeof this.avatar_obj !== 'undefined') {
        this.client_update(this.dt);
    } else if( this.Clients.length ) {
        this.server_update();

    }

        //schedule the next update
    this.updateid = window.requestAnimationFrame( this.update.bind(this), this.domElement );
};

world_core.prototype.server_update = function(){
        this.server_time = this.local_time;
        this.update_world_state();
        mmo.send_server_update(this.laststate, this.instance.id);
};

world_core.prototype.update_world_state = function(){

    //Here we only update player positions but we could add many world updates to
    // our state in order to send them in the server_update loop;

    var positions = [];
    var position;
    for(var userid in this.Clients){
        position = this.Clients[userid].getLastPosition();
        if(position === undefined){
            continue;
        }
        
        positions.push({ 'userid' : userid, 'position' : position });
    }


    this.laststate = {'positions' : positions};
};


world_core.prototype.updatePlayers = function(new_coords){
    var cli = this.Clients[new_coords.userid];
    //new position otherwise position
    var position = new_coords.position || cli.avatar_obj.position;

    if(cli != undefined){
        cli.avatar_obj.position.set(
            new_coords.position.x,
            new_coords.position.y,
            new_coords.position.z);

        cli.last_position.set(
            new_coords.position.x,
            new_coords.position.y,
            new_coords.position.z);
    }
    
};

world_core.prototype.addLocalPlayer = (function(){
    // build avatar
    return function(userid){
        if(this.server){
            this.avatar_obj = new THREE.Object3D();
            this.avatar_obj.position.set(this.AVATAR_POSITION.x,
                                        this.AVATAR_POSITION.y,
                                        this.AVATAR_POSITION.z);
        } else {
            this.avatar_obj = this.client_create_avatar();
        }
        this.avatar_obj.userid = userid;
        this.add(this.avatar_obj);

        this.FileDescriptor.get_world();
    };
}());

world_core.prototype.addOtherPlayer = (function(){
    var avatar_obj;
    // build avatar
    return function(coords){
        if(this.server){
            avatar_obj = new THREE.Object3D();
            
            avatar_obj.position.set(coords.x, coords.y, coords.z);
        } else {
            avatar_obj = this.getAvatar(coords);

        }
        avatar_obj.userid = coords.userid;

        this.add(avatar_obj);

        this.Clients[avatar_obj.userid] = 
            { "avatar_obj" : avatar_obj, 'last_position' : coords };
    };
}());

world_core.prototype.deletePlayer = function(userid){
    if(this.Clients.hasOwnProperty(userid)){
        this.remove(this.Clients[userid].avatar_obj);
        delete this.Clients[userid].avatar_obj;
    }
};

world_core.prototype.clear = function(){
    this.remove(this.avatar_obj);
    this.avatar_obj = undefined;
    for(var userid in this.Clients){
        console.log(userid);
        this.remove(this.Clients[userid].avatar_obj);
        delete this.Clients[userid].avatar_obj;
    }
};




















world_core.prototype.create_timer = function(){
    setInterval(function(){
        this._dt = new Date().getTime() - this._dte;
        this._dte = new Date().getTime();
        this.local_time += this._dt/1000.0;
    }.bind(this), 4);
};

world_core.prototype.create_physics_simulation = function() {

    setInterval(function(){
        this._pdt = (new Date().getTime() - this._pdte)/1000.0;
        this._pdte = new Date().getTime();
        this.update();
    }.bind(this), 15);

}; //world_core.client_create_physics_simulation



world_core.prototype.StoneBuilder =  function(){

    var x, y, z, width, height, depth;
    var stones = [];

    for(var i=0; i<this.NB_STONES; i++){

        // STONE
        height = Math.random()*this.WORLDSIZE/this.STONES_SIZE_RATIO;
        width = Math.random()*height*3/4 + 100;
        depth = Math.random()*height*3/4 + 100;

        x = Math.random()*this.WORLDSIZE - this.WORLDSIZE/2;
        y = height/2;
        z = Math.random()*this.WORLDSIZE - this.WORLDSIZE/2;

        stones[i] = WorldObjects.Stone(
            x, y, z, width, height, depth, this.STONES_FACES_MAT, this.STONES_EDGES_MAT);
        this.add(stones[i]);
    }
   
};


world_core.prototype.MountainBuilder = function(Xo, Zo, spread, decrease_factor){
    var in_spread = 0;
    var oHeight = 100;
    var theta = 0;

    while(in_spread<spread) {

        // create the origin positioned stone
        if(in_spread==0){
            this.add(WorldObjects.Stone_Algo(
                Xo, 
                Zo, 
                this.STONES_UNIV_SIZE,
                oHeight, 
                this.STONES_FACES_MAT, 
                this.STONES_EDGES_MAT)
            );
        }
        
        // then create children stones in a "circular" way
        else {
            for(var i=0; i<8*in_spread; i++) {
                theta = i * 45/in_spread * Math.PI / 180;
                height = oHeight - decrease_factor*in_spread;

                this.add(WorldObjects.Stone_Algo(
                    Xo + this.STONES_UNIV_SIZE * in_spread * Math.cos(theta), 
                    Zo + this.STONES_UNIV_SIZE * in_spread * Math.sin(theta), 
                    this.STONES_UNIV_SIZE,
                    height, 
                    this.STONES_FACES_MAT, 
                    this.STONES_EDGES_MAT)
                );

            }
        }

        in_spread ++;

    }
};

world_core.prototype.maze = function(maze){

    var maze = maze;
    var len = maze.length;
    var height = 10,
        wall,
        mat,
        origin = true,
        world_texture = THREE.ImageUtils.loadTexture( this.MAZE_CUBE_TEXTURE ),
        width = depth = this.block_size = this.WORLDSIZE / ( len - 1),
        mergedGeo = new window.THREE.Geometry();

    world_texture.wrapS = world_texture.wrapT = THREE.RepeatWrapping;
    world_texture.repeat.set(this.REP_HOR_MAZE_CUBE, this.REP_VERT_MAZE_CUBE);//hor repeat , vert

    for(var i = 0; i < len; i++){
        for(j = 0; j < maze[i].length; j++){
            // if((i <= 1 && j <= 1) ||
            //      (i >= len - 1 && j >= len - 1 )){
            //     // mat = this.BEGIN_END_FACES_MAT;
            //     // origin = true;
            //     continue;
            // } else {
                //origin = false;
                //mat = this.WALL_FACES_MAT;
                mat = new THREE.MeshBasicMaterial( { color: this.MAZE_CUBE_COLOR || undefined, 
                                                    map: world_texture } );
            // }
            if(maze[i][j]){
                wall = WorldObjects.cube(width, height, depth, mat);
                wall.origin = origin;
                wall.position.set( -this.WORLDSIZE / 2 +  i * width,
                                    height / 2,
                                    -this.WORLDSIZE / 2 + j * depth);
                

                // if(this.debug){
                //     var boundingSphere = wall.geometry.boundingSphere.clone();
                //     // compute overall bbox
                //     console.log(boundingSphere);
                //     var sphere = new THREE.Mesh(
                //         new THREE.SphereGeometry(boundingSphere.radius, 5, 5),
                //          new THREE.MeshBasicMaterial({
                //                 color: 0x000000,
                //                 wireframe : true
                //     }));
                //     sphere.overdraw = true;
                    
                //     wall.add (sphere);
                // }

                if(!wall.origin){
                    window.THREE.GeometryUtils.merge(mergedGeo, wall);
                } else {
                    this.add(wall);
                    this.obstacles.push(wall);
                }
            }
        }
    }
    var walls = new window.THREE.Mesh(
                mergedGeo,
                mat);

    this.add(walls);
    this.obstacles.push(walls);
    this.avatar_obj.add(this.obstacles);

};



if( 'undefined' != typeof global ) {
    module.exports = global.world_core = world_core;
}