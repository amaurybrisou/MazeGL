//Define here some Usefull Aliases onto the libary

window.Logger = window.mmo.Logger.StdoutLogger;

window.clock = new window.THREE.Clock();

window.config = {};

window.bind = function( scope, fn ) {
            return function () {
                fn.apply( scope, arguments );
            };
};


function obcat(o1, o2){
    for (var key in o2) {
        o1[key] = o2[key];
    }
    return o1;
}


// if(typeof Object.prototype.later !== 'function') {
//     Object.prototype.later = function (msec, method){
// 		var that =this,
// 		args = Array.prototype.slice.aply(arguments, [2]);

// 		if(typeof method === 'string'){
// 			method = that[method];
// 		}
// 		setTimeout(function(){
// 			method.apply(that, args) }
//             ,msec );
// 		return that;	
// 	};
// }