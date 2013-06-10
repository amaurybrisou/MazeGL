if(typeof global != 'undefined'){

	var FileDescriptor = require('./FileDescriptor.js');
	var Materials = require('./Materials.js');
    var Attributes = require('./Attributes.js');
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
    
    this.AVATAR_TYPE                     = FirstAvatar;
    this.AVATAR_MODEL_PATH               = null; // "Models/daemon2.obj";
    this.AVATAR_SCALE                    = 5;
    this.AVATAR_SIDE                     = function(){
        return this.AVATAR_SCALE/2 + Math.random()*this.AVATAR_SCALE/2;
    };
    this.AVATAR_RANGE_TARGET             = 100;
    this.AVATAR_NO_FLY                   = true;
    this.AVATAR_TRANS_VIEW_INCREMENT     = 40;
    this.AVATAR_ROT_VIEW_INCREMENT       = 0.09;

    //Client specific initialisation
    if(!this.server){

        this.Renderer = RENDERER(this);

        document.getElementById('canvasCont').appendChild(this.Renderer.domElement);

        this.Renderer.setClearColor(this.BG_COLOR, 1.0);
        this.Renderer.clear();

        
        var span = document.getElementById('infos');
        var text = document.createTextNode('');

        //AVATAR I
        
    
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

        this.PLANET_GEO = Materials.Planet_Geo(this.WORLDSIZE);
        this.PLANET_MAT = Materials.Planet_Materials(this.FLOOR_COLOR);

        //NETWORK   SERVER CLOUD9
	    this.SERVER_ADDR =  '127.0.0.1';
	    this.SERVER_PORT =  9999;
	    this.FileDescriptor = Network.FileDescriptor(
            this.SERVER_ADDR,
            this.SERVER_PORT);

        var avatarMat = Materials.Avatar_mat(
                this.AVATAR_COLOR);
        

        if(!this.server){
            this.camera = this.getCamera(this);
            this.add(this.camera);
            
            this.camera.lookAt(this.position);
            console.log("Camera Loaded ", "WorldBuilder");
        
            this.WORLD_TEXTURE = this.getWorldTexture(this);
            this.WORLD_TEXTURE.repeat.set(1024, 1024);
            console.log("World_Texture Loaded ", "WorldBuilder");
        }

        // build floor
        this.PLANE = this.getPlane();
        this.add(this.PLANE);
        console.log("Plane Loaded");

        // build sun
        this.add(this.SUN);
        
        this.MAIN_LIGHT = this.getMainLight();
        this.add(this.MAIN_LIGHT);
        console.log("Main Light Loaded ");

        this.AMBIENT_LIGHT = new THREE.AmbientLight();
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
        this.StoneBuilder();
        console.log("Stones Loaded ");

        // // build avatar
        if(!this.server){
            //this.avatar_obj = this.getAvatar(this);
        //     this.camera.reset();
        //     this.avatar_obj.add(this.camera);
        //     this.add(this.avatar_obj);
        //     console.log("Avatar Loaded ", "WorldBuilder");
         }
        
        // build fog
        this.fog = this.FOG;
        
        if(!this.server){
            this.camera.lookAt(this.position);
        }
        
        this.animate = function(t, position){
                // animate
                if(!that.server){
                    if(typeof this.avatar_obj != 'undefined'){
                        that.avatar_obj.animate();
                    }
                    //that.SUN.animate(t, that);
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
                

                // stones color
                that.STONES_FACES_MAT.color.setRGB(that.SC, that.SC, that.SC);

                // stones edges color
                that.STONES_EDGES_MAT.color.setRGB(that.SEC, that.SEC, that.SEC);

                // fog color
                that.FOG.color.setRGB(that.SEC, that.SEC, that.SEC);


                // main light and sun movements
                that.LIGHTS.MAIN_LIGHT.position.y = Math.cos(t / that.DAY_NIGHT_SPEED) * 
                    that.FAR / 2;
                /*    window.mmo.sun.position.y = Math.cos(t/day_night_speed)*FAR/4;
                */
                that.LIGHTS.MAIN_LIGHT.position.x = Math.sin(t / that.DAY_NIGHT_SPEED) *
                    that.WORLDSIZE / 2;
                /*    window.mmo.sun.position.x = Math.sin(t/day_night_speed)*WORLDSIZE/1.8;
                */

                that.LIGHTS.MAIN_LIGHT.lookAt(that.position);

                // HTML CONTENT
                span.innerHTML = ''; // clear existing

                var connection_status = Network.FileDescriptor.readyState === ( 1 || 2 || 0 )
                ? "Connected" : "Disconnected";
                text = 'time : ' + Math.round(that.LIGHTS.MAIN_LIGHT.position.y / 1000) + 
                '</br>cam coords : ' + that.camera.position.x + 
                " " + that.camera.position.y + 
                " " + that.camera.position.z; 
                if(typeof this.Clients.length > 0){
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
        this.animate = function(){

        };
        this.server_time = 0;
        this.laststate = {};

    }

}; //world.constructor














world_core.prototype = Object.create(THREE.Scene.prototype);

world_core.prototype.addPlayer = (function(){
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

        console.log("Player Created");
        this.add(this.avatar_obj);
        console.log(this.avatar_obj.userid);

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

        console.log("New Remote Player Added");
        this.add(avatar_obj);

        this.Clients[avatar_obj.userid] = avatar_obj;
        console.log(this.Clients);
    };
}());

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
    var camera = new THREE.PerspectiveCamera(
            this.VIEW_ANGLE,
            this.ASPECT,
            this.NEAR,
            this.FAR);
    camera.position.set(
        this.CAM_POS_X,
        this.CAM_POS_Y,
        this.CAM_POS_Z
    );
    

    
    camera.reset = function () {
        this.position.set(
            that.avatar_obj.position.x,
            that.avatar_obj.position.y,
            that.avatar_obj.position.z);

            this.position.x += 0;
            this.position.y += that.AVATAR_SCALE * that.CAM_POS_RATIO / 4;
            this.position.z += that.AVATAR_SCALE * that.CAM_POS_RATIO;

            this.lookAt(that.avatar_obj.position);

    };

    camera.animate = function () {

        this.position.set(
            that.avatar_obj.position.x,
            that.avatar_obj.position.y,
            that.avatar_obj.position.z);
        this.lookAt(that.avatar_obj.position);
        this.position.x = that.AVATAR_SCALE/2;
        this.position.y = that.AVATAR_SCALE;
        this.position.z = that.AVATAR_SCALE * 4;


    };
    
    
    return camera;
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

    var avatarMat = Materials.Avatar_mat(
        this.AVATAR_COLOR);
    return new this.AVATAR_TYPE(
        x, y, z, avatarMat, this);
};

world_core.prototype.getMainLight = function(){
    
    var MAIN_LIGHT = new THREE.SpotLight(this.LIGHT_COLOR);
    
    MAIN_LIGHT.castShadow = this.MAIN_LIGHT_CAST_SHADOW;
    MAIN_LIGHT.angle = this.MAIN_LIGHT_ANGLE;
    MAIN_LIGHT.exponent = this.MAIN_LIGHT_EXPONENT;
    MAIN_LIGHT.shadowBias = this.MAIN_LIGHT_SHADOWBIAS;
    MAIN_LIGHT.shadowCameraFar = this.MAIN_LIGHT_SHADOW_CAMERA_FAR;
    MAIN_LIGHT.shadowCameraFov = this.MAIN_LIGHT_SHADOW_CAMERA_FOV;
    return MAIN_LIGHT;
};

world_core.prototype.getWorldTexture = function(){
    var WORLD_TEXTURE = THREE.ImageUtils.loadTexture(this.WORLD_TEXTURE_URL);
    
    WORLD_TEXTURE.wrapS = WORLD_TEXTURE.wrapT = THREE.RepeatWrapping;
    return WORLD_TEXTURE;
};

world_core.prototype.getSun = function(){
    var sun_mat = Materials.Sun_mat(this.SUN_COLOR);
    
    return new WorldObjects.Sun_obj(this.SUN_SIZE, 50, 50,
        sun_mat,
        {
            DAY_NIGHT_SPEED : this.DAY_NIGHT_SPEED,
            WORLDSIZE : this.WORLDSIZE,
            FAR : this.FAR
        });
};   

if( 'undefined' != typeof global ) {
    module.exports = global.world_core = world_core;
}
