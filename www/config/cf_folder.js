"use strict";

const mainApp = require('../../app');

module.exports = function FolderConf() {
    mainApp.APP.use('/template/', mainApp.EXPRESS.static(mainApp.BASE_DIR + '/template/'));
    mainApp.APP.use('/views/', mainApp.EXPRESS.static(mainApp.BASE_DIR + '/views/'));
    mainApp.APP.use('/share-image/', mainApp.EXPRESS.static(mainApp.BASE_DIR + '/share-image/'));
};