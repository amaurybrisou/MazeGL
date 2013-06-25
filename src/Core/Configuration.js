if(typeof global != 'undefined'){
    var Materials = require('./Materials.js');
    var FileDescriptor = require('./FileDescriptor.js');
    var FirstAvatar = require('./FirstAvatar.js');
    var FirstAvatar = require('./Attributes.js');
    var WorldObjects = require('./WorldObjects.js');
	var THREE = require('three');
}

var Configuration = function(server){
    //WINDOW
    this.SCREEN_SIZE_RATIO    = 100;
    this.WIDTH                = window.innerWidth ;//- this.SCREEN_SIZE_RATIO;
    this.HEIGHT               = window.innerHeight ;//- this.SCREEN_SIZE_RATIO;

    //COLORS
    this.WHITE                    = 0xFFFFFF;
    this.RED                      = new THREE.Color("rgb(219,0,0)");
    this.BG_COLOR                 = new THREE.Color("rgb(246,246,246)");
    this.FLOOR_COLOR              = new THREE.Color("rgb(249,249,249)");
    this.LIGHT_COLOR              = new THREE.Color("rgb(249,249,249)");
    this.STONES_EDGES_COLOR       = new THREE.Color("rgb(33,33,33)");
    this.STONES_FACES_COLOR       = new THREE.Color("rgb(249,249,249)");
    this.WALL_FACES_COLOR       = new THREE.Color("rgb(50,50,50)");
    this.SUN_COLOR                = new THREE.Color("rgb(33,33,33)");
    this.ORIGIN_COLOR             = new THREE.Color("rgb(66,66,66)");
    this.BC                       = 0;
    this.SC                       = 0;
    this.SEC                      = 0;
    this.DARKNESS                 = 0.17;
    this.LIGHTNESS                = 0.9;
    this.AVATAR_COLOR             = new THREE.Color("rgb(33,33,33)");

    //WORLD ASPECT
    this.WORLDSIZE            = 2160;
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
    this.STONES_UNIV_SIZE         = 20;
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

    this.WALL_FACES_MAT = new Materials.fillStoneMat(
        this.WALL_FACES_COLOR); // color
    
    //sun mat
    this.SUN_MAT          = new Materials.Sun_mat(
        this.SUN_COLOR); // color
    //avatar mat
    this.AVATAR_MAT       = new Materials.Avatar_mat(
        this.AVATAR_COLOR);

    this.PLANET_GEO = new Materials.Planet_Geo(this.WORLDSIZE);
    this.PLANET_MAT = new Materials.Planet_Materials(this.FLOOR_COLOR);

    //sun
    this.SUN              = new WorldObjects.Sun_obj(
        0, 100, 0, this.SUN_MAT, this.SUN_SIZE);

    this.WORLD_ORIGIN = Attributes.Origin(
            this.ORIGIN_COLOR,
            this.ORIGIN_SIZE,
            this.WORLDSIZE);
    //LIGHTS
    //sun light
    
    this.MAIN_LIGHT                   = new THREE.SpotLight(this.LIGHT_COLOR);
    this.MAIN_LIGHT_CAST_SHADOW       = true;
    this.MAIN_LIGHT_ANGLE             = Math.PI/2;
    this.MAIN_LIGHT_EXPONENT          = 2;
    this.MAIN_LIGHT_CAST_SHADOW       = true;
    this.MAIN_LIGHT_SHADOW_CAMERA_FAR = this.WORLDSIZE*2;
    this.MAIN_LIGHT_SHADOW_CAMERA_FOV = 100;
    this.MAIN_LIGHT_SHADOWBIAS        = 2;
    this.AMBIENT_LIGHT                = 0xeeeeee;
    

    
    this.AVATAR_MODEL_PATH               = null; // "Models/daemon2.obj";
    this.AVATAR_SCALE                    = 5;
    this.AVATAR_SIDE                     = function(){
        return this.AVATAR_SCALE/2 + Math.random()*this.AVATAR_SCALE/2;
    };
    this.AVATAR_RANGE_TARGET             = 100;
    this.AVATAR_NO_FLY                   = true;
    this.AVATAR_TRANS_VIEW_INCREMENT     = 40;
    this.AVATAR_ROT_VIEW_INCREMENT       = 0.09;



    this.lat = 0;
    this.lon = 0;
    this.phi = 0;
    this.theta = 0;

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.mouseDragOn = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseWheel = 0;

    this.eulerOrder = "XYZ";

    this.movementSpeed = 40;
    this.lookSpeed = 0.05;
    this.noFly = false;
    this.lookVertical = false;
    this.autoForward = false;
    this.activeLook = true;
    this.heightSpeed = false;
    this.heightCoef = 1.0;
    this.heightMin = 0.0;
    this.constrainVertical = true;
    this.verticalMin = 0;
    this.verticalMax = Math.PI;
    this.autoSpeedFactor = 0.0;
    this.freeze = false;

    //Client specific initialisation
    if(!server){
        this.AVATAR_TYPE      = FirstAvatar;
        //CAMERA
        this.VIEW_ANGLE       = 120;
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
        // this.SERVER_ADDR =  '94.23.199.5';
        this.SERVER_PORT =  9999;
        this.SERVER_ADDR =  '127.0.0.1';

        this.FileDescriptor = Network.FileDescriptor(
            this.SERVER_ADDR,
            this.SERVER_PORT);


        this.debug = true;
        
        this.net_latency = 0.001;           //the latency between the client and the server (ping/2)
        this.net_ping = 0.001;              //The round trip time from here to the server,and back


        this.interp_value = 100;              //100 ms latency between server and client interpolation for other clients
        this.buffer_size = 2;               //The size of the server history to keep for rewinding/interpolating.
        this.target_time = 0.01;            //the time where we want to be in the server timeline
        this.oldest_tick = 0.01;            //the last time tick we have available in the buffer

        this.client_time = 0.01;            //Our local 'clock' based on server time - client interpolation(net_offset).
        this.server_time = 0.01;            //The time the server reported it was at, last we heard from it
        
        this.dt = 0.016;                    //The time that the last frame took to run
        this.fps = 0;                       //The current instantaneous fps (1/this.dt)
        this.fps_avg_count = 0;             //The number of samples we have taken for fps_avg
        this.fps_avg = 0;                   //The current average fps displayed in the debug UI
        this.fps_avg_acc = 0;               //The accumulation of the last avgcount fps samples

    }


};


if(typeof global != 'undefined'){
	module.exports = global.Configuration = Configuration;
}
