ns("tech.rsqn.core");

/*
 Accessing templates asynchronously just created glue code - in practice its much nicer to use templates if they return synchronously
 */
tech.rsqn.core.Templates = function () {
    this.templates = {};
    this.enableCache = true;
    this.enableTags = true;
};


tech.rsqn.core.Templates.prototype.init = function (config, cb) {
    var self = this;
    var cdl = new tech.rsqn.common.CountDownLatch(config.length, function () {
        for (var n in self.templates) {
            Logger.info("Template registered (" + n + ")");
        }
        cb();
    });

    for (var i = 0; i < config.length; i++) {
        var tn = config[i];

        self.loadTemplate(config[i], function (err, tpl) {
            if ( err ) {
                self.templates[tn] = err;
            } else {
                self.templates[tn] = tpl;
            }
            cdl.countDown();
        });
    }

};

tech.rsqn.core.Templates.prototype.getTemplate = function (templateName) {
    var self = this;

    if (self.templates.hasOwnProperty(templateName)) {
        Logger.debug("Returning Cached Template " + templateName);
        var ret = $(self.templates[templateName]);
        if (self.enableTags == true) {
            self.replaceTags(ret)
        }
        return ret;
    } else {
        Logger.debug("Not in cache [ " + templateName + "]");
        return $("<p>Template " + templateName + " not found</p>");
    }
};

tech.rsqn.core.Templates.prototype.replaceTags = function (tpl) {
    tpl.find(".i18n").each(function (i, e) {
        var elm = $(e);
        elm.html(i18n(elm.attr("data-i18n")));
    });
};

tech.rsqn.core.Templates.prototype.loadTemplate = function (templateName, cb) {
    var uri = constants.contextPath + '/templates/' + templateName;

    Logger.info("Loading template " + templateName + " from " + uri);

    $.ajax({
            type: "GET",
            cache: false,
            url: uri
        }
    ).done(function (data, textStatus, jqXHR) {
        console.log("ok")
        cb(null, data);
    })
        .fail(function (jqXHR, textStatus, errorThrown) {
            cb(new Error(jqXHR), null);
        });
};

var cuiTemplates = new tech.rsqn.core.Templates();