(function(){
    mmo.Lights = function(){
            f = function(){
            //typeof mmo == "undefined"
            if(null == mmo){
                Logger.log("mmo is not loaded", "Loader");
                return false;
            }
            return true;
        }

        if(!f){
            return null;
        }
        Logger.log("Module Loaded", "Loader");
    }
})();