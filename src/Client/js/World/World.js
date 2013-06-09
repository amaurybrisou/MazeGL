(function(){
    //load Builders
    window.mmo.World = function(){
        var f = function(){
         if(typeof window.mmo == "undefined"){
          window.Logger.log( window.Level.CRITICAL, "mmo is not Defined", "World");
          return false;
         } else if( typeof window.mmo.Builders.WorldBuilder == "undefined"){
             window.Logger.log(window.Level.CRITICAL, "mmo is not Defined", "World");
             return false;
         }
         return true;
        };

        if (!f()){
            return null;
        }
        window.Logger.log(window.Level.FINE, "Module Loaded", "World");
    };
})();

//Default World extends window.mmo one to create your own
window.mmo.World = function() {
    window.THREE.Scene.call(this);

    this.getCamera = function(){
        window.mmo.camera = new window.mmo.World_Objects.Camera();
        
        window.mmo.camera.position.set(
            window.mmo.CAM_POS_X,
            window.mmo.CAM_POS_Y,
            window.mmo.CAM_POS_Z
        );
        
        window.mmo.position = {
            x : 0,
            y : 0,
            z : 0
        };
        
        return window.mmo.camera;
    };
    
    this.getColor = function(rgb_str){
        return new window.THREE.Color(rgb_str);
    };


    this.getPlane = function(){
        window.mmo.PLANET_MAT = window.mmo.Materials.Planet_Materials();
        window.mmo.PLANET_GEO = window.mmo.Materials.Planet_Geo();
        
        var plane = new window.THREE.Mesh(
            window.mmo.PLANET_GEO,
            window.mmo.PLANET_MAT);
     
        plane.rotation.x = window.mmo.PLANE_ROT_X;
        plane.position.y = window.mmo.PLANE_ROT_Y;
        plane.receiveShadow = window.mmo.PLANE_RECV_SHADOW;
        
        return plane;
    };

    this.getAvatar = function(){

        var avatarMat = window.mmo.Materials.Avatar_mat(
            window.mmo.UNIFORMS,
            window.mmo.Attributes.Avatar);

        var avatar_obj = new window.mmo.AVATAR_TYPE(
            0, 0, 0);
        return avatar_obj;
    };

    this.getMainLight = function(){
        
        var MAIN_LIGHT = new window.THREE.SpotLight(window.mmo.LIGHT_COLOR);
        
        MAIN_LIGHT.castShadow = window.mmo.MAIN_LIGHT_CAST_SHADOW;
        MAIN_LIGHT.angle = window.mmo.MAIN_LIGHT_ANGLE;
        MAIN_LIGHT.exponent = window.mmo.MAIN_LIGHT_EXPONENT;
        MAIN_LIGHT.shadowBias = window.mmo.MAIN_LIGHT_SHADOWBIAS;
        MAIN_LIGHT.shadowCameraFar = window.mmo.MAIN_LIGHT_SHADOW_CAMERA_FAR;
        MAIN_LIGHT.shadowCameraFov = window.mmo.MAIN_LIGHT_SHADOW_CAMERA_FOV;
        return MAIN_LIGHT;
    };

    this.getWorldTexture = function(){
        var WORLD_TEXTURE = window.THREE.ImageUtils.loadTexture(window.mmo.WORLD_TEXTURE_URL);
        
        WORLD_TEXTURE.wrapS = WORLD_TEXTURE.wrapT = window.THREE.RepeatWrapping;
        return WORLD_TEXTURE;
    };

    this.getSun = function(){
        var sun_mat = window.mmo.Materials.Sun_mat();
        
        return new window.mmo.World_Objects.Sun_obj(window.mmo.SUN_SIZE, 50, 50,
            sun_mat,
            {
                DAY_NIGHT_SPEED : window.mmo.DAY_NIGHT_SPEED,
                WORLDSIZE : window.mmo.WORLDSIZE,
                FAR : window.mmo.FAR
            });
    };

    this.animate = function(t, position){

        // animate
        window.mmo.avatar_obj.animate();
        window.mmo.camera.animate();
        window.mmo.SUN.animate(t);
        // color ratios
        if (Math.cos(t / window.mmo.DAY_NIGHT_SPEED) + 0.06 >= window.mmo.DARKNESS) {
            window.mmo.BC = Math.cos(t / window.mmo.DAY_NIGHT_SPEED) + 0.06;
        }
        else {
            window.mmo.BC = window.mmo.DARKNESS;
        }
        if (Math.cos(t / window.mmo.DAY_NIGHT_SPEED) + 0.06 >= window.mmo.LIGHTNESS) {
            window.mmo.BC = window.mmo.LIGHTNESS;
        }


        if (Math.cos(t / window.mmo.DAY_NIGHT_SPEED) >= window.mmo.DARKNESS) {
            window.mmo.SC = Math.cos(t / window.mmo.DAY_NIGHT_SPEED);
        }
        else {
            window.mmo.SC = window.mmo.DARKNESS;
        }
        if (Math.cos(t / window.mmo.DAY_NIGHT_SPEED) >= window.mmo.LIGHTNESS) {
            window.mmo.SC = window.mmo.LIGHTNESS;
        }

        if (-Math.cos(t / window.mmo.DAY_NIGHT_SPEED) >= window.mmo.DARKNESS) {
            window.mmo.SEC = -Math.cos(t / window.mmo.DAY_NIGHT_SPEED);
        }
        else {
            window.mmo.SEC = window.mmo.DARKNESS;
        }
        if (-Math.cos(t / window.mmo.DAY_NIGHT_SPEED) >= window.mmo.LIGHTNESS) {
            window.mmo.SEC = window.mmo.LIGHTNESS;
        }


        // background color
        window.mmo.BG_COLOR.setRGB(window.mmo.BC, window.mmo.BC, window.mmo.BC);

        window.mmo.RENDERER.setClearColor(window.mmo.BG_COLOR, 1.0);

        // floor color
        window.mmo.PLANET_MAT.color.setRGB(window.mmo.SC, window.mmo.SC, window.mmo.SC);

        // stones color
        window.mmo.STONES_FACES_MAT.color.setRGB(window.mmo.SC, window.mmo.SC, window.mmo.SC);

        // stones edges color
        window.mmo.STONES_EDGES_MAT.color.setRGB(window.mmo.SEC, window.mmo.SEC, window.mmo.SEC);

        // fog color
        this.fog.color.setRGB(window.mmo.SEC, window.mmo.SEC, window.mmo.SEC);




        // main light and sun movements
        window.mmo.MAIN_LIGHT.position.y = Math.cos(t / window.mmo.DAY_NIGHT_SPEED) * window.mmo.FAR / 2;
        /*    window.mmo.sun.position.y = Math.cos(t/day_night_speed)*FAR/4;
        */
        window.mmo.MAIN_LIGHT.position.x = Math.sin(t / window.mmo.DAY_NIGHT_SPEED) * window.mmo.WORLDSIZE / 2;
        /*    window.mmo.sun.position.x = Math.sin(t/day_night_speed)*WORLDSIZE/1.8;
        */

        window.mmo.MAIN_LIGHT.lookAt(window.mmo.position);
        //window.mmo.SUN.lookAt(window.mmo.position);

    };
};

window.mmo.World.prototype = Object.create(window.THREE.Scene.prototype);
