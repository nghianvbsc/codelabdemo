"use strict";

const mainApp = require('../../app');

module.exports = function ViewConf() {
    mainApp.APP.engine('.html', require('ejs').__express);
    mainApp.APP.set('view engine', 'html');
    mainApp.APP.set('views', mainApp.BASE_DIR + '/www/views/');
};