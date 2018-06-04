"use strict";

const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const mainApp = require('../../app');

module.exports = function RequestConf() {
    mainApp.APP.use(bodyParser.json({limit: '50mb'}));
    mainApp.APP.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    mainApp.APP.use(fileUpload());
};