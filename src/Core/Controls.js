if(typeof global != 'undefined'){
	var Utils = require('../Utils/Utils.js');
	var THREE = require('three');
	var Configuration = require('./Configuration.js');
}

//Arguments needed only on Client Side except first one
var Controls = function(server, object, screenSizeRatio, domElement){


	if(server){
		return;
	}
	console.log("client");

	var havePointerLock = 
		'pointerLockElement' in document ||
		'mozPointerLockElement' in document || 
		'webkitPointerLockElement' in document;

	if ( havePointerLock ) {
		var element = domElement;

		var pointerlockchange = function ( event ) {

			if ( document.pointerLockElement === element ||
			 document.mozPointerLockElement === element || 
			 document.webkitPointerLockElement === element ) {

				avatar_controls.enabled = true;

			} else {

				avatar_controls.enabled = false;

			}

		}

		var pointerlockerror = function ( event ) {
			console.log(event);
		}

		// Hook pointer lock state change events
		element.addEventListener( 'pointerlockchange', pointerlockchange, false );
		element.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
		element.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
		element.addEventListener( 'pointerlockerror', pointerlockerror, false );
		element.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
		element.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

		element.addEventListener( 'click', function ( event ) {

            // Ask the browser to lock the pointer
            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

            if ( /Firefox/i.test( navigator.userAgent ) ) {

                var fullscreenchange = function ( event ) {

                    if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

                        document.removeEventListener( 'fullscreenchange', fullscreenchange );
                        document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

                        element.requestPointerLock();
                    }

                }

                document.addEventListener( 'fullscreenchange', fullscreenchange, false );
                document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

                element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

                element.requestFullscreen();

            } else {

                element.requestPointerLock();

            }

        }, false );

    } else {

		instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

	}		
};


if(typeof global != 'undefined'){
	module.exports = global.Controls = Controls;
}