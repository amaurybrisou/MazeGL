//Define here some Usefull Aliases onto the libary

var Logger = mmo.Logger.StdoutLogger;
// KEYBOARD -----------------------------------------------------------
var keyboard = new THREEx.KeyboardState();

var clock = new THREE.Clock();

var screenSizeRatio = 100;
var WIDTH = window.innerWidth - screenSizeRatio, HEIGHT = window.innerHeight - screenSizeRatio;
var worldSize = 216000/2;

var TRANS_VIEW_INCREMENT = 70;
var ROT_VIEW_INCREMENT = 0.1;
//CAMERA VARS
var VIEW_ANGLE  =  62, 
  ASPECT      =  WIDTH / HEIGHT,
  NEAR        =  0.1,
  FAR         =  worldSize*2;

var nbStones = 1000;
var stonesSizeRatio = 100;
var camRotSpeed = 20000;
var lightSpeed = 20000;
var day_night_speed = lightSpeed;
var originSize = 0.2;
var camPosRatio = 50;
var sunSize = worldSize/10;
var subLightPosRatio = 150;
var rangeTarget = 100;

var freeze = false;


//COLORS
var backgroundColor = new THREE.Color("rgb(246,246,246)");
var floorColor = new THREE.Color("rgb(249,249,249)");
var lightColor = new THREE.Color("rgb(249,249,249)");
var sunColor = new THREE.Color("rgb(66,66,66)");
var subLightColor = new THREE.Color("rgb(215,210,157)");
var originColor = new THREE.Color("rgb(66,66,66)");
var stonesColor = new THREE.Color("rgb(233,233,233)");
var emissiveColor = new THREE.Color("rgb(66,66,66)");
var avatarTargetColor = new THREE.Color("rgb(219,0,0)");

var BC, SC = 0;
var darkness = 0.2;


var camera = mmo.World_Attributes.Camera(VIEW_ANGLE, ASPECT, NEAR, FAR);




