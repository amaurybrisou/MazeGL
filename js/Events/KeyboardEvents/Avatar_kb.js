 (function(){
    window.mmo.Events.KeyboardEvents.Avatar_kb = function(){

        var f = function(){
            if(typeof window.mmo == "undefined"){
                  window.Logger.log(window.Level.PIZZA, "Error : Namespace mmo not Loaded", "Avatar_kb.js");
                  return false;
                } else if(typeof window.mmo.Events == "undefined"){
                          window.Logger.log(window.Level.PIZZA,"Error Events : Namespace mmo not Loaded", "Avatar_kb.js");
                          return false;
                }
                return true;
            };

        if(!f){
            return;
        }
    }
 })();

window.mmo.Events.KeyboardEvents.Avatar_kb = function(){
    window.THREEx.KeyboardState.call(this);
    var that = this;

    this.move = function(avatar_obj){
        var x = 4;
        var y = 4;
        var z = 4;
        //check if Avatar go Away down the world map
        if(avatar_obj.position.y < 0){ avatar_obj.position.y = 0 }
        if(that.pressed("u")){ avatar_obj.position.y += y; }
        if(that.pressed("b")){ avatar_obj.position.y = (avatar_obj.position.y - y) < 0 ? 1 : avatar_obj.position.y - y ; }
        if(that.pressed("q")){ avatar_obj.position.x -= x; }
        if(that.pressed("d")){ avatar_obj.position.x += x; }
        if(that.pressed("s")){ avatar_obj.position.z += z; }
        if(that.pressed("z")){ avatar_obj.position.z -= z; }


        //   myMeshControls.update(clock.getDelta());
        //   myMeshObject.myMesh.position.y = 0;

        //   // avatar elements update
        //   myMeshObject.update(myMeshObject.myMesh.position.x,
        //                       myMeshObject.myMesh.position.y,
        //                       myMeshObject.myMesh.position.z,
        //                       myMeshObject.vertices,
        //                       myMeshObject.scale,
        //                       t);

        //   // target position update
        //   avatarTargetSphere.position.set( myMeshObject.myMesh.position.x + rangeTarget * Math.sin( -myMeshControls.phi ) * Math.cos( -myMeshControls.theta ),
        //                                    -myMeshControls.target.y,
        //                                    myMeshControls.target.z - Math.sin( -myMeshControls.phi ) * Math.sin( myMeshControls.theta ));
    };

};

mmo.Events.KeyboardEvents.Avatar_kb.prototype = Object.create(THREEx.KeyboardState.prototype);