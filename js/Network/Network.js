(function(){
    mmo.Network = function(){
        f = function(){
            if(typeof mmo == "undefined"){
                console.log("mmo is not defined");
                return false;
            }
            return true;
        }

        if(!f()){
            return;
        }
        Logger.log("Module Loaded", "Network");
    }
    //define specify Network properties

})();