var Configuration = {

	movementSpeed : 40,
	lookSpeed : 0.05,

	__FRAMERATE__ : 1000 / 30,
	interp_value: 0.1, //100ms

	noFly : false,
	lookVertical : false,
	autoForward : false,

	activeLook : true,

	heightSpeed : false,
	heightCoef : 1.0,
	heightMin : 0.0,

	constrainVertical : true,
	verticalMin : 0,
	verticalMax : Math.PI,

	autoSpeedFactor : 0.0,

	freeze : false,
}

module.exports = Configuration;