#!/usr/bin/env node

var WSServer = require("./Server/WSServer.js");


var HTTP_PORT = process.argv[2];

var HTTPServer = require("./Server/HTTPServer.js");

var http_server = HTTPServer('0.0.0.0', HTTP_PORT, '/src/Client/', false);


var UUID = require('node-uuid');

var world_id = UUID();
var io = WSServer(http_server, world_id);

mmo = require('./Server/ServerManager.js');

var world = mmo.createWorld(world_id, io);

