 (function(){
    var f = function(){
        if(typeof mmo == "undefined"){
              console.log("Error : Namespace mmo not Loaded");
              return false;
            } else if(typeof mmo.Events == "undefined"){
                      console.log("Error Events : Namespace mmo not Loaded");
                      return fase;
            }
            return true;
        }
        
    if(!f){
        return;
    }
 })();
 
 
 mmo.Events.Avatar_Events = function(){
     if( keyboard.pressed("o") ){
        myMeshObject.myMesh.position.set(0,0,0);
      }
      if( keyboard.pressed("c") ){
        
        camera.position.x = myMeshObject.myMesh.position.x;
        camera.position.y = myMeshObject.myMesh.position.y;
        camera.position.z = myMeshObject.myMesh.position.z;

      }
      else{
        camera.position.set(myMeshObject.myMesh.position.x, myMeshObject.myMesh.position.y, myMeshObject.myMesh.position.z);
        camera.lookAt(myMeshObject.myMesh.position);
        camera.position.x = myMeshObject.scale/2;
        camera.position.y = myMeshObject.scale;
        camera.position.z = myMeshObject.scale * 4;

        //myMeshObject.myMesh.add(camera);
      }



      myMeshControls.update(clock.getDelta());
      myMeshObject.myMesh.position.y = 0;

      // avatar elements update
      myMeshObject.update(myMeshObject.myMesh.position.x, 
                          myMeshObject.myMesh.position.y, 
                          myMeshObject.myMesh.position.z, 
                          myMeshObject.vertices,
                          myMeshObject.scale,
                          t);
      
      // target position update
      avatarTargetSphere.position.set( myMeshObject.myMesh.position.x + rangeTarget * Math.sin( -myMeshControls.phi ) * Math.cos( -myMeshControls.theta ),
                                       -myMeshControls.target.y, 
                                       myMeshControls.target.z - Math.sin( -myMeshControls.phi ) * Math.sin( myMeshControls.theta ));
}
