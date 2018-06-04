"use strict";

var DATABASE = require('./db_connect');
var Schema = require('mongoose').Schema;
var random = require('mongoose-simple-random');
s.plugin(random);

module.exports = function (dbName, dbOb,) {
    dbOb.createAt = Date;
    dbOb.updateAt = Date;
    module.exports = DATABASE.model(dbName, new Schema(dbOb));
};