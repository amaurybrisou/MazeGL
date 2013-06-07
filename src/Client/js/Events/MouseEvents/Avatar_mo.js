(function(){
    var f = function(){
        if(typeof window.mmo == "undefined"){
              window.Logger.log(window.Level.COFFE,"Error : Namespace mmo not Loaded", "Avatar_mo.js");
              return false;
            } else if(typeof window.mmo.Events == "undefined"){
                  window.Logger.log(window.Level.CRITICAL,"Error Events : Namespace mmo not Loaded", "Avatar_mo.js");
                  return false;
            }
            return true;
        }

    if(!f){
        return null;
    }

 })();

 // EVENT LISTENER ------------------------------------------------------------------------
window.mmo.Events.MouseEvents.Avatar_mo = function(SCREEN_SIZE_RATIO){
    this.domElement = document;

    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseDown = false;

    var that = this;
    
    if ( that.domElement === document ) {
        that.viewHalfX = (window.innerWidth - window.mmo.SCREEN_SIZE_RATIO)/ 2;
        that.viewHalfY = (window.innerHeight - window.mmo.SCREEN_SIZE_RATIO)/ 2;
    } else {
        that.viewHalfX = that.domElement.offsetWidth / 2;
        that.viewHalfY = that.domElement.offsetHeight / 2;
        that.domElement.setAttribute( 'tabindex', -1 );
    }

    this.onMouseMove = function ( event ) {
        if ( that.domElement === document ) {
          that.mouseX = event.pageX - that.viewHalfX;
          that.mouseY = event.pageY - that.viewHalfY;
        } else {
          that.mouseX = event.pageX - that.domElement.offsetLeft - that.viewHalfX;
          that.mouseY = event.pageY - that.domElement.offsetTop - that.viewHalfY;
        }
    };

    this.onMouseDown = function ( event ) {

        if ( that.domElement !== document ) {
          that.domElement.focus();
        }

        event.preventDefault();
        event.stopPropagation();

        if ( that.activeLook ) {
          switch ( event.button ) {

            case 0: that.moveForward = true; break;
            case 2: that.moveBackward = true; break;
          }
        }

        that.mouseDragOn = true;
    };
};