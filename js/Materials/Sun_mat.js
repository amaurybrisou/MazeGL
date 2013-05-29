(function(){
    //load Builders

    var f = function(){
        if(typeof window.mmo == "undefined"){
            window.Logger.log(window.Level.CRITICAL, "Namespace mmo not Loaded", "Sun Mat");
            return false;
        } else if(typeof window.mmo.Materials == "undefined"){
            window.Logger.log(window.Level.CRITICAL, "Namespace mmo.Materials Altered", "Sun Mat");
            return false;
        }
        return true;
    };

    if (!f()){
        return null;
    }

    window.mmo.Materials.Sun_mat = function(){
        return  new window.THREE.MeshBasicMaterial({         //MATERIAL
            color: window.mmo.SUN_COLOR
        });
    };
})();
