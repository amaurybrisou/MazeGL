//Define here some Usefull Aliases onto the libary

var Logger = mmo.Logger.StdoutLogger;
// KEYBOARD -----------------------------------------------------------
var keyboard = new THREEx.KeyboardState();

var clock = new THREE.Clock();

var heriter = function(destination, source) {
    for (var element in source.prototype) {
        destination.prototype[element] = source[element];
    }
}

var config = {};





