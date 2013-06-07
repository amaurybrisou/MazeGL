#!/usr/bin/env node

HTTP_PORT = process.argv[2];

WSServer = require("./Server/WSServer.js");
HTTPServer = require("./Server/HTTPServer.js");
// WebSocket server

ws_server =  WSServer('0.0.0.0', 9999);
http_server = HTTPServer('0.0.0.0', HTTP_PORT, '/src/Client/');

