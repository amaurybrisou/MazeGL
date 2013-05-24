  // CREATE STONES ------------------------------------------------------
  //add arguments as you want to custimize your stones, stoneAttributes for instance.
  
  //load StoneBuilder 
 (function(){
    var f = function(){
        if(typeof mmo == "undefined"){
              console.log("Error : Namespace mmo not Loaded");
              return false;
            } else if(typeof mmo.Builders == "undefined"){
                      console.log("Error : Namespace mmo not Loaded");
                      return false;
            }
            return true;
        }
        
    if(!f){
        return null;
    }
    
    
    //Define StoneBuilder 
    mmo.Builders.StoneBuilder = function(scene, nb_stones, uniforms, worldSize, stonesSizeRatio, planeMat, displacement ){
      var x, y, z, width, height, depth;
      var stones = new Array();
      var stoneAttributes = new Array();
      var stoneValues = new Array();
      var stoneShaderMaterial = new Array();
    
      for(var i=0; i<nb_stones; i++){
    
        // SHADER
        stoneAttributes[i] = {
            displacement: displacement
        };
        stoneValues[i] = stoneAttributes[i].displacement.value;
    
        stoneShaderMaterial[i] = new THREE.ShaderMaterial({
            uniforms:       uniforms,
            attributes:     stoneAttributes[i],
            vertexShader:   document.getElementById('stonevertexshader').textContent,
            fragmentShader: document.getElementById('stonefragmentshader').textContent
        });
    
    
        // STONE
        height = Math.random()*worldSize/stonesSizeRatio;
        width = Math.random()*height*3/4 + 100;
        depth = Math.random()*height*3/4 + 100;
    
        x = Math.random()*worldSize - worldSize/2;
        y = height/2;
        z = Math.random()*worldSize - worldSize/2;
    
        stones[i] = Stone.create(x, y, z, width, height, depth, planeMat);
        scene.add(stones[i]);
        
    
        
        // UPDATE
        var vertices = stones[i].geometry.vertices;
        for(var v = 0; v < vertices.length; v++) {
              stoneValues[i].push(Math.random() * 300);
        }
        vertices.clear;
    }
    
    return scene;
  }
    
})();