(function(){
    //load Builders

    var f = function(){
        if(typeof mmo == "undefined"){
            Logger.log("Namespace mmo not Loaded", this.toString);
            return false;
        } else if(typeof mmo.Materials == "undefined"){
            Logger.log("Namespace mmo.Materials Altered", this.toString);
            return false;
        }
        return true;
    };

    if (!f()){
        return;
    }

})();


mmo.Materials.Avatar_mat = function(uniforms, attr){
    return new THREE.MeshBasicMaterial({
        color: 0x00AA00
    });
};