(function(){
    window.mmo.Lights = function(){
            var f = function(){
            //typeof mmo == "undefined"
            if(typeof window.mmo == "undefined"){
                window.Logger.log("mmo is not loaded", "Loader");
                return false;
            }
            return true;
        }

        if(!f){
            return null;
        }
        window.Logger.log("Module Loaded", "Loader");
    }
})();