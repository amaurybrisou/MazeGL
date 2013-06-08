(function(){
    //load Builders
    var f = function(){
        if(typeof window.mmo == "undefined"){
            console.log("Error : StdoutLogger : Namespace mmo not Loaded");
            return false;
        } else if(typeof window.mmo.Logger == "undefined"){
            console.log("Error : StdoutLogger : Namespace mmo Altered");
            return false;
        }
        return true;
    };

    if (!f()){
        return;
    }
    //Define Builder properties here
    window.mmo.Logger.StdoutLogger ={ 
        log : function(level, obj, class_type){
            if(arguments.length  < 3){
                throw "Missing Arguments while calling Logger";
            }
            
            if(level === window.Level.CRITICAL ||
                level === window.Level.FUCK ||
                level === window.Level.NOOB ||
                level === window.Level.PIZZA ||
                level === window.Level.COFFE){
                    throw level+" : "+obj+" : "+class_type;
            }
            
            if(typeof obj === "object"){
                console.log(level+" : "+class_type+" : ");
                console.log(obj);
            } else {
                console.log(level+" : "+class_type+" : "+obj);
            }
        },
    }
    setTimeout(function(){}, 1000);
})();



