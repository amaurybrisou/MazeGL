(function(){
    window.mmo.Shaders = function(){
        var f = function(){
            if(typeof window.mmo == "undefined"){
                console.log("mmo is not defined");
                return false;
            }
            return true;
        }

        if(!f()){
            return;
        }
        window.Logger.log("Module Loaded", "Network");
    }
    //define specify Network properties

})();

window.mmo.Shaders.Uniforms = function(){
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
              value: window.mmo.DARKNESS + 0.02
            }
    }
}