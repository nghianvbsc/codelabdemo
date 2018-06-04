"use strict";

var Settings = {
    langDefault: 'vn',
    langList: {
        'en': require('./module/lang_en'),
        'vn': require('./module/lang_vn'),
        'ja': require('./module/lang_ja'),
    }
};

module.exports = {
    langDefault: Settings.langDefault,

    getLanguage: function (key, language) {
        if (Settings.langList[language] !== null) {
            return Settings.langList[language][key];
        } else {
            var hasSearchLang = false;
            var langValue = "";
            for (var keyLanginList in langList) {
                if (!hasSearchLang) {
                    if (Settings.langList[hasSearchLang] !== null) {
                        hasSearchLang = true;
                        langValue = Settings.langList['vn'][key];
                    }
                }
            }

            return hasSearchLang ? langValue : key;
        }
    },

    checkKeyLang: function (key) {
        return Settings.langList[key] !== null;
    }
};