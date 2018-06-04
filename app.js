"use strict";

const nodeStatic = require('node-static');
var nodeStaticFile = new(nodeStatic.Server)();
const fs = require('fs');
const express = require('express');
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);
const config = require('./www/config/config');
const hostConf = require('./www/config/cf_host');
const routing = require('./www/routing/routing');
const localsRouting = require('./www/locals/locals_routing');
const socket = require('./www/socket/socket');

exports.BASE_DIR = __dirname;
exports.APP = app;
exports.EXPRESS = express;
exports.IO = io;

config();
routing.mainHandel();
localsRouting(app);
socket();

http.listen(hostConf.post, hostConf.host, function (error, rsl) {
    console.log("SERVER started " + hostConf.host + ':' + hostConf.post);
});
