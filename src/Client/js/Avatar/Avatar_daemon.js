(function () {
    //load Builders
    var f = function () {
        if (typeof window.mmo == "undefined") {
            window.Logger.log(window.Level.CRITICAL, "Namespace mmo not Loaded", "Avatar_Daemon");
            return false;
        }
        else if (typeof window.mmo.Avatar == "undefined") {
            window.Logger.log(window.Level.CRITICAL, "Namespace mmo not Loaded", "Avatar_Daemon");
            return false;
        }
        return true;
    };

    if (!f()) {
        return;
    }
})();


window.mmo.Avatar.Avatar_daemon = function () {
    return (function (x, y, z) {
        var model = new window.mmo.Loader.ColladaLoader();
        var that = model;
        
        
        that.camera = window.mmo.camera;
        that.position = {};
        that.position.x = x;
        that.position.y = y;
        that.position.z = z;

        that.avatar_controls = window.mmo.Events.getAvatarControls(that, window.mmo.SCREEN_SIZE_RATIO);

        that.animate = function () {
            that.avatar_controls.update(window.clock.getDelta());
            window.mmo.avatar_obj.position.y = 0;
            //that.avatar_mo.move(that);
        };

        

        return model;
    })();

}