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
    //this.create_timer();

    if(!this.server){

        

        var object = new Configuration(this.server);
        for (var key in object ){
            this[key] = object[key];
        }  

        var span = document.getElementById('infos');
        var text = document.createTextNode('');    
        
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
  
        this.animate = function(t, position){
                // animate
                if(!that.server){

                    if(typeof this.avatar_obj != 'undefined'){
                        that.avatar_obj.animate();
                    }
                    
                    //that.camera.animate(that);

                    that.SUN.animate(t, that);
                }
                
                // color ratios
                if (Math.cos(t / that.DAY_NIGHT_SPEED) + 0.06 >= that.DARKNESS) {
                    that.BC = Math.cos(t / that.DAY_NIGHT_SPEED) + 0.06;
                }
                else {
                    that.BC = that.DARKNESS;
                }
                if (Math.cos(t / that.DAY_NIGHT_SPEED) + 0.06 >= that.LIGHTNESS) {
                    that.BC = that.LIGHTNESS;
                }


                if (Math.cos(t / that.DAY_NIGHT_SPEED) >= that.DARKNESS) {
                    that.SC = Math.cos(t / that.DAY_NIGHT_SPEED);
                }
                else {
                    that.SC = that.DARKNESS;
                }
                if (Math.cos(t / that.DAY_NIGHT_SPEED) >= that.LIGHTNESS) {
                    that.SC = that.LIGHTNESS;
                }

                if (-Math.cos(t / that.DAY_NIGHT_SPEED) >= that.DARKNESS) {
                    that.SEC = -Math.cos(t / that.DAY_NIGHT_SPEED);
                }
                else {
                    that.SEC = that.DARKNESS;
                }
                if (-Math.cos(t / that.DAY_NIGHT_SPEED) >= that.LIGHTNESS) {
                    that.SEC = that.LIGHTNESS;
                }


                // background color
                that.BG_COLOR.setRGB(that.BC, that.BC, that.BC);

                if(!that.server){
                    that.Renderer.setClearColor(that.BG_COLOR, 1.0);
                    that.PLANET_MAT.color.setRGB(that.SC, that.SC, that.SC);
                }
                // floor color
                that.PLANET_MAT.color.setRGB(that.SC, that.SC, that.SC);

                // stones color
                that.STONES_FACES_MAT.color.setRGB(that.SC, that.SC, that.SC);

                // stones edges color
                that.STONES_EDGES_MAT.color.setRGB(that.SEC, that.SEC, that.SEC);

                // fog color
                that.FOG.color.setRGB(that.BC, that.BC, that.BC);


                // main light and sun movements
                that.MAIN_LIGHT.position.y = Math.cos(t / that.DAY_NIGHT_SPEED) * 
                    that.FAR / 2;
                /*    window.mmo.sun.position.y = Math.cos(t/day_night_speed)*FAR/4;
                */
                that.MAIN_LIGHT.position.x = Math.sin(t / that.DAY_NIGHT_SPEED) *
                    that.WORLDSIZE / 2;
                /*    window.mmo.sun.position.x = Math.sin(t/day_night_speed)*WORLDSIZE/1.8;
                */

                that.MAIN_LIGHT.lookAt(that.position);

                // HTML CONTENT
                span.innerHTML = ''; // clear existing

                var connection_status = Network.FileDescriptor.readyState === ( 1 || 2 || 0 )
                ? "Connected" : "Disconnected";
                text = 'time : ' + Math.round(that.MAIN_LIGHT.position.y / 1000) + 
                '</br>cam coords : ' + that.camera.position.x + 
                " " + that.camera.position.y + 
                " " + that.camera.position.z; 
                if(typeof that.avatar_obj != 'undefined' && 
                    that.avatar_obj.position != 'undefined'){
                        text += '</br>mesh coords : ' + that.avatar_obj.position.x + 
                    " " + that.avatar_obj.position.y + 
                    " " + that.avatar_obj.position.z ;
                }
                text += "</br>Status : "+connection_status;

                span.innerHTML = text;

                that.updateid = window.requestAnimationFrame(
                    that.animate.bind(that), that.Renderer.domElement );
                that.Renderer.clear();
                that.Renderer.render(that, that.camera);
            }
    } else { //if !server
        var object = new Configuration(this.server);
        for (var key in object ){
            object[key] = this[key];
        }

        this.animate = function(){

        };
        this.server_time = 0;
        this.laststate = {};
    }

}; //world.constructor














world_core.prototype = Object.create(THREE.Scene.prototype);

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

        this.Clients[avatar_obj.userid] = avatar_obj;
    };
}());

world_core.prototype.deletePlayer = function(userid){
    if(this.Clients.hasOwnProperty(userid)){
        this.remove(this.Clients[userid]);
        delete this.Clients[userid];
    }
};
world_core.prototype.updatePlayers = function(new_coords){
    var cli = this.Clients[new_coords.userid];
    if(cli != undefined){
        cli.position.set(
            new_coords.x,
            new_coords.y,
            new_coords.z);
    }
    
};




















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

    var _playersettings = this.gui.addFolder('Your settings');

        this.colorcontrol = _playersettings.addColor(this, 'color');

            //We want to know when we change our color so we can tell
            //the server to tell the other clients for us
        this.colorcontrol.onChange(function(value) {
            this.players.self.color = value;
            localStorage.setItem('color', value);
            this.socket.send('c.' + value);
        }.bind(this));

        _playersettings.open();

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


