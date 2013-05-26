(function(){
    //load Builders

    var f = function(){
        if(typeof mmo == "undefined"){
            Logger.log("Namespace mmo not Loaded", "Camera");
            return false;
        } else if(typeof mmo.Materials == "undefined"){
            Logger.log("Namespace mmo.Materials Altered", "Camera");
            return false;
        }
        return true;
    };

    if (!f()){
        return null;
    }

    mmo.Materials.Sun_mat = function(sun_color){
        return  new THREE.MeshLambertMaterial({         //MATERIAL
            color: sun_color
        });
    };
})();
