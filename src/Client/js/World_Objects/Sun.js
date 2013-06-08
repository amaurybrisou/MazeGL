(function(){
    //load Builders
    var f = function(){
        if(typeof window.mmo == "undefined"){
            window.Logger.log(window.Level.CRITICAL, "Namespace mmo not Loaded", "Sun");
            return false;
        } else if(typeof window.mmo.World_Objects == "undefined"){
            window.Logger.log(window.Level.CRITICAL, "Namespace mmo.World_Attributes Altered", "Sun");
            return false;
        }
        return true;
    };

    if (!f()){
        return;
    }
    
    //Define Builder properties here
})();

window.mmo.World_Objects.Sun_obj = function(x, y, z, material, size){
    
    window.THREE.Mesh.call(this);
    
    this.setGeometry( new window.THREE.SphereGeometry(size,50,50) );
    this.setMaterial(material);
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
    
    this.animate = function(t){
        this.position.x = Math.sin(t/window.mmo.DAY_NIGHT_SPEED)*window.mmo.WORLDSIZE/1.8;
        this.position.y = Math.cos(t/window.mmo.DAY_NIGHT_SPEED)*window.mmo.FAR/4;
        this.lookAt(window.mmo.position);
    }    
}

window.mmo.World_Objects.Sun_obj.prototype = Object.create(window.THREE.Mesh.prototype);