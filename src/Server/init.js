#!/usr/bin/env node

var HTTP_PORT = process.argv[2];

var WSServer = require("./Server/WSServer.js");
var HTTPServer = require("./Server/HTTPServer.js");
// WebSocket server

var ws_server =  WSServer('0.0.0.0', 9999);
var http_server = HTTPServer('0.0.0.0', HTTP_PORT, '/src/Client/');
