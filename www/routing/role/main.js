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
const string_utils = require('../../utils/string_utils');
const ChildRouter = require('../child_routing');

module.exports = class Auth extends ChildRouter {
    constructor() {
        super('/');
    }

    registerRouting() {
        return {
            '/': {
                config: {
                    auth: [ roles.role.guest.bin ],
                    view: 'main/main.html',
                    inc: '',
                    title: 'DEMO WEB RTC',
                    type: 'view',
                },
                methods: {
                    get: [ function (req, res) {
                        if (req.session.userName != null) {
                            let myId = req.session.userName;
                            let room = "1234";
                            return ChildRouter.renderToView(req, res, {myId: myId, room: room});
                        } else {
                            if (req.query.id && req.query.id !== "") {
                                let myId = req.query.id;
                                let room = "1234";
                                return ChildRouter.renderToView(req, res, {myId: myId, room: room});
                            } else {
                                return ChildRouter.redirect(res, "/nhap-ten.html");
                            }
                        }
                    } ]
                },
            },

            '/nhap-ten.html': {
                config: {
                    auth: [ roles.role.guest.bin ],
                    view: 'main/nhap-ten.html',
                    title: 'DEMO WEB RTC',
                    type: 'view',
                },
                methods: {
                    get: [ function (req, res) {
                        ChildRouter.renderToView(req, res)
                    } ],

                    post: [ function (req, res) {
                        let userName = req.body.userName;
                        req.session.userName = userName;
                        return ChildRouter.redirect(res, "/?id=" + userName);
                    } ]
                },
            },
        }
    }
};
