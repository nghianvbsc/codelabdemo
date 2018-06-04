"use strict";

const _session_version = '1.1.0';
const _session_key = 'thuc-khuya-!@#$Q$&$^!*^$&!^$!*$&@$^@&$(@';
const session = require('express-session');
const APP = require('../../app');

exports.sessionConf = function SessionConf() {
    // const ses = session({
    //     secret: _session_key + '_' + _session_version,
    //     resave: true,
    //     saveUninitialized: true,
    // });
    const ses = session({ secret: 'keyboard cat', key: 'sid'});

    APP.APP.use(ses);


    return ses;
};

/**
 * @return {string}
 */
exports.getSessionKey = function GetSessionKey(mainKey) {
    return mainKey + '_' + _session_key + '_' + _session_version;
};