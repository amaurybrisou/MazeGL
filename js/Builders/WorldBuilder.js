(function(){

    var f = function(){
        if(typeof mmo == "undefined"){
              console.log("Error : Namespace mmo not Loaded");
              return false;
            } else if(typeof mmo.Builders == "undefined"){
                      console.log("Error : Namespace mmo not Loaded");
                      return fase;
            }
            return true;
        }

        if(!f){
            return;
        }
})();


mmo.Builders.WorldBuilder = function(world_type, config){
    mmo.World.call(this);

    world_scheme = new world_type();
    //Get ALl Registered Configurations
    for (var element in config) {
        this[element] = config[element];
    }

    config.camera = this.camera = this.getCamera();
    this.add(this.camera);
    Logger.log("Camera Loaded ", "WorldBuilder");

    this.WORLD_TEXTURE = this.getWorldTexture();
    this.WORLD_TEXTURE.repeat.set( 1024 , 1024 );
    Logger.log("World_Texture Loaded ", "WorldBuilder");
    config.WORLD_TEXTURE = this.WORLD_TEXTURE;

    config.SUN = this.SUN = this.getSun();
    //console.log(this.SUN);
    this.add(this.SUN);
    Logger.log("Sun Loaded ", "WorldBuilder");

    config.MAIN_LIGHT = this.MAIN_LIGHT = this.getMainLight();
    this.add(this.MAIN_LIGHT);
    Logger.log("Main Light Loaded ", "WorldBuilder");

    config.SUBLIGHT = this.SUBLIGHT = this.getSubLight();
    this.add(this.SUBLIGHT);
    Logger.log("Sublight Loaded ", "WorldBuilder");

    config.SUB_SUN = this.SUB_SUN = this.getSubSun();
    this.add(this.SUB_SUN);
    Logger.log("Sub Sun Loaded ", "WorldBuilder");

    config.PLANE = this.PLANE = this.getPlane();
    this.add(this.PLANE);
    Logger.log("Place Loaded ", "WorldBuilder");

    config.AMBIENT_LIGHT = this.AMBIENT_LIGHT = new THREE.AmbientLight( this.AMBIENT_LIGHT );
    this.add(this.AMBIENT_LIGHT);
    Logger.log("Ambient Light Loaded ", "WorldBuilder");

    config.ORIGIN_COLOR = this.ORIGIN_COLOR = new THREE.Color("rgb(66,66,66)");
    wo_origin = mmo.Attributes.Origin(this.WORLDSIZE, this.ORIGIN_SIZE, this.ORIGIN_COLOR);
    for( i = 0; i < wo_origin.length; i++){
        this.add(wo_origin[i]);
    }
    Logger.log("Origin Loaded ", "WorldBuilder");

    //Build Stones;
    mmo.Builders.StoneBuilder(
        this,
        this.NB_STONES,
        this.UNIFORMS,
        this.WORLDSIZE,
        this.STONES_SIZE_RATIO,
        mmo.Materials.Stone_Materials(
            this.STONES_COLOR),
            mmo.Attributes.Stone.displacement);
    Logger.log("Stones Loaded ", "WorldBuilder");


    this.avatar_obj = this.getAvatar(config);
    console.log(this.avatar_obj);
    /*for(nodeBall in this.avatar_obj.nodesBalls){
        this.add(nodeBall);
    }*/
    this.avatar_obj.add(config.camera);
    this.add(this.avatar_obj);
    Logger.log("Avatar Loaded ", "WorldBuilder");
    //this.camera = config.camera;


    if(typeof world_scheme.update != "undefined"){
        this.update = world_scheme.update;
        Logger.log("An specific update function is define in your world", "WorldBuilder");
    }

    //Get animate method from invoc world or take the default World.js animate funnction.
    if(typeof world_scheme.animate != "undefined"){
        this.animate = world_scheme.animate;
        Logger.log("An specific animate function is define in your world", "WorldBuilder");
    }

    //..... ADD content

};

mmo.Builders.WorldBuilder.prototype = Object.create(mmo.World.prototype);