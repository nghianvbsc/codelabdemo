"use strict";

const APP = require('../../app');
var rooms = {};

module.exports = function () {
    APP.IO.on('connection', function (socket) {
        socket.on('check room', function (room, userId) {
            socket.emit("room-listening", {
                isCreated: false,
                room: room,
            })
        });

        socket.on('message', function (message) {
            if (typeof message === "string") {
                message = JSON.parse(message);
            }
            APP.IO.emit('message', message);
        });
    });
};