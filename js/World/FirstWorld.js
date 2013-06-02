(function(){
    //load Builders
        var f = function(){
        if(typeof window.mmo == "undefined"){
            window.Logger.log(window.Level.CRITICAL, "mmo is not Defined", "World_v1");
            return false;
        } else if( typeof window.mmo.World == "undefined"){
            window.Logger.log(window.Level.CRITICAL, "mmo.World is Altered", "World_v1");
        }
        return true;
        };

        if (!f()){
            return null;
        }
        window.Logger.log(window.Level.FINE, "Module Loaded", "FirstWorld");
})();



window.mmo.World.FirstWorld = function() {

    window.mmo.WORLD_TYPE           = window.mmo.World.FirstWorld;

    //FRAMERATE
    window.mmo.__FRAMERATE__ =  1000 / 60;
    //WINDOW
    window.mmo.SCREEN_SIZE_RATIO    = 100;
    window.mmo.WIDTH                = window.innerWidth - window.mmo.SCREEN_SIZE_RATIO;
    window.mmo.HEIGHT               = window.innerHeight - window.mmo.SCREEN_SIZE_RATIO;
    window.mmo.RENDERER             = window.mmo.Renderer();


    //COLORS
    window.mmo.BLACK                    = 0xFFFFFF;
    window.mmo.RED                      = new window.THREE.Color("rgb(219,0,0)");
    window.mmo.BG_COLOR                 = new window.THREE.Color("rgb(246,246,246)");
    window.mmo.FLOOR_COLOR              = new window.THREE.Color("rgb(249,249,249)");
    window.mmo.LIGHT_COLOR              = new window.THREE.Color("rgb(249,249,249)");
    window.mmo.STONES_EDGES_COLOR       = new window.THREE.Color("rgb(33,33,33)");
    window.mmo.STONES_FACES_COLOR       = new window.THREE.Color("rgb(249,249,249)");
    window.mmo.SUN_COLOR                = new window.THREE.Color("rgb(33,33,33)");
    window.mmo.ORIGIN_COLOR             = new window.THREE.Color("rgb(66,66,66)");
    window.mmo.BC                       = 0;
    window.mmo.SC                       = 0;
    window.mmo.SEC                      = 0;
    window.mmo.DARKNESS                 = 0.17;
    window.mmo.LIGHTNESS                = 0.9;
    window.mmo.AVATAR_COLOR             = new window.THREE.Color("rgb(33,33,33)");


    //WORLD ASPECT
    window.mmo.WORLDSIZE            = 216000/2;
    window.mmo.LIGHT_SPEED          = 100000;
    window.mmo.DAY_NIGHT_SPEED      = window.mmo.LIGHT_SPEED;
    window.mmo.ORIGIN_SIZE          = 0.2;
    window.mmo.SUN_SIZE             = window.mmo.WORLDSIZE/10;
    window.mmo.WORLD_TEXTURE_URL    = "textures/noise_blur.png";
    window.mmo.TEXTURE_SIZE         = 512;
    //window.mmo.MAX_ANYSTROPIE       = window.mmo.RENDERER.getMaxAnisotropy();


    //WORLD OBJECTS
    //floor
    window.mmo.PLANET_FLOOR             = new window.THREE.PlaneGeometry(window.mmo.WORLDSIZE, window.mmo.WORLDSIZE, 10, 10);
    window.mmo.PLANE_ROT_X              = (-Math.PI/2);
    window.mmo.PLANE_ROT_Y              = 0;
    //stones
    window.mmo.NB_STONES                = 1000;
    window.mmo.STONES_SIZE_RATIO        = 100;
    window.mmo.STONES_EDGES_LINEWIDTH   = 4;
    //fog
    window.mmo.FOG_DENSITY              = 0.00002;
    window.mmo.FOG                      = new window.THREE.FogExp2(window.mmo.FOG_COLOR, window.mmo.FOG_DENSITY);



    //MATERIALS
    //stones mat
    window.mmo.STONES_EDGES_MAT = new window.mmo.Materials.strokeStoneMat(); //color , wireframeLinewidth
    window.mmo.STONES_FACES_MAT = new window.mmo.Materials.fillStoneMat(); // color
    //sun mat
    window.mmo.SUN_MAT          = new window.mmo.Materials.Sun_mat(); // color
    //avatar mat
    window.mmo.AVATAR_MAT       = new window.mmo.Materials.Avatar_mat();


    //sun
    window.mmo.SUN              = new window.mmo.World_Objects.Sun_obj(0, 100, 0, window.mmo.SUN_MAT, window.mmo.SUN_SIZE);


    //SHADERS
    window.mmo.UNIFORMS = window.mmo.Shaders.Uniforms();


    //CAMERA
    window.mmo.VIEW_ANGLE       = 60;
    window.mmo.ASPECT           = window.mmo.WIDTH / window.mmo.HEIGHT;
    window.mmo.NEAR             = 0.1;
    window.mmo.FAR              = window.mmo.WORLDSIZE;
    window.mmo.CAM_ROT_SPEED    = 20000;
    window.mmo.CAM_POS_X        = 50
    window.mmo.CAM_POS_Y        = 20;
    window.mmo.CAM_POS_Z        = -10;
    window.mmo.CAM_POS_RATIO    = 3;
    window.mmo.LOOK_VERTICAL    = true;
    window.mmo.FREEZE           = false;


    //LIGHTS
    //sun light
    window.mmo.MAIN_LIGHT                   = new window.THREE.SpotLight(window.mmo.LIGHT_COLOR);
    window.mmo.MAIN_LIGHT_CAST_SHADOW       = true;
    window.mmo.MAIN_LIGHT_ANGLE             = Math.PI/2;
    window.mmo.MAIN_LIGHT_EXPONENT          = 2;
    window.mmo.MAIN_LIGHT_CAST_SHADOW       = true;
    window.mmo.MAIN_LIGHT_SHADOW_CAMERA_FAR = window.mmo.WORLDSIZE*2;
    window.mmo.MAIN_LIGHT_SHADOW_CAMERA_FOV = 100;
    window.mmo.MAIN_LIGHT_SHADOWBIAS        = 2;
    //ambient light
    window.mmo.AMBIENT_LIGHT                = 0xeeeeee;


    //NETWORK   SERVER CLOUD9
    //window.mmo.SERVER_ADDR = 'ws://127.6.24.1';
    //window.mmo.SERVER_PORT =  15265;

    //SERVER AMAURY
    window.mmo.SERVER_ADDR = 'ws://192.168.1.33';
    window.mmo.SERVER_PORT =  9999;

    window.mmo.FileDescriptor = window.mmo.Network.FileDescriptor();
    
    //AVATAR I
    window.mmo.AVATAR_TYPE                      = window.mmo.Avatar.FirstAvatar;
    window.mmo.AVATAR_MODEL_PATH                = null; "Models/daemon2.obj";
    window.mmo.AVATAR_SCALE                    = 5;
    window.mmo.AVATAR_SIDE                     = function(){return window.mmo.AVATAR_SCALE/2 + Math.random()*window.mmo.AVATAR_SCALE/2;};
    window.mmo.AVATAR_RANGE_TARGET             = 100;
    window.mmo.AVATAR_NO_FLY                   = true;
    window.mmo.AVATAR_TRANS_VIEW_INCREMENT     = 40;
    window.mmo.AVATAR_ROT_VIEW_INCREMENT       = 0.09;
    
    //AVATAR II
    window.mmo.AVATAR_II_TYPE                     = window.mmo.Avatar.FirstAvatar;
    window.mmo.AVATAR_II_MODEL_PATH               = null; "Models/daemon2.obj";
    window.mmo.AVATAR_II_SCALE                    = 5;
    window.mmo.AVATAR_II_SIDE                     = function(){return window.mmo.AVATAR_II_SCALE/2 + Math.random()*window.mmo.AVATAR_II_SCALE/2;};
    window.mmo.AVATAR_II_RANGE_TARGET             = 100;
    window.mmo.AVATAR_II_NO_FLY                   = true;
    window.mmo.AVATAR_II_TRANS_VIEW_INCREMENT     = 40;
    window.mmo.AVATAR_II_ROT_VIEW_INCREMENT       = 0.09;


    this.animate = function(t, position){
        this.SUN.animate(t, position, this.WORLDSIZE, this.FAR);
    };

};