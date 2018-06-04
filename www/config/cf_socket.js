"use strict";

const APP = require('../../app');

module.exports = function (session) {
    APP.IO.use(function (socket, next) {
        session(socket.handshake, {}, next);
    });
};