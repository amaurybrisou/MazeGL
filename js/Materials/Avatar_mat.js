(function(){
    //load Builders

    var f = function(){
        if(typeof window.mmo == "undefined"){
            window.Logger.log("Namespace mmo not Loaded", "Avatar_mat");
            return false;
        } else if(typeof window.mmo.Materials == "undefined"){
            window.Logger.log("Namespace mmo.Materials Altered", "Avatar_mat");
            return false;
        }
        return true;
    };

    if (!f()){
        return;
    }

})();


window.mmo.Materials.Avatar_mat = function(uniforms, attr){
    return new window.THREE.MeshBasicMaterial({
        color: 0x00AA00
    });
};