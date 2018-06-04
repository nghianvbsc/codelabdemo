"use strict";

const APP = require('../../app');

module.exports = {
    role: {
        guest: {
            bin: 1,
            auth: function (req, res, next) {
                next();
            }
        },
        user: {
            bin: 2,
            auth: function (req, res, next) {
                next();
            }
        },
        admin: {
            bin: 3,
            auth: function (req, res, next) {
                next();
            }
        },
    },

    authorization: function (req, res, next) {

        var hasRole = false;
        var currentRole = null;

        for (var itemRole in this.role) {
            if (!hasRole) {
                if (res.bindingRole.config.auth.includes(this.role[itemRole].bin)) {
                    hasRole = true;
                    currentRole = this.role[itemRole];
                }
            }
        }

        currentRole.auth(req, res, next);
    }
};