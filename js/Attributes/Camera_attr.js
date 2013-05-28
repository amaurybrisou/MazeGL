(function(){
    //load Builders

    var f = function(){
        if(typeof window.mmo == "undefined"){
            window.Logger.log("Namespace mmo not Loaded", "Camera");
            return false;
        } else if(typeof window.mmo.Attributes == "undefined"){
            window.Logger.log("Namespace mmo.Attributes Altered", "Camera");
            return false;
        }
        return true;
    };

    if (!f()){
        return;
    }

    //Define Builder properties here
    // CAMERA -----------------------------------------------------------

  window.mmo.Attributes.Camera = function(){
       return new window.THREE.PerspectiveCamera(
               window.mmo.VIEW_ANGLE,
               window.mmo.ASPECT,
               window.mmo.NEAR,
               window.mmo.FAR
      );

  }

})();
