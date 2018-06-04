"use strict";

const hostProduct = require('./cf_mode').host_product;

/**
 * [HOST-POST PRODUCT]
 */
exports.doamin = '';
exports.host_product = 'localhost';
exports.post_product = '4000';

/**
 * [HOST-POST DEVELOPMENT]
 */
exports.host_dev = 'localhost';
exports.post_dev = '4000';

/**
 * [HOST ROUTER]
 */

exports.host = (!hostProduct) ? this.host_dev : this.host_product;
exports.post = (!hostProduct) ? this.post_dev : this.post_product;

