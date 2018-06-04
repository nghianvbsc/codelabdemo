// load all the things we need
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;


const utils = require('../utils/utils');

const APP = require('../../app');


// load the auth variables
var configAuth = require('./cf_auth');

module.exports = function () {
    APP.APP.use(passport.initialize());
    APP.APP.use(passport.session());

    passport.serializeUser(function (user, done) {
        if(user.status === 2){
            done("Tài khoản này đã bị khóa", null);
        }else done(null, user);
    });

    passport.deserializeUser(function (id, done) {
        // USER_MODEL.checkUserFbId(id).then(function (user) {
        //     if(user.status === 2){
        //         done("Tài khoản này đã bị khóa", null);
        //     }else done(null, user);
        // })
    });

    passport.use(new FacebookStrategy({
            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL,
            profileFields: ['id', 'displayName', 'link', 'photos', 'emails']
        },

        function (token, refreshToken, profile, done) {
            process.nextTick(function () {
                // USER_MODEL.signIn(profile.id).then(function (user) {
                //     if (utils.isEmptyObject(user)) {
                //         /**
                //          * Đăng ký tài khoản cho user này
                //          */
                //         USER_MODEL.register(profile.displayName, profile.id, profile.profileUrl, profile.photos[0].value, profile.emails[0].value)
                //             .then(function (user) {
                //                 return done(null, user);
                //             });
                //     } else {
                //         if(user.status === 2){
                //             return done("Tài khoản này đã bị khóa", null);
                //         }else{
                //             /**
                //              * cap nhat thong tin
                //              */
                //             USER_MODEL.updateInfo(profile.displayName, profile.id, profile.profileUrl, profile.photos[0].value, profile.emails[0].value)
                //                 .then(function () {
                //                     return done(null, user);
                //                 })
                //         }
                //     }
                // });
            })
        }))
};