if(typeof global != 'undefined'){
    var THREE = require('three');
    var WorldObjects = require('./WorldObjects.js');
    var Materials = require('./Materials.js');

}

var WorldUtils = {

    getCamera : function(instance){
        var camera = new WorldObjects.Camera(instance);
        
        camera.position.set(
            instance.CAM_POS_X,
            instance.CAM_POS_Y,
            instance.CAM_POS_Z
        );
        return camera;
    },
    
    getColor : function(rgb_str){
        return new window.THREE.Color(rgb_str);
    },


    getPlane : function(PLANE_ROT_X, PLANE_ROT_Y, PLANE_RECV_SHADOW, FLOOR_COLOR, WORLDSIZE){
        var PLANET_MAT = Materials.Planet_Materials(FLOOR_COLOR);
        var PLANET_GEO = Materials.Planet_Geo(WORLDSIZE);
        
        var plane = new THREE.Mesh(
            PLANET_GEO,
            PLANET_MAT);
     
        plane.rotation.x = PLANE_ROT_X;
        plane.position.y = PLANE_ROT_Y;
        plane.receiveShadow = PLANE_RECV_SHADOW;
        
        return plane;
    },

    getAvatar : function(instance){

        var avatarMat = Materials.Avatar_mat(
            instance.AVATAR_COLOR);

        var avatar_obj = new instance.AVATAR_TYPE(
            0, 0, 0, avatarMat, instance);
        return avatar_obj;
    },

    getMainLight : function(pLights){
        
        var MAIN_LIGHT = new THREE.SpotLight(pLights.LIGHT_COLOR);
        
        MAIN_LIGHT.castShadow = pLights.MAIN_LIGHT_CAST_SHADOW;
        MAIN_LIGHT.angle = pLights.MAIN_LIGHT_ANGLE;
        MAIN_LIGHT.exponent = pLights.MAIN_LIGHT_EXPONENT;
        MAIN_LIGHT.shadowBias = pLights.MAIN_LIGHT_SHADOWBIAS;
        MAIN_LIGHT.shadowCameraFar = pLights.MAIN_LIGHT_SHADOW_CAMERA_FAR;
        MAIN_LIGHT.shadowCameraFov = pLights.MAIN_LIGHT_SHADOW_CAMERA_FOV;
        return MAIN_LIGHT;
    },

    getWorldTexture : function(instance){
        var WORLD_TEXTURE = THREE.ImageUtils.loadTexture(instance.WORLD_TEXTURE_URL);
        
        WORLD_TEXTURE.wrapS = WORLD_TEXTURE.wrapT = THREE.RepeatWrapping;
        return WORLD_TEXTURE;
    },

    getSun : function(){
        var sun_mat = window.mmo.Materials.Sun_mat();
        
        return new window.mmo.World_Objects.Sun_obj(window.mmo.SUN_SIZE, 50, 50,
            sun_mat,
            {
                DAY_NIGHT_SPEED : window.mmo.DAY_NIGHT_SPEED,
                WORLDSIZE : window.mmo.WORLDSIZE,
                FAR : window.mmo.FAR
            });
    }   
};

if( 'undefined' != typeof global ) {
    module.exports = global.WorldUtils = WorldUtils;
}