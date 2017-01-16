ns("tech.rsqn.core");


tech.rsqn.core.i18n = function () {
    this.bundles = {};
    this.enableCache = true;
    this.defaultLocale = "en";
    this.locale = this.defaultLocale;
    this.initialized = false;

    if (document["lang_cookie"]) {
        this.locale = document["lang_cookie"];
    } else if (document["accept_language_header"]) {
        var acceptLang = document["accept_language_header"];
        var idx = acceptLang.indexOf("-");
        if (idx > 0) {
            acceptLang = acceptLang.substr(0, idx);
        }
        this.locale = acceptLang;
    }
};

tech.rsqn.core.i18n.prototype.setLocale = function (locale) {
    this.locale = locale;
    $("body").trigger("i18n-locale-change");
};

tech.rsqn.core.i18n.prototype.resolve = function (msg, args) {
    var bundle = this.bundles[this.locale];
    if (bundle && bundle[msg]) {
        return bundle[msg].format2(args);
    } else {
        return msg;
    }
};

tech.rsqn.core.i18n.prototype.getBundle = function (bundleName) {
    var self = this;
    var dfd = $.Deferred();

    if (this.bundles.hasOwnProperty(bundleName)) {
        return this.bundles[bundleName];
    }

    this.loadBundle(bundleName).then(function(bundle){
        if (bundle == null) {
            bundle = self.bundles[self.defaultLocale];
        }

        if (!bundle || bundle == null) {
            Logger.error("No language bundle found - even default " + self.defaultLocale);
            dfd.resolve(null);
        }

        if (self.enableCache) {
            self.bundles[bundleName] = bundle;
            Logger.info("Cached message bundle " + bundleName);
        }

        dfd.resolve(bundle);
    });

    return dfd;
};


tech.rsqn.core.i18n.prototype.loadBundle = function (bundleName) {
    var url = constants.contextPath + '/locales/' + bundleName + ".json";
    Logger.debug("Loading language bundle " + bundleName + " from " + url);

    var dfd = $.Deferred();

    $.ajax({
            type: "GET",
            url: url,
            cache: false,
            contentType: "application/json",
            dataType: "json"
        }
    ).done(function (data, textStatus, jqXHR) {
            dfd.resolve(data);
            Logger.info("Loaded bundle " + JSON.stringify(data,0,4))
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            dfd.resolve(null);
            Logger.warn("No bundle for " + url + " on server - defaulting to " + this.defaultLocale);
        });

    return dfd;
};

var __i18n = new tech.rsqn.core.i18n();

var i18n = function (msg, args) {
    return __i18n.resolve(msg, args);
};

var i18nSetLocale = function (locale) {
    __i18n.setLocale(locale);
};