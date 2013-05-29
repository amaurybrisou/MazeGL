(function(){
    window.mmo.Network = function(){
        var f = function(){
            if(typeof window.mmo == "undefined"){
                window.Logger.log(window.Level.CRITICAL, "mmo is not defined", "Network");
                return false;
            }
            return true;
        }

        if(!f()){
            return;
        }
        window.Logger.log(window.Level.FINE, "Module Loaded", "Network");
    }
    //define specify Network properties

})();