(function(){
    //load Builders
    mmo.World = function(){
        var f = function(){
         if(typeof mmo == "undefined"){
          Logger.log("mmo is not Defined", "World");
          return false;
         } else if( typeof mmo.Builders.WorldBuilder == "undefined"){
             Logger.log("mmo is not Defined", "World");
             return false;
         }
         return true;
        };

        if (!f()){
            return null;
        }
        Logger.log("Module Loaded", "World");
    };
})();
//Default World extends this one to create your own
mmo.World = function() {
    THREE.Scene.call(this);

    this.getColor = function(rgb_str){
        return new THREE.Color(rgb_str);
    };

    this.getSubSun = function(){
        var SUB_SUN = mmo.Lights.Sub_Sun_Light(
            mmo.Materials.Sub_Sun_Materials(this.SUB_SUN_LIGHT_COLOR));
        SUB_SUN.castShadow = this.SUB_SUN_LIGHT_CAST_SHADOW;
        return SUB_SUN;
    };

    this.getSubLight = function(){
        var SUBLIGHT = mmo.Lights.Sub_Light(this.SUBLIGHT_COLOR);
        SUBLIGHT.castShadow = this.SUBLIGHT_CAST_SHADOW;
        return SUBLIGHT;
    };

    this.getPlane = function(){
        var plane = new THREE.Mesh(
            mmo.Materials.Planet_Geo(this.WORLDSIZE),
            mmo.Materials.Planet_Materials(this.WORLD_TEXTURE));

        plane.rotation.x = this.PLANE_ROT_X;
        plane.position.y = this.PLANE_ROT_Y;
        plane.receiveShadow = this.PLANE_RECV_SHADOW;
        return plane;
    };

    this.getAvatar = function(config){

        var avatarMat = mmo.Materials.Avatar_mat(
            mmo.Shaders.Uniforms(this.DARKNESS),
            mmo.Attributes.Avatar);
        console.log(avatarMat);
        var avatar_obj = new config.AVATAR_TYPE(
            avatarMat, 0, 0, 0,
            config,
            null);
        return avatar_obj;
    };

    this.getMainLight = function(){
        var MAIN_LIGHT = new THREE.SpotLight(this.LIGHT_COLOR);
        MAIN_LIGHT.castShadow = this.MAIN_LIGHT_CAST_SHADOW;
        MAIN_LIGHT.shadowCameraFar = this.WORLDSIZE*2;
        MAIN_LIGHT.shadowCameraFov = 2;
        return MAIN_LIGHT;
    };
    this.getWorldTexture = function(){
        var WORLD_TEXTURE = THREE.ImageUtils.loadTexture(this.WORLD_TEXTURE_URL);
        WORLD_TEXTURE.wrapS = WORLD_TEXTURE.wrapT = THREE.RepeatWrapping;
        return WORLD_TEXTURE;
    };

    this.getCamera = function(){
        var camera = mmo.Attributes.Camera(this.VIEW_ANGLE,
            this.ASPECT, this.NEAR, this.FAR);

        camera.position.set(this.CAM_POS_X, this.CAM_POS_Y, this.CAM_POS_Z);
        var camControls = new THREE.FirstPersonControls( camera, this.SCREEN_SIZE_RATIO );
        camControls.movementSpeed = this.TRANS_VIEW_INCREMENT;
        camControls.lookSpeed = this.ROT_VIEW_INCREMENT;
        camControls.noFly = this.NO_FLY;
        camControls.lookVertical = this.LOOK_VERTICAL;
        camera.lookAt(this.position);
        return camera;

    };

    this.getSun = function(){
        var sun_mat = mmo.Materials.Sun_mat(this.SUN_COLOR);
        return new mmo.World_Objects.Sun_obj(this.SUN_SIZE, 50, 50,
            sun_mat,
            {
                DAY_NIGHT_SPEED : this.DAY_NIGHT_SPEED,
                WORLDSIZE : this.WORLDSIZE,
                FAR : this.FAR
            });
    };

    this.animate = function(t, position){
        this.sun.animate(t, this.position, this.WORLDSIZE);
    };
};

mmo.World.prototype = Object.create(THREE.Scene.prototype);
