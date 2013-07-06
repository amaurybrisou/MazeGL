if(typeof global != 'undefined'){
    var THREE = require('three');
    var Materials = require('./Materials.js');
    var Configuration = require('./Configuration.js');
}



var WorldObjects = {
    getSun : function(x, y, z, material, size){
    
        THREE.Mesh.call(this,
                        new THREE.SphereGeometry(size,50,50),
                        material );

        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
        
        this.animate = function(t, instance){
            this.position.x = Math.sin(t/instance.DAY_NIGHT_SPEED)*instance.WORLDSIZE/1.8;
            this.position.y = Math.cos(t/instance.DAY_NIGHT_SPEED)*instance.FAR/4;
        }

    },
    Fog_obj : function(FOG_DENSITY){
        THREE.FogExp2.call(this);
        
        this.color.setRGB()
        this.setDensity(FOG_DENSITY);
    
    },

    Stone : function(x, y, z, width, height, depth, mat1, mat2){

        this.y = y;
        this.x = x;
        this.z = z;
        this.width = width;
        this.height = height;
        this.depth = depth;

        var mergedGeo = new THREE.Geometry();
        var mesh1 = new THREE.Mesh(
            new THREE.CubeGeometry( this.width, this.height, this.depth ),
            mat1);
        var mesh2 = new THREE.Mesh(
            new THREE.CubeGeometry( this.width, this.height, this.depth ),
            mat2);

        THREE.GeometryUtils.setMaterialIndex( mesh1.geometry, 0 );
        THREE.GeometryUtils.setMaterialIndex( mesh2.geometry, 1 );
        THREE.GeometryUtils.merge(mergedGeo, mesh1);
        THREE.GeometryUtils.merge(mergedGeo, mesh2);

        var stone = new THREE.Mesh(
                          mergedGeo,
                          new THREE.MeshFaceMaterial([mesh1.material, mesh2.material])
                        );

        stone.position.x = this.x;
        stone.position.y = this.y;
        stone.position.z = this.z;

        stone.castShadow = true;

        return stone;
    },

    Stone_Algo : function(x, z, stones_size, height, mat1, mat2) {
        this.x = x;
        this.z = z;
        this.height = height;

        var mergedGeo = new window.THREE.Geometry();

        var mesh1 = new window.THREE.Mesh(
            new window.THREE.CubeGeometry(  stones_size, 
                                            this.height, 
                                            stones_size ),
            mat1
        );

        var mesh2 = new window.THREE.Mesh(
            new window.THREE.CubeGeometry(  stones_size, 
                                            this.height, 
                                            stones_size ),
            mat2
        );

        window.THREE.GeometryUtils.setMaterialIndex( mesh1.geometry, 0 );
        window.THREE.GeometryUtils.setMaterialIndex( mesh2.geometry, 1 );
        window.THREE.GeometryUtils.merge(mergedGeo, mesh1);
        window.THREE.GeometryUtils.merge(mergedGeo, mesh2);

        var stone = new window.THREE.Mesh(
            mergedGeo,
            new window.THREE.MeshFaceMaterial([mesh1.material, mesh2.material])
        );

        stone.position.x = this.x;
        stone.position.y = this.height/2;
        stone.position.z = this.z;

        stone.castShadow = true;

        return stone;
    },

    cube : function(x, y, z, mat){
        
        //mat.wireframe = true;
        var geo = new THREE.CubeGeometry(x, y, z);
        var wall = new THREE.Mesh(
            geo,
            mat);
        wall.castShadow = true;

        return wall;
    },

    getPlane : function(){
        
        var world_texture = undefined;
        if(this.WORLD_TEXTURE_URL){
            world_texture = THREE.ImageUtils.loadTexture(this.WORLD_TEXTURE_URL);
            world_texture.wrapS = world_texture.wrapT = THREE.RepeatWrapping;
            world_texture.repeat.set(this.REP_HOR_FLOOR,this.REP_VERT_FLOOR  );
        }

        var mat = new Materials.Planet_Materials(this.FLOOR_COLOR, world_texture );
        var geom = new Materials.Planet_Geo(this.WORLDSIZE, 100, 100);
        var plane = new THREE.Mesh( geom , mat);

        plane.rotation.x = this.PLANE_ROT_X;
        plane.position.y = this.PLANE_ROT_Y;
        //plane.receiveShadow = this.PLANE_RECV_SHADOW;
        plane.wireframe = true;
        return plane;
    },

    getCamera : function(){
        var that = this;
        var cam = new THREE.PerspectiveCamera(
                this.VIEW_ANGLE,
                this.ASPECT,
                this.NEAR,
                this.FAR);


        cam.reset = function (avatar_obj) {

            this.position.x += 0;//
            this.position.y += 0;//that.AVATAR_SCALE * that.CAM_POS_RATIO / 4;
            this.position.z += that.AVATAR_SCALE * that.CAM_POS_RATIO;
        

            this.lookAt(new THREE.Vector3(0,0,0));
        };

        return cam;
    },

    getMainLight : function(){
        
        var s = new THREE.SpotLight(this.LIGHT_COLOR);
        
        s.castShadow = this.MAIN_LIGHT_CAST_SHADOW;
        s.angle = this.MAIN_LIGHT_ANGLE;
        s.exponent = this.MAIN_LIGHT_EXPONENT;
        s.shadowBias = this.MAIN_LIGHT_SHADOWBIAS;
        s.shadowCameraFar = this.MAIN_LIGHT_SHADOW_CAMERA_FAR;
        s.shadowCameraFov = this.MAIN_LIGHT_SHADOW_CAMERA_FOV;
        return s;
    },

    getSky: function(){

        var dimension = this.WORLDSIZE;
        var skyGeometry = new THREE.CubeGeometry( dimension
            , dimension
            , dimension
         );  
        var materialArray = [];

        var world_texture = THREE.ImageUtils.loadTexture(this.SKY_TEXTURE);
        world_texture.wrapS = world_texture.wrapT = THREE.RepeatWrapping;
        world_texture.repeat.set(1,1);

        for (var i = 0; i < 6; i++)
            materialArray.push( new THREE.MeshBasicMaterial({
                map: world_texture,
                side: THREE.BackSide
            }));
        var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
        var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
        return skyBox
    }

};

WorldObjects.getSun.prototype = Object.create(THREE.Mesh.prototype);
WorldObjects.Fog_obj.prototype = Object.create(THREE.FogExp2.prototype);

var conf = new Configuration();
for(var key in conf){
   WorldObjects[key] = conf[key];
}

if(typeof global != 'undefined'){
    module.exports = global.WorldObjects = WorldObjects;
}
