(function(){
    //load Builders
    mmo.World_Objects.Sun = function(){
        var f = function(){
            if(typeof mmo == "undefined"){
                Logger.log("Namespace mmo not Loaded", "Camera");
                return false;
            } else if(typeof mmo.World_Objects == "undefined"){
                Logger.log("Namespace mmo.World_Attributes Altered", "Camera");
                return false;
            }
            return true;
        };

        if (!f()){
            return;
        }
    }
    //Define Builder properties here


})();

mmo.World_Objects.Sun_obj = function(sun_size, x, y, material, config){
    THREE.Mesh.call(this, new THREE.SphereGeometry(sun_size, x, y), material);
/*
    console.log(material);*/

    this.DAY_NIGHT_SPEED = config.DAY_NIGHT_SPEED;
    this.WORLDSIZE = config.WORLDSIZE;
    this.FAR = config.FAR;

    this.animate = function(t, position){
        this.position.x = Math.sin(t/this.DAY_NIGHT_SPEED)*this.WORLDSIZE/1.8;
        this.position.y = Math.cos(t/this.DAY_NIGHT_SPEED)*this.FAR/4;
        this.lookAt(position);
    }
}

mmo.World_Objects.Sun_obj.prototype = Object.create(THREE.Mesh.prototype);