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

       
    //A local timer for precision on server and client
    this.local_time = 0.016; //The local timer
    this._dt = new Date().getTime(); //The local timer delta
    this._dte = new Date().getTime(); //The local timer last frame time

    //     //Start a physics loop, this is separate to the rendering
    //     //as this happens at a fixed frequency
    // this.create_physics_simulation();

    //Start a fast paced timer for measuring time easier
    this.create_timer();

    var object = new Configuration(this.server);
    for (var key in object ){
        this[key] = object[key];
    }

    if(!this.server){

        this.cl_create_world();       
    } else { //if server
        this.server_time = 0;
        this.laststate = {};
    }
}; //world.constructor

world_core.prototype = Object.create(THREE.Scene.prototype);


world_core.prototype.stop_update = function() { window.cancelAnimationFrame( this.updateid ); };
Number.prototype.fixed = function(n) { n = n || 3; return parseFloat(this.toFixed(n)); };


world_core.prototype.update = function(t){
    this.dt = this.lastframetime ? ( (t - this.lastframetime)/1000.0).fixed() : 0.016;

    //Store the last frame time
    this.lastframetime = t;

    if(!this.server) {
        this.client_update(this.dt);
    } else {
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
    var server_position = new_coords.position | cli.avatar_obj.position;

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
            this.avatar_obj.position.set(0,0,0);
        } else {
            this.client_create_avatar();
        }
        this.avatar_obj.userid = userid;
        this.add(this.avatar_obj);
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

world_core.prototype.getCamera = function(){
    var that = this;
    var s = new THREE.PerspectiveCamera(
            this.VIEW_ANGLE,
            this.ASPECT,
            this.NEAR,
            this.FAR);
    s.position.set(
        this.CAM_POS_X,
        this.CAM_POS_Y,
        this.CAM_POS_Z
    );
    

    

    s.reset = function () {
        
        this.position.set(
            that.avatar_obj.position.x,
            that.avatar_obj.position.y,
            that.avatar_obj.position.z);

            this.position.x += 0;
            this.position.y += that.AVATAR_SCALE * that.CAM_POS_RATIO / 4;
            this.position.z += that.AVATAR_SCALE * that.CAM_POS_RATIO;

            this.lookAt(that.avatar_obj.position);

    };

    s.animate = function () {

        this.position.set(
            that.avatar_obj.position.x,
            that.avatar_obj.position.y,
            that.avatar_obj.position.z);
        this.lookAt(that.avatar_obj.position);
        this.position.x = that.AVATAR_SCALE/2;
        this.position.y = that.AVATAR_SCALE;
        this.position.z = that.AVATAR_SCALE * 4;


    };
    
    
    return s;
};

world_core.prototype.getColor = function(rgb_str){
    return new window.THREE.Color(rgb_str);
};


world_core.prototype.getPlane = function(){
    var plane = new THREE.Mesh(
        this.PLANET_GEO,
        this.PLANET_MAT);
 
    plane.rotation.x = this.PLANE_ROT_X;
    plane.position.y = this.PLANE_ROT_Y;
    plane.receiveShadow = this.PLANE_RECV_SHADOW;
    return plane;
};

world_core.prototype.getAvatar = function(coords){
    var x = coords.x || 0,
        y = coords.y || 0,
        z = coords.z || 0;

    return new this.AVATAR_TYPE(
        x, y, z, this.AVATAR_MAT, this);
};

world_core.prototype.getMainLight = function(){
    
    var s = new THREE.SpotLight(this.LIGHT_COLOR);
    
    s.castShadow = this.MAIN_LIGHT_CAST_SHADOW;
    s.angle = this.MAIN_LIGHT_ANGLE;
    s.exponent = this.MAIN_LIGHT_EXPONENT;
    s.shadowBias = this.MAIN_LIGHT_SHADOWBIAS;
    s.shadowCameraFar = this.MAIN_LIGHT_SHADOW_CAMERA_FAR;
    s.shadowCameraFov = this.MAIN_LIGHT_SHADOW_CAMERA_FOV;
    return s;
};

world_core.prototype.getWorldTexture = function(){
    var s = THREE.ImageUtils.loadTexture(this.WORLD_TEXTURE_URL);
    
    s.wrapS = s.wrapT = THREE.RepeatWrapping;
    return s;
};  

if( 'undefined' != typeof global ) {
    module.exports = global.world_core = world_core;
}