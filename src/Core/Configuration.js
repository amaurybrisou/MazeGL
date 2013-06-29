if(typeof global != 'undefined'){
    var Materials = require('./Materials.js');
    var FileDescriptor = require('./FileDescriptor.js');
    var FirstAvatar = require('./FirstAvatar.js');
    var FirstAvatar = require('./Attributes.js');
	var THREE = require('three');
}

var Configuration = function(server){
    //WINDOW
    this.SCREEN_SIZE_RATIO    = 100;
    this.WIDTH                = window.innerWidth - this.SCREEN_SIZE_RATIO;
    this.HEIGHT               = window.innerHeight - this.SCREEN_SIZE_RATIO;

    //COLORS
    this.WHITE                    = 0xFFFFFF;
    this.RED                      = new THREE.Color("rgb(219,0,0)");
    this.BG_COLOR                 = new THREE.Color("rgb(246,246,246)");
    // this.FLOOR_COLOR              = new THREE.Color("rgb(100,223,97)");
    this.LIGHT_COLOR              = new THREE.Color("rgb(249,249,249)");
    this.STONES_EDGES_COLOR       = new THREE.Color("rgb(33,33,33)");
    this.STONES_FACES_COLOR       = new THREE.Color("rgb(249,249,249)");
    this.WALL_FACES_COLOR         = new THREE.Color("rgb(110,27,93)");
    this.BEGIN_END_FACES_COLOR    = new THREE.Color("rgb(00,220,00)");
    this.SUN_COLOR                = new THREE.Color("rgb(33,33,33)");
    this.ORIGIN_COLOR             = new THREE.Color("rgb(66,66,66)");
    // this.MAZE_CUBE_COLOR          = new THREE.Color("rgb(0,21,255)");
    this.BC                       = 0;
    this.SC                       = 0;
    this.SEC                      = 0;
    this.DARKNESS                 = 0.17;
    this.LIGHTNESS                = 0.9;
    this.AVATAR_COLOR             = new THREE.Color("rgb(33,33,33)");

    //WORLD ASPECT
    this.WORLDSIZE            = 4096;
    this.LIGHT_SPEED          = 100000;
    this.DAY_NIGHT_SPEED      = this.LIGHT_SPEED;
    this.ORIGIN_SIZE          = 0.2;
    this.SUN_SIZE             = this.WORLDSIZE/10;
    
    this.WORLD_TEXTURE_URL    = "textures/mur-fissure.png";
    this.SKY_TEXTURE          = "textures/immeuble-verre.png";
    this.MAZE_CUBE_TEXTURE    = "textures/vitre-cassee-nb.png";
    
    this.REP_HOR_MAZE_CUBE       = 16;
    this.REP_VERT_MAZE_CUBE      = 1;

    this.REP_HOR_FLOOR         = this.WORLDSIZE / 10;
    this.REP_VERT_FLOOR         = this.WORLDSIZE / 10;

    this.TEXTURE_SIZE         = 512;

    //COllision obstavles
    this.obstacles             = [];
    //WORLD OBJECTS
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

    this.BEGIN_END_FACES_MAT = new Materials.fillStoneMat(
        this.BEGIN_END_FACES_COLOR); // color
    
    //sun mat
    this.SUN_MAT          = new Materials.Sun_mat(
        this.SUN_COLOR); // color
    //avatar mat
    this.AVATAR_MAT       = new Materials.Avatar_mat(
        this.AVATAR_COLOR);

    //floor
    this.PLANE_RECV_SHADOW = true;
    this.PLANET_GEO = new Materials.Planet_Geo(this.WORLDSIZE, 100, 100);
    this.PLANET_MAT = new Materials.Planet_Materials(this.FLOOR_COLOR);
    this.PLANE_ROT_X              = -(Math.PI/2);
    this.PLANE_ROT_Y              = 0;


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
    
    this.BLOCK_SIZE = this.WORLDSIZE / 35;
    
    this.AVATAR_MODEL_PATH               = null; // "Models/daemon2.obj";
    this.AVATAR_SCALE                    = 5;
    this.AVATAR_SIDE                     = function(){
        return this.AVATAR_SCALE/2 + Math.random()*this.AVATAR_SCALE/2;
    };
    this.AVATAR_RANGE_TARGET             = 100;
    this.AVATAR_NO_FLY                   = true;
    this.AVATAR_TRANS_VIEW_INCREMENT     = 40;
    this.AVATAR_ROT_VIEW_INCREMENT       = 0.09;
    this.AVATAR_POSITION = { 
        x : this.WORLDSIZE / 2  - (this.BLOCK_SIZE ),
        y : 0,
        z : this.WORLDSIZE / 2 - (this.BLOCK_SIZE)
    };



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

    

    //Client specific initialisation
    if(!server){
        this.AVATAR_TYPE      = FirstAvatar;
        //CAMERA
        this.VIEW_ANGLE       = 120;
        this.ASPECT           = this.WIDTH / this.HEIGHT;
        this.NEAR             = 0.1;
        this.FAR              = this.WORLDSIZE * 3;
        this.CAM_ROT_SPEED    = 2000;
        this.CAM_POS_X        = -50;
        this.CAM_POS_Y        = 20;
        this.CAM_POS_Z        = -10;
        this.CAM_POS_RATIO    = 5;
        this.LOOK_VERTICAL    = true;
        this.FREEZE           = false;

        
        //NETWORK   SERVER CLOUD9
        // this.SERVER_ADDR =  '94.23.199.5';
        this.SERVER_PORT =  9999;
        this.SERVER_ADDR =  '127.0.0.1';

        


        this.debug = false;
        
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

   
    this.movementSpeed = this.WORLDSIZE * 0.01;
    this.lookSpeed = 0.1;
    this.noFly = true;
    this.lookVertical = false;
    this.autoForward = false;
    this.activeLook = true;
    this.heightSpeed = true;
    this.heightCoef = 1.0;
    this.heightMin = 0.0;
    this.constrainVertical = true;
    this.verticalMin = 0;
    this.verticalMax = Math.PI;
    this.autoSpeedFactor = 0.0;
    this.freeze = false;
    
};



if(typeof global != 'undefined'){
	module.exports = global.Configuration = Configuration;
}
