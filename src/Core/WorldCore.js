if(typeof global != 'undefined'){
	var WorldBuilder = require('./Builders.js').WorldBuilder;
	var FileDescriptor = require('./FileDescriptor.js');
	var Materials = require('./Materials.js');
    var WorldObjects = require('./WorldObjects.js');
    var FirstAvatar = require('./FirstAvatar.js');
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
            var currTime = Date.now(), timeToCall = Math.max( 0, frame_time - ( currTime - lastTime ) );
            var id = window.setTimeout( function() { callback( currTime + timeToCall ); }, timeToCall );
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

    //     //Start a fast paced timer for measuring time easier
    // this.create_timer();

    //WINDOW
    this.SCREEN_SIZE_RATIO    = 100;
    this.WIDTH                = window.innerWidth - this.SCREEN_SIZE_RATIO;
    this.HEIGHT               = window.innerHeight - this.SCREEN_SIZE_RATIO;

    //COLORS
    this.BLACK                    = 0xFFFFFF;
    this.RED                      = new THREE.Color("rgb(219,0,0)");
    this.BG_COLOR                 = new THREE.Color("rgb(246,246,246)");
    this.FLOOR_COLOR              = new THREE.Color("rgb(249,249,249)");
    this.LIGHT_COLOR              = new THREE.Color("rgb(249,249,249)");
    this.STONES_EDGES_COLOR       = new THREE.Color("rgb(33,33,33)");
    this.STONES_FACES_COLOR       = new THREE.Color("rgb(249,249,249)");
    this.SUN_COLOR                = new THREE.Color("rgb(33,33,33)");
    this.ORIGIN_COLOR             = new THREE.Color("rgb(66,66,66)");
    this.BC                       = 0;
    this.SC                       = 0;
    this.SEC                      = 0;
    this.DARKNESS                 = 0.17;
    this.LIGHTNESS                = 0.9;
    this.AVATAR_COLOR             = new THREE.Color("rgb(33,33,33)");

    //WORLD ASPECT
    this.WORLDSIZE            = 216000/2;
    this.LIGHT_SPEED          = 100000;
    this.DAY_NIGHT_SPEED      = this.LIGHT_SPEED;
    this.ORIGIN_SIZE          = 0.2;
    this.SUN_SIZE             = this.WORLDSIZE/10;
    this.WORLD_TEXTURE_URL    = "textures/noise_blur.png";
    this.TEXTURE_SIZE         = 512;

    //WORLD OBJECTS
    //floor
    this.PLANET_FLOOR             = new THREE.PlaneGeometry(
    	this.WORLDSIZE, this.WORLDSIZE, 10, 10);
    this.PLANE_ROT_X              = (-Math.PI/2);
    this.PLANE_ROT_Y              = 0;
    //stones
    this.NB_STONES                = 1000;
    this.STONES_SIZE_RATIO        = 100;
    this.STONES_EDGES_LINEWIDTH   = 4;
    //fog
    this.FOG_DENSITY              = 0.00002;
    this.FOG                      = new THREE.FogExp2(
    	this.FOG_COLOR, this.FOG_DENSITY);

    //MATERIALS
    //stones mat
    this.STONES_EDGES_MAT = new Materials.strokeStoneMat(
    	this.STONES_EDGES_COLOR,
    	this.STONES_EDGES_LINEWIDTH); //color , wireframeLinewidth
    this.STONES_FACES_MAT = new Materials.fillStoneMat(
    	this.STONES_FACES_COLOR); // color
    //sun mat
    this.SUN_MAT          = new Materials.Sun_mat(
    	this.SUN_COLOR); // color
    //avatar mat
    this.AVATAR_MAT       = new Materials.Avatar_mat(
    	this.AVATAR_COLOR);


    //sun
    this.SUN              = new WorldObjects.Sun_obj(
    	0, 100, 0, this.SUN_MAT, this.SUN_SIZE);


    //SHADERS
    //this.UNIFORMS = Shaders.Uniforms();


    


    //LIGHTS
    //sun light
    this.LIGHTS = {
        MAIN_LIGHT                   : new THREE.SpotLight(this.LIGHT_COLOR),
        MAIN_LIGHT_CAST_SHADOW       : true,
        MAIN_LIGHT_ANGLE             : Math.PI/2,
        MAIN_LIGHT_EXPONENT          : 2,
        MAIN_LIGHT_CAST_SHADOW       : true,
        MAIN_LIGHT_SHADOW_CAMERA_FAR : this.WORLDSIZE*2,
        MAIN_LIGHT_SHADOW_CAMERA_FOV : 100,
        MAIN_LIGHT_SHADOWBIAS        : 2,
        //ambient light
        AMBIENT_LIGHT                : 0xeeeeee,
    }
    
    //Client specific initialisation
    if(!this.server){

        this.Renderer = Renderer(this);

        document.getElementById('canvasCont').appendChild(this.Renderer.domElement);

        this.Renderer.setClearColor(this.BG_COLOR, 1.0);
        this.Renderer.clear();

        var span = document.getElementById('infos');
        var text = document.createTextNode('');

        //AVATAR I
        this.AVATAR_TYPE                       = FirstAvatar;
        this.AVATAR_MODEL_PATH                = null; // "Models/daemon2.obj";
        this.AVATAR_SCALE                    = 5;
        this.AVATAR_SIDE                     = function(){
        	return this.AVATAR_SCALE/2 + Math.random()*this.AVATAR_SCALE/2;
        };
        this.AVATAR_RANGE_TARGET             = 100;
        this.AVATAR_NO_FLY                   = true;
        this.AVATAR_TRANS_VIEW_INCREMENT     = 40;
        this.AVATAR_ROT_VIEW_INCREMENT       = 0.09;
    
        //CAMERA
        this.VIEW_ANGLE       = 100;
        this.ASPECT           = this.WIDTH / this.HEIGHT;
        this.NEAR             = 0.1;
        this.FAR              = this.WORLDSIZE;
        this.CAM_ROT_SPEED    = 2000;
        this.CAM_POS_X        = 50
        this.CAM_POS_Y        = 20;
        this.CAM_POS_Z        = -10;
        this.CAM_POS_RATIO    = 3;
        this.LOOK_VERTICAL    = true;
        this.FREEZE           = false;

        //NETWORK   SERVER CLOUD9
	    this.SERVER_ADDR =  '127.0.0.1';
	    this.SERVER_PORT =  80;
	    this.FileDescriptor = Network.FileDescriptor(
            this.SERVER_ADDR,
            this.SERVER_PORT);

        var avatarMat = Materials.Avatar_mat(
                this.AVATAR_COLOR);
        this.avatar_obj = new this.AVATAR_TYPE(
                0, 0, 0, avatarMat, this);

        
        this.animate = function(t, position){
                // animate
                if(!this.server){
                    this.avatar_obj.animate();
                    //  this.camera.animate();
                }
                this.SUN.animate(t, this);
                // color ratios
                if (Math.cos(t / this.DAY_NIGHT_SPEED) + 0.06 >= this.DARKNESS) {
                    this.BC = Math.cos(t / this.DAY_NIGHT_SPEED) + 0.06;
                }
                else {
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
                }
                // floor color
                //this.PLANET_MAT.color.setRGB(this.SC, this.SC, this.SC);

                // stones color
                this.STONES_FACES_MAT.color.setRGB(this.SC, this.SC, this.SC);

                // stones edges color
                this.STONES_EDGES_MAT.color.setRGB(this.SEC, this.SEC, this.SEC);

                // fog color
                this.FOG.color.setRGB(this.SEC, this.SEC, this.SEC);




                // main light and sun movements
                this.LIGHTS.MAIN_LIGHT.position.y = Math.cos(t / this.DAY_NIGHT_SPEED) * 
                    this.FAR / 2;
                /*    window.mmo.sun.position.y = Math.cos(t/day_night_speed)*FAR/4;
                */
                this.LIGHTS.MAIN_LIGHT.position.x = Math.sin(t / this.DAY_NIGHT_SPEED) *
                    this.WORLDSIZE / 2;
                /*    window.mmo.sun.position.x = Math.sin(t/day_night_speed)*WORLDSIZE/1.8;
                */

                this.LIGHTS.MAIN_LIGHT.lookAt(this.position);
                //window.mmo.SUN.lookAt(window.mmo.position);
                this.updateid = window.requestAnimationFrame(
                    this.animate.bind(this), this.Renderer.domElement );
            }
            //Create the default configuration settings
        //this.client_create_configuration();

            //A list of recent server updates we interpolate across
            //This is the buffer that is the driving factor for our networking
        this.server_updates = [];

            //Connect to the socket.io server!
        //this.client_connect_to_server();

            //We start pinging the server to determine latency
        //this.client_create_ping_timer();

            //Set their colors from the storage or locally
        // this.color = localStorage.getItem('color') || '#cc8822' ;
        // localStorage.setItem('color', this.color);
        // this.players.self.color = this.color;

        //     //Make this only if requested
        // if(String(window.location).indexOf('debug') != -1) {
        //     this.client_create_debug_gui();
        // }

    } else { //if !server
        this.animate = function(){

        };
        this.server_time = 0;
        this.laststate = {};

    }


    if(!this.server){
        this.camera = WorldUtils.getCamera(this);
        this.add(this.camera);
        
        this.camera.lookAt(this.position);
        console.log("Camera Loaded ", "WorldBuilder");
    

        this.WORLD_TEXTURE = WorldUtils.getWorldTexture(this);
        this.WORLD_TEXTURE.repeat.set(1024, 1024);
        console.log("World_Texture Loaded ", "WorldBuilder");
    }

    // build floor
    this.PLANE = WorldUtils.getPlane(
        this.PLANE_ROT_X,
        this.PLANE_ROT_Y,
        this.PLANE_RECV_SHADOW,
        this.FLOOR_COLOR,
        this.WORLDSIZE);
    this.add(this.PLANE);
    console.log("Plane Loaded");

    // build sun
    this.add(this.SUN);
    
    this.MAIN_LIGHT = WorldUtils.getMainLight(this.LIGHTS);
    this.add(this.MAIN_LIGHT);
    console.log("Main Light Loaded ");

    this.AMBIENT_LIGHT = new THREE.AmbientLight(this.LIGHTS.AMBIENT_LIGHT);
    this.add(this.AMBIENT_LIGHT);
    console.log("Ambient Light Loaded ");

    // build origin
    this.wo_origin = Attributes.Origin(
        this.ORIGIN_COLOR,
        this.ORIGIN_SIZE,
        this.WORLDSIZE);
    for (var i = 0; i < this.wo_origin.length; i++) {
        this.add(this.wo_origin[i]);
    }
    console.log("Origin Loaded ");

    //Build Stones;
    Builders.StoneBuilder(
        this,
        this.NB_STONES,
        this.WORLDSIZE,
        this.STONES_FACES_MAT,
        this.STONES_EDGES_MAT,
        this.STONES_SIZE_RATIO);
    console.log("Stones Loaded ");

    // build avatar
    if(!this.server){
        avatar_obj = WorldUtils.getAvatar(this);
        this.camera.reset();

        this.add(this.avatar_obj);
        console.log("Avatar Loaded ", "WorldBuilder");
    }
    
    // build fog
    this.fog = this.FOG;
    

    // window.mmo.shadowMapEnabled = true;

    // window.mmo.RENDERER.setClearColor(window.mmo.BG_COLOR, 1.0);
    // window.mmo.RENDERER.clear();
    if(!this.server){
        this.camera.lookAt(this.position);
    }

}; //world.constructor

world_core.prototype = Object.create(THREE.Scene.prototype);

if( 'undefined' != typeof global ) {
    module.exports = global.world_core = world_core;
}
