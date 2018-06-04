"use strict";

const APP = require('../../../app');

const objectId = require('mongoose').Types.ObjectId;
const http = require('http');
const express = require('express');
const promise = require('bluebird');
const fs = require('fs');
const htmlspecialchars = require('htmlspecialchars');

const roles = require('../../config/cf_role');
const utils = require('../../utils/utils');
const ChildRouter = require('../child_routing');

module.exports = class Auth extends ChildRouter {
    constructor() {
        super('/auth');
    }


    registerRouting() {
        return {
            '/': {
                config: {
                    auth: [roles.role.guest.bin],
                    view: 'pages/auth.html',
                    inc: '',
                    title: 'Auth',
                    type: 'view',
                },
                methods: {
                    get: [function (req, res) {
                        return ChildRouter.renderToView(req, res);
                    }]
                },
            },
        }
    }
};
