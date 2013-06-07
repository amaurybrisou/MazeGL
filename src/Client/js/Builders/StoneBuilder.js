  // CREATE STONES ------------------------------------------------------
  //add arguments as you want to custimize your stones, stoneAttributes for instance.

  //load StoneBuilder
 (function(){
    var f = function(){
        if(typeof window.mmo == "undefined"){
              window.Logger.log(window.Level.CRITICAL, "Namespace mmo not Loaded", "Stone builder");
              return false;
            } else if(typeof window.mmo.Builders == "undefined"){
                      window.Logger.log(window.Level.CRITICAL, "Namespace mmo not Loaded", "Stone builder");
                      return false;
            }
            return true;
        }

    if(!f){
        return null;
    }
})();

//Define StoneBuilder
window.mmo.Builders.StoneBuilder = function(scene){
    var x, y, z, width, height, depth;
    var stones = [];

    for(var i=0; i<window.mmo.NB_STONES; i++){

        // STONE
        height = Math.random()*window.mmo.WORLDSIZE/window.mmo.STONES_SIZE_RATIO;
        width = Math.random()*height*3/4 + 100;
        depth = Math.random()*height*3/4 + 100;

        x = Math.random()*window.mmo.WORLDSIZE - window.mmo.WORLDSIZE/2;
        y = height/2;
        z = Math.random()*window.mmo.WORLDSIZE - window.mmo.WORLDSIZE/2;

        stones[i] = window.mmo.World_Objects.Stone(x, y, z, width, height, depth, window.mmo.STONES_FACES_MAT, window.mmo.STONES_EDGES_MAT);
        scene.add(stones[i]);
    }
  }