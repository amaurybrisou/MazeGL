(function(){
    //load Builders

    var f = function(){
        if(typeof window.mmo == "undefined"){
            window.Logger.log("Namespace mmo not Loaded", "Camera");
            return false;
        } else if(typeof window.mmo.Materials == "undefined"){
            window.Logger.log("Namespace mmo.Materials Altered", "Camera");
            return false;
        }
        return true;
    };

    if (!f()){
        return null;
    }

    window.mmo.Materials.Sun_mat = function(){
        return  new window.THREE.MeshLambertMaterial({         //MATERIAL
            color: window.mmo.SUN_COLOR
        });
    };
})();
