
var Shaders = {
  Uniforms : function(){
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
}


if(typeof global != 'undefined'){
    module.exports = global.Shaders = Shaders;
}
