(function(){
    //load Builders
    window.mmo.Avatar = function(){
        var f = function(){
         if(typeof window.mmo == "undefined"){
          window.Logger.log(window.Level.CRITICAL, "mmo is not Defined", this);
          return false;
         } else if (typeof window.mmo.Attributes.Avatar == "undefined"){
            window.Logger.log(window.Level.CRITICAL, "mmo is not Altered, check mmo.Attributes", "Avatar");
            return false;
         }
         return true;
        };

        if (!f()){
            return null;
        }
        window.Logger.log(window.Level.FINE, "Module Loaded", "Avatar");

        this.attrs = window.mmo.Attributes.Avatar;
    }


})();



/*mmo.Avatar = function(geometry, material) {
  THREE.Mesh.call(this,geometry,material);
};

mmo.Avatar.prototype = Object.create(THREE.Mesh.prototype);
*/