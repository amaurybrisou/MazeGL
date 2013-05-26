(function(){
    //load Builders

    var f = function(){
        if(typeof mmo == "undefined"){
            Logger.log("Namespace mmo not Loaded", "Camera");
            return false;
        } else if(typeof mmo.Attributes == "undefined"){
            Logger.log("Namespace mmo.Attributes Altered", "Camera");
            return false;
        }
        return true;
    };

    if (!f()){
        return;
    }

    //Define Builder properties here
    // CAMERA -----------------------------------------------------------

  mmo.Attributes.Camera = function(VIEW_ANGLE, ASPECT, NEAR, FAR){
       return  new THREE.PerspectiveCamera(
              VIEW_ANGLE,
              ASPECT,
              NEAR,
              FAR
      );

  }

})();
