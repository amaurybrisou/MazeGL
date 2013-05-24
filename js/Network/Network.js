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
    }
    //define specify Network properties

})();