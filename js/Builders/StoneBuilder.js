  // CREATE STONES ------------------------------------------------------
  //add arguments as you want to custimize your stones, stoneAttributes for instance.

  //load StoneBuilder
 (function(){
    var f = function(){
        if(typeof window.mmo == "undefined"){
              console.log("Error : Namespace mmo not Loaded");
              return false;
            } else if(typeof window.mmo.Builders == "undefined"){
                      console.log("Error : Namespace mmo not Loaded");
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
    var stoneAttributes = [];
    var stoneValues = [];
    var stoneShaderMaterial = [];
    //var stoneShaderMaterial = window.mmo.Materials.Stone_Materials();

    for(var i=0; i<window.mmo.NB_STONES; i++){

        // SHADER
        stoneAttributes[i] = {
            displacement: window.mmo.Attributes.Stone.displacement
        };
        stoneValues[i] = stoneAttributes[i].displacement.value;

        stoneShaderMaterial[i] = new window.THREE.ShaderMaterial({
            uniforms:       window.mmo.UNIFORMS,
            attributes:     stoneAttributes[i],
            vertexShader:   document.getElementById('stonevertexshader').textContent,
            fragmentShader: document.getElementById('stonefragmentshader').textContent
        });


        // STONE
        height = Math.random()*window.mmo.WORLDSIZE/window.mmo.STONES_SIZE_RATIO;
        width = Math.random()*height*3/4 + 100;
        depth = Math.random()*height*3/4 + 100;

        x = Math.random()*window.mmo.WORLDSIZE - window.mmo.WORLDSIZE/2;
        y = height/2;
        z = Math.random()*window.mmo.WORLDSIZE - window.mmo.WORLDSIZE/2;

        stones[i] = window.mmo.World_Objects.Stone(x, y, z, width, height, depth, stoneShaderMaterial[i], window.mmo.PLANET_MAT);
        scene.add(stones[i]);

        // UPDATE
        var vertices = stones[i].geometry.vertices;
        for(var v = 0; v < vertices.length; v++) {
              stoneValues[i] = Math.random() * 300;
        }
        vertices.clear;
    }

    return scene;
  }