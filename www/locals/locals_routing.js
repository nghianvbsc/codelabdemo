"use strict";

var timeHelper = require('./module/time_helpers');
var numberHelper = require('./module/number_helpers');

module.exports = function (app) {
    timeHelper(app);
    numberHelper(app);
};