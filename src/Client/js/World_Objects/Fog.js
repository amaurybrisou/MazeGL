(function(){
    //load Builders
    var f = function(){
        if(typeof window.mmo == "undefined"){
            window.Logger.log(window.Level.CRITICAL, "Namespace mmo not Loaded", "Fog");
            return false;
        } else if(typeof window.mmo.World_Objects == "undefined"){
            window.Logger.log(window.Level.CRITICAL, "Namespace mmo.World_Attributes Altered", "Fog");
            return false;
        }
        return true;
    };

    if (!f()){
        return;
    }
    
    //Define Builder properties here
})();

window.mmo.World_Objects.Fog_obj = function(){
    window.THREE.FogExp2.call(this);
    
    this.color.setRGB()
    this.setDensity(window.mmo.FOG_DENSITY);
    
}

window.mmo.World_Objects.Sun_obj.prototype = Object.create(window.THREE.Mesh.prototype);