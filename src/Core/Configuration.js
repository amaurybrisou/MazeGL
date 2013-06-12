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
    this.WORLDSIZE            = 216000;
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

    //Client specific initialisation
    if(!server){
        this.AVATAR_TYPE      = FirstAvatar;
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
        this.SERVER_PORT =  9999;
        this.FileDescriptor = Network.FileDescriptor(
            this.SERVER_ADDR,
            this.SERVER_PORT);
    }
};


if(typeof global != 'undefined'){
	module.exports = global.Configuration = Configuration;
}