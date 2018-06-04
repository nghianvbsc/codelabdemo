"use strict";

module.exports = function (app) {
    app.locals.priceFormat = function (num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    };
};