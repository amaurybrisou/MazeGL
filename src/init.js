#!/usr/bin/env node

var HTTP_PORT = process.argv[2];

var HTTPServer = require("./Server/HTTPServer.js");
var WSServer = require("./Server/WSServer.js");

var http_server = HTTPServer('0.0.0.0', HTTP_PORT, '/src/Client/', false);
var io =  WSServer(http_server);

mmo = require('./Server/ServerManager.js');
var world = mmo.createWorld(io);