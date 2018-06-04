"use strict";

const request = require('request');
const promise = require('bluebird');
const crypto = require('crypto');
const ksort = require('ksort');
const stringUtils = require('../utils/string_utils');


// const api_password = "Z87bSNetXSoYEt63488V";
// const api_username = "thuckhuyatv";
// const merchant_id = "29470";
// const secure_code = "52838d7bf658f3bc";


const api_password = "Z87bSNetXSoYEt63488Vdsadsa";
const api_username = "thuckhuyatvdsdsdsd";
const merchant_id = "29470";
const secure_code = "52838d7bf658f3bc";


const cardSetting = {
    1: 'VIETEL',
    2: 'MOBI',
    3: 'VINA',
};


function hmacCreateDataSign(form, secure_code) {
    let listKey = "";
    for (let key in form) {
        if (form.hasOwnProperty(key)) listKey += form[key];
    }

    return crypto.createHmac('SHA1', secure_code).update(listKey).digest('hex');
}

module.exports = function (pin_field, seri_field, cardType) {
    return new promise(function (resolve) {
        let form = {
            algo_mode: 'hmac',
            api_password: api_password,
            api_username: api_username,
            card_id: cardSetting[cardType],
            merchant_id: merchant_id,
            pin_field: pin_field,
            seri_field: seri_field,
            transaction_id: new Date().getTime() + '_thuckhuya',
        };

        form.data_sign = hmacCreateDataSign(form, secure_code);

        request.post({
            url: 'https://www.baokim.vn/the-cao/restFul/send',
            form: form
        }, function (err, httpResponse, body) {
            if (httpResponse.statusCode === 200) {
                return resolve({
                    error: false,
                    amount: JSON.parse(body).amount,
                    message: "Nạp thẻ thành công"
                })
            } else {
                return resolve({
                    error: true,
                    message: JSON.parse(body).errorMessage,
                });
            }
        })
    })
};