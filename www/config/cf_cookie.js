"use strict";

let cookieParser = require('cookie-parser');
let mainApp = require('../../app');

exports.options = {
    maxAge: 31536000,
    httpOnly: false
};

exports.register = function () {
    mainApp.APP.use(cookieParser());
};