(function(){
    //load Builders
        var f = function(){
        if(typeof mmo == "undefined"){
            Logger.log("mmo is not Defined", "World_v1");
            return false;
        } else if( typeof mmo.World == "undefined"){
            Logger.log("mmo.World is Altered", "World_v1");
        }
        return true;
        };

        if (!f()){
            return null;
        }

})();

mmo.World.FirstWorld = function(){
    this.animate = function(t, position){
        this.SUN.animate(t, position, this.WORLDSIZE, this.FAR);
    };
};


mmo.World.FirstWorld.config = function() {

    /*if(typeof config == "undefined"){
        config = {};
    }*/

    config.setRenderer = function(renderer){
        config.RENDERER = renderer;
        config.MAX_ANYSTROPIE = config.RENDERER.getMaxAnisotropy();

    }
    config.SCREEN_SIZE_RATIO = 100;
    config.WIDTH = window.innerWidth - config.SCREEN_SIZE_RATIO;
    config.HEIGHT = window.innerHeight - config.SCREEN_SIZE_RATIO;
    config.BG_COLOR = new THREE.Color("rgb(246,246,246)");
    config.WORLDSIZE = 216000/2;

    config.BLACK = 0xFFFFFF;

    config.TRANS_VIEW_INCREMENT = 70;
    config.ROT_VIEW_INCREMENT = 0.1;
    //CAMERA VARS
    config.VIEW_ANGLE  =  62;
    config.ASPECT      =  config.WIDTH / config.HEIGHT;
    config.NEAR        =  0.1;
    config.FAR         =  config.WORLDSIZE*2;

    config.NB_STONES = 1000;
    config.STONES_SIZE_RATIO = 100;

    config.CAM_ROT_SPEED = 20000;

    config.LIGHT_SPEED = 20000;
    config.DAY_NIGHT_SPEED = config.LIGHT_SPEED;

    config.CAM_POS_X = 50
    config.CAM_POS_Y = 10;
    config.CAM_POS_Z = -10;

    config.ORIGIN_SIZE = 0.2;

    config.SUN_SIZE = config.WORLDSIZE/10;
    config.SUBLIGHT_POS_RATIO = 150;
    config.RANGE_TARGET = 100;
    config.NO_FLY = true;
    config.LOOK_VERTICAL = false;

    config.PLANE_ROT_X = -Math.PI/2;
    config.PLANE_ROT_Y = 0;
    config.PLACE_RECV_SHADOW = true;


    config.AVATAR_TYPE = mmo.Avatar.FirstAvatar;
    config.FREEZE = false;

    config.WORLD_TEXTURE_URL = "textures/noise_blur.png";
    config.TEXTURE_SIZE = 512;

    //COLORS
    config.FLOOR_COLOR = new THREE.Color("rgb(249,249,249)");
    config.LIGHT_COLOR = new THREE.Color("rgb(249,249,249)");

    config.MAIN_LIGHT_CAST_SHADOW = true;
    config.SUB_SUN_LIGHT_CAST_SHADOW = true;

    config.MAIN_LIGHT = new THREE.SpotLight(config.LIGHT_COLOR);
    config.MAIN_LIGHT_CAST_SHADOW = true;
    config.MAIN_LIGHT_SHADOW_CAMERA_FAR = config.WORLDSIZE*2;
    config.MAIN_LIGHT_SHADOW_CAMERA_FOV = 2;

    config.AMBIENT_LIGHT = 0xeeeeee;

    config.PLANET_FLOOR = new THREE.PlaneGeometry(config.WORLDSIZE, config.WORLDSIZE, 10, 10);

    config.SUB_SUN_LIGHT_COLOR = new THREE.Color("rgb(215,210,157)");
    config.STONES_COLOR = new THREE.Color("rgb(233,233,233)");
    config.EMISSIVE_COLOR = new THREE.Color("rgb(66,66,66)");
    config.RED = new THREE.Color("rgb(219,0,0)");
    config.SUN_COLOR = new THREE.Color("rgb(66,66,66)");
    config.ORIGIN_COLOR = new THREE.Color("rgb(66,66,66)");

    config.BC = 0;
    config.SC = 0;
    config.DARKNESS = 0.2;
    config.UNIFORMS = mmo.Shaders.Uniforms(config.DARKNESS);

    return config;
};