(function(){
    //load Builders
        var f = function(){
        if(typeof window.mmo == "undefined"){
            window.Logger.log("mmo is not Defined", "World_v1");
            return false;
        } else if( typeof window.mmo.World == "undefined"){
            window.Logger.log("mmo.World is Altered", "World_v1");
        }
        return true;
        };

        if (!f()){
            return null;
        }

})();



window.mmo.World.FirstWorld = function() {
    this.animate = function(t, position){
        this.SUN.animate(t, position, this.WORLDSIZE, this.FAR);
    };
    
    window.mmo.SCREEN_SIZE_RATIO = 100;
    window.mmo.WIDTH = window.innerWidth - window.mmo.SCREEN_SIZE_RATIO;
    window.mmo.HEIGHT = window.innerHeight - window.mmo.SCREEN_SIZE_RATIO;
    window.mmo.RENDERER = window.mmo.Renderer();
    window.mmo.MAX_ANYSTROPIE = window.mmo.RENDERER.getMaxAnisotropy();
    window.mmo.BG_COLOR = new window.THREE.Color("rgb(246,246,246)");
    window.mmo.WORLDSIZE = 216000/2;
    window.mmo.BLACK = 0xFFFFFF;
    window.mmo.TRANS_VIEW_INCREMENT = 70;
    window.mmo.ROT_VIEW_INCREMENT = 0.1;
    //CAMERA VARS
    window.mmo.VIEW_ANGLE  =  62;
    window.mmo.ASPECT      =  window.mmo.WIDTH / window.mmo.HEIGHT;
    window.mmo.NEAR        =  0.1;
    window.mmo.FAR         =  window.mmo.WORLDSIZE*2;
    window.mmo.NB_STONES = 1000;
    window.mmo.STONES_SIZE_RATIO = 100;
    window.mmo.STONEs_FACES_COLOR = new window.THREE.Color("rgb(233,233,233)");
    window.mmo.CAM_ROT_SPEED = 20000;
    window.mmo.LIGHT_SPEED = 20000;
    window.mmo.DAY_NIGHT_SPEED = window.mmo.LIGHT_SPEED;
    window.mmo.CAM_POS_X = 50
    window.mmo.CAM_POS_Y = 10;
    window.mmo.CAM_POS_Z = -10;
    window.mmo.CAM_POS_RATIO = 10;

    window.mmo.ORIGIN_SIZE = 0.2;
    window.mmo.SUN_SIZE = window.mmo.WORLDSIZE/10;
    window.mmo.SUBLIGHT_POS_RATIO = 150;
    window.mmo.RANGE_TARGET = 100;
    window.mmo.NO_FLY = true;
    window.mmo.LOOK_VERTICAL = false;
    window.mmo.PLANE_ROT_X = (-Math.PI/2);
    window.mmo.PLANE_ROT_Y = 0;
    window.mmo.PLACE_RECV_SHADOW = false;
    window.mmo.WORLD_TYPE = window.mmo.World.FirstWorld;
    window.mmo.AVATAR_TYPE = window.mmo.Avatar.FirstAvatar;
    window.mmo.FREEZE = false;
    window.mmo.WORLD_TEXTURE_URL = "textures/noise_blur.png";
    window.mmo.TEXTURE_SIZE = 512;
    //COLORS
    window.mmo.FLOOR_COLOR = new window.THREE.Color("rgb(249,249,249)");
    window.mmo.LIGHT_COLOR = new window.THREE.Color("rgb(249,249,249)");
    window.mmo.MAIN_LIGHT_CAST_SHADOW = true;
    window.mmo.SUB_SUN_LIGHT_CAST_SHADOW = true;
    window.mmo.MAIN_LIGHT = new window.THREE.SpotLight(window.mmo.LIGHT_COLOR);
    window.mmo.MAIN_LIGHT_CAST_SHADOW = true;
    window.mmo.MAIN_LIGHT_SHADOW_CAMERA_FAR = window.mmo.WORLDSIZE*2;
    window.mmo.MAIN_LIGHT_SHADOW_CAMERA_FOV = 2;
    window.mmo.AMBIENT_LIGHT = 0xeeeeee;
    window.mmo.PLANET_FLOOR = new window.THREE.PlaneGeometry(window.mmo.WORLDSIZE, window.mmo.WORLDSIZE, 10, 10);
    window.mmo.SUB_SUN_LIGHT_COLOR = new window.THREE.Color("rgb(215,210,157)");
    window.mmo.STONES_COLOR = new window.THREE.Color("rgb(233,233,233)");
    window.mmo.EMISSIVE_COLOR = new window.THREE.Color("rgb(66,66,66)");
    window.mmo.RED = new window.THREE.Color("rgb(219,0,0)");
    window.mmo.SUN_COLOR = new window.THREE.Color("rgb(66,66,66)");
    window.mmo.ORIGIN_COLOR = new window.THREE.Color("rgb(66,66,66)");
    window.mmo.BC = 0;
    window.mmo.SC = 0;
    window.mmo.DARKNESS = 0.2;
    window.mmo.UNIFORMS = window.mmo.Shaders.Uniforms();


};