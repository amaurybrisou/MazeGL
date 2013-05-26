(function(){
    mmo.Shaders = function(){
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

mmo.Shaders.Uniforms = function(darkness){
    return {
            amplitude: {
              type: 'f', // a float
              value: 0.5
            },

            lightPosX: {
              type: 'f', // a float
              value: 0.5
            },

            lightPosY: {
              type: 'f', // a float
              value: 0.5
            },

            lightPosZ: {
              type: 'f', // a float
              value: 0.5
            },

            lightColor: {
              type: 'f', // a float
              value: 0.5
            },

            darkness: {
              type: 'f',
              value: darkness + 0.02
            }
    }
}