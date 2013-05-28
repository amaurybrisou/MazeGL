(function(){
    //load Builders
    window.mmo.World_Objects.Sun = function(){
        var f = function(){
            if(typeof window.mmo == "undefined"){
                window.Logger.log("Namespace mmo not Loaded", "Camera");
                return false;
            } else if(typeof window.mmo.World_Objects == "undefined"){
                window.Logger.log("Namespace mmo.World_Attributes Altered", "Camera");
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

window.mmo.World_Objects.Sun_obj = function(x, y, material){
    window.THREE.Mesh.call(this, new window.THREE.SphereGeometry(window.mmo.SUN_SIZE, x, y), material);
/*
    console.log(material);*/

    this.DAY_NIGHT_SPEED = window.mmo.DAY_NIGHT_SPEED;
    this.WORLDSIZE = window.mmo.WORLDSIZE;
    this.FAR = window.mmo.FAR;

    this.animate = function(t, position){
        this.position.x = Math.sin(t/window.mmo.DAY_NIGHT_SPEED)*window.mmo.WORLDSIZE/1.8;
        this.position.y = Math.cos(t/window.mmo.DAY_NIGHT_SPEED)*window.mmo.FAR/4;
        this.lookAt(position);
    }
}

window.mmo.World_Objects.Sun_obj.prototype = Object.create(window.THREE.Mesh.prototype);