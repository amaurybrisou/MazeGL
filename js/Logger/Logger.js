(function(){
    //load Builders
    window.mmo.Logger = function(){
        var f = function(){
         if(typeof window.mmo == "undefined"){
          console.log("Error : Logger : Namespace mmo not Loaded");
          return false;
         }
         return true;
        };

        if (!f()){
            return null;
        }
        console.log("Module Loaded : Logger");
    };
    //Define Logger properties here
    window.Level = {
        INFO : "INFO",
        SEVERE : "SEVERE",
        CRITICAL : "CRITICAL",
        FINE : "FINE",
        WARNING : "WARNING",
        FUCK : "FUCK, IT SUCKS !!",
        PIZZA : "PIZZA TIME ?",
        COFFE : "LET'S HAVE A COFFE, YOUR'RE AWAY",
        MEDAL : "YOU DESERVE A MEDAL",
        NOOB : "ARE YOU A NOOB ?"
    }
})();