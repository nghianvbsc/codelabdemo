"use strict";

const hostProduct = require('./cf_mode').host_product;
const HOST = require('./cf_host');

module.exports = {

    'facebookAuth': {
        'clientID': '172014670006396', // your App ID
        'clientSecret': 'ff6c204d47af3580ab418e632123e219', // your App Secret
        'callbackURL': hostProduct ? 'http://thuckhuya.tv/auth/login-fb/callback' :
            'http://' + HOST.host + ':' + HOST.post + '/auth/login-fb/callback'
    },

    'twitterAuth': {
        'consumerKey': 'your-consumer-key-here',
        'consumerSecret': 'your-client-secret-here',
        'callbackURL': 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth': {
        'clientID': 'your-secret-clientID-here',
        'clientSecret': 'your-client-secret-here',
        'callbackURL': 'http://localhost:8080/auth/google/callback'
    }

};