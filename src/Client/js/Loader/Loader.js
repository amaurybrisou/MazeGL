(function(){
    window.mmo.Loader = function(){
            var f = function(){
            //typeof mmo == "undefined"
            if(typeof window.mmo == "undefined"){
                window.Logger.log(window.Level.CRITICAL, "mmo is not loaded", "Loader");
                return false;
            }
            return true;
        }

        if(!f){
            return null;
        }
        window.Logger.log(window.Level.FINE, "Module Loaded", "Loader");
    }
})();