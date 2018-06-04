"use strict";
let express = require('express');
let fs = require('fs');
let APP = require('../../app');
let url = require('url');

class ChildRouter {

    constructor(basePath) {
        this.basePath = basePath;
        this.registerRouting;
    }

    registerRouting() {

    }

    exportModule() {
        let router = express.Router();

        for (var basePath in this.registerRouting()) {
            var item = this.registerRouting()[basePath];

            if (typeof item.methods.post !== 'undefined' && item.methods.post !== null) {
                if (item.methods.post.length === 1) {
                    router.post(basePath, item.methods.post[0]);
                } else if (item.methods.post.length === 2) {
                    router.post(basePath, item.methods.post[0], item.methods.post[1]);
                }
            }

            if (typeof item.methods.get !== 'undefined' && item.methods.get !== null) {
                if (item.methods.get.length === 1) {
                    router.get(basePath, item.methods.get[0]);
                } else if (item.methods.get.length === 2) {
                    router.get(basePath, item.methods.get[0], item.methods.get[1]);
                }
            }
        }

        return router;
    }

    static responseError(msg, res, data) {
        return res.json({error: true, message: msg, data: data});
    }

    static response(res, data) {
        return res.json(data);
    }


    static responseSuccess(msg, res, data) {
        return res.json({error: false, message: msg, data: data});
    }

    static pageNotFoundJson(res) {
        return res.json({"Error": "Page not found!"});
    }

    static renderToView(req, res, data, title) {
        data = typeof data === 'undefined' || data === null ? {} : data;

        if (title) {
            res.bindingRole.config.title = title;
        }

        data.render = res.bindingRole.config;
        data.render.url = url.format({
            protocol: req.protocol,
            host: req.get('host'),
            pathname: req.originalUrl
        });

        return res.render(res.bindingRole.config.view, data);
    }

    static renderToPath(res, path, data) {
        data = data == null ? {} : data;
        data.render = res.bindingRole.config;
        return res.render(path, data);
    }

    static renderToViewWithOption(res, pathRender, data) {
        return res.render(pathRender, {data});
    }

    static redirect(res, path) {
        return res.redirect(path);
    }
}

module.exports = ChildRouter;