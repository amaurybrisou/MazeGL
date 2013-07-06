if(typeof global != 'undefined'){
	var world_core = require('./WorldCore.js');
	    var THREE = require('three');

}

var WorldUtils = {

	StoneBuilder :  function(){

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
	   
	},

	getCamera : function(){
	    var camera = new WorldObjects.Camera(this);
	    
	    camera.position.set(
	        this.CAM_POS_X,
	        this.CAM_POS_Y,
	        this.CAM_POS_Z
	    );
	    return camera;
	},

	getColor : function(rgb_str){
	    return new window.THREE.Color(rgb_str);
	},

	getPlane : function(){
	    var plane = new THREE.Mesh(
	        this.PLANET_GEO,
	        this.PLANET_MAT);
	 
	    plane.rotation.x = this.PLANE_ROT_X;
	    plane.position.y = this.PLANE_ROT_Y;
	    plane.receiveShadow = this.PLANE_RECV_SHADOW;
	    
        plane.useQuaternion = true;

	    return plane;
	},

	getAvatar : function(){

	    var avatarMat = Materials.Avatar_mat(
	        this.AVATAR_COLOR);

	    var avatar_obj = new this.AVATAR_TYPE(
	        0, 0, 0, avatarMat, this);
	    return avatar_obj;
	},

	getMainLight : function(){
	    
	    var MAIN_LIGHT = new THREE.SpotLight(this.LIGHT_COLOR);
	    
	    MAIN_LIGHT.castShadow = this.MAIN_LIGHT_CAST_SHADOW;
	    MAIN_LIGHT.angle = this.MAIN_LIGHT_ANGLE;
	    MAIN_LIGHT.exponent = this.MAIN_LIGHT_EXPONENT;
	    MAIN_LIGHT.shadowBias = this.MAIN_LIGHT_SHADOWBIAS;
	    MAIN_LIGHT.shadowCameraFar = this.MAIN_LIGHT_SHADOW_CAMERA_FAR;
	    MAIN_LIGHT.shadowCameraFov = this.MAIN_LIGHT_SHADOW_CAMERA_FOV;
	    return MAIN_LIGHT;
	},

	getWorldTexture : function(){
	    var WORLD_TEXTURE = THREE.ImageUtils.loadTexture(this.WORLD_TEXTURE_URL);
	    
	    WORLD_TEXTURE.wrapS = WORLD_TEXTURE.wrapT = THREE.RepeatWrapping;
	    return WORLD_TEXTURE;
	},

	getSun : function(){
	    var sun_mat = Materials.Sun_mat(this.SUN_COLOR);
	    
	    return new WorldObjects.Sun_obj(this.SUN_SIZE, 50, 50,
	        sun_mat,
	        {
	            DAY_NIGHT_SPEED : this.DAY_NIGHT_SPEED,
	            WORLDSIZE : this.WORLDSIZE,
	            FAR : this.FAR
	        });
	}
}


if(typeof global != 'undefined'){
	module.exports = global.WorldUtils = WorldUtils;
}