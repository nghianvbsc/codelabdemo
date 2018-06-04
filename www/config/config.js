"use strict";

let viewConf = require('./cf_view');
let folderConf = require('./cf_folder');
let sessionConf = require('./cf_session');
let requestConf = require('./cf_request');
let socketConf = require('./cf_socket');
let cookieConf = require('./cf_cookie');
let passportConf = require('./cf_passport');

module.exports = function Config() {
    passportConf()

    cookieConf.register();
    let session = sessionConf.sessionConf();
    socketConf(session);
    viewConf();
    folderConf();
    requestConf();
};