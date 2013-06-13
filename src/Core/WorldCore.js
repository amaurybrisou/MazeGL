if(typeof global != 'undefined'){
	var FileDescriptor = require('./FileDescriptor.js');
    var WorldObjects = require('./WorldObjects.js');
    var Configuration = require("./Configuration.js");
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


Number.prototype.fixed = function(n) { n = n || 3; return parseFloat(this.toFixed(n)); };

var world_core = function(world_instance){
    THREE.Scene.call(this);

    var that = this;

    this.Clients = [];
    //Store the instance, if any
    this.instance = world_instance;
    //Store a flag if we are the server
    this.server = this.instance !== undefined;

    //The speed at which the clients move.
    this.playerspeed = 40;

        //Set up some physics integration values
    this._pdt = 0.0001; //The physics update delta time
    this._pdte = new Date().getTime(); //The physics update last delta time
        //A local timer for precision on server and client
    this.local_time = 0.016; //The local timer
    this._dt = new Date().getTime(); //The local timer delta
    this._dte = new Date().getTime(); //The local timer last frame time

    //     //Start a physics loop, this is separate to the rendering
    //     //as this happens at a fixed frequency
    // this.create_physics_simulation();

    //Start a fast paced timer for measuring time easier
    this.create_timer();

    if(!this.server){

       this.state_time = new Date().getTime();

        var object = new Configuration(this.server);
        for (var key in object ){
            this[key] = object[key];
        }

        if(this.debug){
            this.client_create_debug_gui();
        }  

        //this.client_create_ping_timer();     


        span = document.getElementById('infos');
        text = document.createTextNode('');    
        
        this.Renderer = RENDERER(this);

        document.getElementById('canvasCont').appendChild(this.Renderer.domElement);

        this.Renderer.setClearColor(this.BG_COLOR, 1.0);
        this.Renderer.clear();

        this.camera = this.getCamera();
        this.add(this.camera);
        
        this.camera.lookAt(this.position);
        console.log("Camera Loaded ", "WorldBuilder");
    
        this.WORLD_TEXTURE = this.getWorldTexture();
        this.WORLD_TEXTURE.repeat.set(1024, 1024);
        console.log("World_Texture Loaded ", "WorldBuilder");

        // build floor
        this.PLANE = this.getPlane();
        this.add(this.PLANE);
        console.log("Plane Loaded");

        // build sun
        this.add(this.SUN);
        console.log("Sun Loaded");
        
        this.MAIN_LIGHT = this.getMainLight();
        this.add(this.MAIN_LIGHT);
        console.log("Main Light Loaded ");

        this.AMBIENT_LIGHT = new THREE.AmbientLight();
        this.add(this.AMBIENT_LIGHT);
        console.log("Ambient Light Loaded ");

        for (var i = 0; i < this.WORLD_ORIGIN.length; i++) {
           this.add(this.WORLD_ORIGIN[i]);
        }
        console.log("Origin Loaded ");

        //Build Stones;
        this.StoneBuilder();
        console.log("Stones Loaded ");
        
        // build fog
        this.fog = this.FOG;

        this.camera.lookAt(this.position);

        if(String(window.location).indexOf('debug') != -1) {
                this.client_create_debug_gui();
        }

    } else { //if server
        var object = new Configuration(this.server);
        for (var key in object ){
            object[key] = this[key];
        }

        
        this.server_time = 0;
        this.laststate = {};
    }
}; //world.constructor


world_core.prototype = Object.create(THREE.Scene.prototype);


world_core.prototype.update = function(t){
    this.dt = this.lastframetime ? ( (t - this.lastframetime)/1000.0).fixed() : 0.016;

    //Store the last frame time
    this.lastframetime = t;

    if(!this.server) {
        this.client_update();
    } else {
        this.server_update();
    }

        //schedule the next update
    this.updateid = window.requestAnimationFrame( this.update.bind(this), this.viewport );
};



world_core.prototype.client_update = function(){
            // animate
            var t  = (this.local_time - this.state_time) / this._pdt;

            if(typeof this.avatar_obj != 'undefined'){
                this.avatar_obj.animate();
            }
            
            //this.camera.animate(this);

            this.SUN.animate(t, this);
            
            // color ratios
            if (Math.cos(t / this.DAY_NIGHT_SPEED) + 0.06 >= this.DARKNESS) {
                this.BC = Math.cos(t / this.DAY_NIGHT_SPEED) + 0.06;
            } else {
                this.BC = this.DARKNESS;
            }
            if (Math.cos(t / this.DAY_NIGHT_SPEED) + 0.06 >= this.LIGHTNESS) {
                this.BC = this.LIGHTNESS;
            }


            if (Math.cos(t / this.DAY_NIGHT_SPEED) >= this.DARKNESS) {
                this.SC = Math.cos(t / this.DAY_NIGHT_SPEED);
            }
            else {
                this.SC = this.DARKNESS;
            }
            if (Math.cos(t / this.DAY_NIGHT_SPEED) >= this.LIGHTNESS) {
                this.SC = this.LIGHTNESS;
            }

            if (-Math.cos(t / this.DAY_NIGHT_SPEED) >= this.DARKNESS) {
                this.SEC = -Math.cos(t / this.DAY_NIGHT_SPEED);
            }
            else {
                this.SEC = this.DARKNESS;
            }
            if (-Math.cos(t / this.DAY_NIGHT_SPEED) >= this.LIGHTNESS) {
                this.SEC = this.LIGHTNESS;
            }


            // background color
            this.BG_COLOR.setRGB(this.BC, this.BC, this.BC);

            if(!this.server){
                this.Renderer.setClearColor(this.BG_COLOR, 1.0);
                this.PLANET_MAT.color.setRGB(this.SC, this.SC, this.SC);
            }
            // floor color
            this.PLANET_MAT.color.setRGB(this.SC, this.SC, this.SC);

            // stones color
            this.STONES_FACES_MAT.color.setRGB(this.SC, this.SC, this.SC);

            // stones edges color
            this.STONES_EDGES_MAT.color.setRGB(this.SEC, this.SEC, this.SEC);

            // fog color
            this.FOG.color.setRGB(this.BC, this.BC, this.BC);


            // main light and sun movements
            this.MAIN_LIGHT.position.y = Math.cos(t / this.DAY_NIGHT_SPEED) * 
                this.FAR / 2;
            /*    window.mmo.sun.position.y = Math.cos(t/day_night_speed)*FAR/4;
            */
            this.MAIN_LIGHT.position.x = Math.sin(t / this.DAY_NIGHT_SPEED) *
                this.WORLDSIZE / 2;
            /*    window.mmo.sun.position.x = Math.sin(t/day_night_speed)*WORLDSIZE/1.8;
            */

            this.MAIN_LIGHT.lookAt(this.position);

            // HTML CONTENT
            span.innerHTML = ''; // clear existing

            var connection_status = Network.FileDescriptor.readyState === ( 1 || 2 || 0 )
            ? "Connected" : "Disconnected";
            text = 'time : ' + Math.round(this.MAIN_LIGHT.position.y / 1000) + 
            '</br>cam coords : ' + this.camera.position.x + 
            " " + this.camera.position.y + 
            " " + this.camera.position.z; 
            if(typeof this.avatar_obj != 'undefined' && 
                this.avatar_obj.position != 'undefined'){
                    text += '</br>mesh coords : ' + this.avatar_obj.position.x + 
                " " + this.avatar_obj.position.y + 
                " " + this.avatar_obj.position.z ;
            }
            text += "</br>Status : "+connection_status;

            span.innerHTML = text;

            // this.updateid = window.requestAnimationFrame(
            //     this.animate.bind(this), this.Renderer.domElement );
            this.Renderer.clear();
            this.Renderer.render(this, this.camera);

};
    
world_core.prototype.server_update = function(){
        this.server_time = this.local_time;
        this.update_world_state();
        mmo.send_server_update(this.laststate);
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

world_core.prototype.update_physics = function() {

    if(this.server) {
        this.server_update();
    } else {
        this.client_update();
    }

};



world_core.prototype.client_refresh_fps = function() {

        //We store the fps for 10 frames, by adding it to this accumulator
    this.fps = 1/this.dt;
    this.fps_avg_acc += this.fps;
    this.fps_avg_count++;

        //When we reach 10 frames we work out the average fps
    if(this.fps_avg_count >= 10) {

        this.fps_avg = this.fps_avg_acc/10;
        this.fps_avg_count = 1;
        this.fps_avg_acc = this.fps;

    } //reached 10 frames

}; //game_core.client_refresh_fps



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
            this.avatar_obj = this.getAvatar(this);
        }

        if(typeof this.camera === 'undefined'){
            this.camera = this.getCamera();
        }

        this.avatar_obj.userid = userid;

        this.camera.reset(this);
        this.avatar_obj.add(this.camera);
       
        
        
        // define controls
        this.avatar_controls =
            Controls.AvatarControls(this.avatar_obj, this);

        var that = this;

        this.avatar_obj.animate = function () {
            that.avatar_controls.update(window.clock.getDelta());
        };

        this.add(this.avatar_obj);

        return this.avatar_obj;
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
        this.remove(this.Clients[userid]);
        delete this.Clients[userid];
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
        this.update_physics();
    }.bind(this), 15);

}; //world_core.client_create_physics_simulation


world_core.prototype.client_create_ping_timer = function() {

        //Set a ping timer to 1 second, to maintain the ping/latency between
        //client and server and calculated roughly how our connection is doing

    setInterval(function(){

        this.last_ping_time = new Date().getTime() - this.fake_lag;
        this.socket.send('p.' + (this.last_ping_time) );

    }.bind(this), 1000);
    
};

world_core.prototype.client_create_debug_gui = function() {

    this.gui = new dat.GUI();

    var _othersettings = this.gui.addFolder('Methods');

        _othersettings.add(this, 'naive_approach').listen();
        _othersettings.add(this, 'client_smoothing').listen();
        _othersettings.add(this, 'client_smooth').listen();
        _othersettings.add(this, 'client_predict').listen();

    var _debugsettings = this.gui.addFolder('Debug view');
        
        _debugsettings.add(this, 'show_help').listen();
        _debugsettings.add(this, 'fps_avg').listen();
        _debugsettings.add(this, 'show_server_pos').listen();
        _debugsettings.add(this, 'show_dest_pos').listen();
        _debugsettings.add(this, 'local_time').listen();

        _debugsettings.open();

    var _consettings = this.gui.addFolder('Connection');
        _consettings.add(this, 'net_latency').step(0.001).listen();
        _consettings.add(this, 'net_ping').step(0.001).listen();

            //When adding fake lag, we need to tell the server about it.
        var lag_control = _consettings.add(this, 'fake_lag').step(0.001).listen();
        lag_control.onChange(function(value){
            this.socket.send('l.' + value);
        }.bind(this));

        _consettings.open();

    var _netsettings = this.gui.addFolder('Networking');
        
        _netsettings.add(this, 'net_offset').min(0.01).step(0.001).listen();
        _netsettings.add(this, 'server_time').step(0.001).listen();
        _netsettings.add(this, 'client_time').step(0.001).listen();
        //_netsettings.add(this, 'oldest_tick').step(0.001).listen();

        _netsettings.open();

}; //world_core.client_create_debug_gui

world_core.prototype.client_onping = function(data) {

    this.net_ping = new Date().getTime() - parseFloat( data );
    this.net_latency = this.net_ping/2;

};


if( 'undefined' != typeof global ) {
    module.exports = global.world_core = world_core;
}

















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

