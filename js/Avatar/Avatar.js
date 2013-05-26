(function(){
    //load Builders
    mmo.Avatar = function(){
        var f = function(){
         if(typeof mmo == "undefined"){
          Logger.log("mmo is not Defined", this);
          return false;
         } else if (typeof mmo.Attributes.Avatar == "undefined"){
            Logger.log("mmo is not Altered, check mmo.Attributes", this);
            return false;
         }
         return true;
        };

        if (!f()){
            return null;
        }
        Logger.log("Module Loaded", "Avatar");

        this.attrs = mmo.Attributes.Avatar;
    }


})();



/*mmo.Avatar = function(geometry, material) {
  THREE.Mesh.call(this,geometry,material);
};

mmo.Avatar.prototype = Object.create(THREE.Mesh.prototype);
*/