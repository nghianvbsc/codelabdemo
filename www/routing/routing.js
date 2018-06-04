"use strict";

/**
 * api và render echat
 */
const mainApp = require('../../app');
const authorization = require('./authorization');
const passport = require('passport');

const routing = {
    mainHandel: function () {
        var cors = require('cors');
        mainApp.APP.use(cors());
        mainApp.APP.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

            res.setHeader('Access-Control-Allow-Credentials', true);
            next();
        });

        var crossdomain = require('crossdomain');
        var xml = crossdomain({domain: '*'});

        mainApp.APP.all('/crossdomain.xml', function (req, res, next) {
            res.set('Content-Type', 'application/xml; charset=utf-8');
            res.send(xml, 200);
        });

        mainApp.APP.use(authorization.checkAuthorization);

        authorization.initAuths.forEach(function (itemAuth, index) {
            mainApp.APP.use(new itemAuth().basePath, new itemAuth().exportModule());
        });

        mainApp.APP.get("/404.html", function (req, res) {
            routing.pageNotFound(req, res);
        });

        mainApp.APP.post("/404.html", function (req, res) {
            routing.pageNotFound(req, res);
        });

        mainApp.APP.use("*", function (req, res) {
            routing.pageNotFound(req, res);
        });


    },

    throwJson: function (json, res) {
        return res.json(json);
    },

    throwError: function (msg, res, data) {
        return res.json({error: true, message: msg, data: data});
    },

    throwSuccess: function (sg, res, data) {
        return res.json({error: true, message: msg, data: data});
    },

    pageNotFoundView: function (res) {
        return res.render("pages/404.html");
    },

    pageNotFoundJson: function (res) {
        return res.json({"Error": "Page not found!"});
    },

    renderToview(res, data) {
        data.render = res.custom.currentMethod.view;
        return res.render(res.custom.currentMethod.views.manager_app.view, {data});
    },

    renderToviewWithOption(res, pathRender, data) {
        return res.render(pathRender, {data});
    },

    pageNotFound: function (req, res) {
        if (req.method == "POST") {
            routing.pageNotFoundJson(res);
        } else {
            routing.pageNotFoundView(res);
        }
    }
};

module.exports = routing;