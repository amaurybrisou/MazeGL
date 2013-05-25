(function(){
    //load Builders 
    var f = function(){
        if(typeof mmo == "undefined"){
            console.log("Error : StdoutLogger : Namespace mmo not Loaded");
            return false;
        } else if(typeof mmo.Logger == "undefined"){
            console.log("Error : StdoutLogger : Namespace mmo Altered");
            return false;
        }   
        return true;
    };

    if (!f()){
        return;
    }
    //Define Builder properties here
    mmo.Logger.StdoutLogger = {
        log : function(obj, class_type){
            if(typeof obj == "object"){
                console.log(class_type+" : ");
                console.log(obj);
            } else {
                console.log("Error "+class_type+" : "+obj);
            }
        },
    }
    
})();
