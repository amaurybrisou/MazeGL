(function(){

    var f = function(){
        if(typeof window.mmo == "undefined"){
              console.log("Error : Namespace mmo not Loaded");
              return false;
            } else if(typeof window.mmo.Builders == "undefined"){
                      console.log("Error : Namespace mmo not Loaded");
                      return false;
            }
            return true;
        }

        if(!f){
            return;
        }
})();


window.mmo.Builders.WorldBuilder = function(){
    window.mmo.World.call(this);
    
    //var world_scheme = new window.mmo.WORLD_TYPE(); 
     
    this.getCamera();
    this.add(window.mmo.camera);
    window.mmo.camera.lookAt(this.position);
    window.Logger.log("Camera Loaded ", "WorldBuilder");

    window.mmo.WORLD_TEXTURE = this.getWorldTexture();
    window.mmo.WORLD_TEXTURE.repeat.set( 1024 , 1024 );
    this.WORLD_TEXTURE = window.mmo.WORLD_TEXTURE;
    window.Logger.log("World_Texture Loaded ", "WorldBuilder");

    //très long à charger
    // window.mmo.SUN = this.getSun();
    // this.add(window.mmo.SUN);
    // window.Logger.log("Sun Loaded ", "WorldBuilder");

    window.mmo.MAIN_LIGHT = this.getMainLight();
    this.add(window.mmo.MAIN_LIGHT);
    window.Logger.log("Main Light Loaded ", "WorldBuilder");

    window.mmo.PLANE = this.getPlane();
    this.add(window.mmo.PLANE);
    window.Logger.log("Plane Loaded ", "WorldBuilder");
    
    window.mmo.AMBIENT_LIGHT = new window.THREE.AmbientLight(window.mmo.AMBIENT_LIGHT);
    this.add(window.mmo.AMBIENT_LIGHT);
    window.Logger.log("Ambient Light Loaded ", "WorldBuilder");

    window.mmo.ORIGIN_COLOR = new window.THREE.Color("rgb(66,66,66)");
    this.wo_origin = window.mmo.Attributes.Origin();
    for(var i = 0; i < this.wo_origin.length; i++){
        this.add(this.wo_origin[i]);
    }
    window.Logger.log("Origin Loaded ", "WorldBuilder");

    //Build Stones;
    window.mmo.Builders.StoneBuilder(this);
    window.Logger.log("Stones Loaded ", "WorldBuilder");

    window.mmo.avatar_kb = new window.mmo.Events.KeyboardEvents.Avatar_kb();
    /*for(nodeBall in this.avatar_obj.nodesBalls){
        this.add(nodeBall);
    }*/
    window.mmo.avatar_obj = this.getAvatar();

    window.mmo.camera.position.set(
        window.mmo.avatar_obj.position.x, 
        window.mmo.avatar_obj.position.y,
        window.mmo.avatar_obj.position.z);
        
    window.mmo.camera.lookAt(window.mmo.avatar_obj.position);
    window.mmo.camera.position.x += 0;
    window.mmo.camera.position.y += window.mmo.CAM_POS_RATIO/4;
    window.mmo.camera.position.z += window.mmo.CAM_POS_RATIO;

    window.mmo.avatar_obj.add(window.mmo.camera);
  
    this.add(window.mmo.avatar_obj);
    window.Logger.log("Avatar Loaded ", "WorldBuilder");
    //this.camera = config.camera;

    // if(typeof world_scheme.update != "undefined"){
    //     this.update = world_scheme.update;
    //     window.Logger.log("An specific update function is define in your world", "WorldBuilder");
    // }

    // //Get animate method from invoc world or take the default World.js animate funnction.
    // if(typeof world_scheme.animate != "undefined"){
    //     this.animate = world_scheme.animate;
    //     window.Logger.log("A specific animate function is define in your world", "WorldBuilder");
    // }

    //..... ADD content

};

window.mmo.Builders.WorldBuilder.prototype = Object.create(window.mmo.World.prototype);