ns("tech.rsqn.core");


tech.rsqn.core.Templates = function () {
    this.templates = {};
    this.templates_requested = {}; //debounce for gettemplate
    this.enableCache = true;
    this.enableTags = true;
};

tech.rsqn.core.Templates.prototype.getTemplate = function (templateName, forceLoad) {
    var dfd = $.Deferred();
    var self = this;
    var waitMs = 100;

    if (self.templates.hasOwnProperty(templateName)) {
        //Logger.debug("Returning Cached Template " + templateName);
        var ret = $(self.templates[templateName]);
        if (self.enableTags == true) {
            self.replaceTags(ret)
        }
        dfd.resolve(ret);
    } else {
        //Logger.debug("Not in cache [ " + templateName  + "]");

        // small for first load of data cells
        if ( self.templates_requested.hasOwnProperty(templateName) && (! forceLoad === true ) ) {
            setTimeout(function(){
                self.getTemplate(templateName).then(function(tpl){
                    dfd.resolve(tpl,true);
                });
            }, waitMs);
            return dfd;
        }

        self.templates_requested[templateName] = true;
        self.loadTemplate(templateName).then(function(template){
            if (self.enableCache) {
                self.templates[templateName] = template;
                Logger.debug("Cached template [" + templateName + "]");
            }
            var ret = $(template);
            if (self.enableTags == true) {
                self.replaceTags(ret)
            }
            dfd.resolve(ret);
        });
    }
    return dfd;
};

tech.rsqn.core.Templates.prototype.replaceTags = function (tpl) {

    tpl.find(".i18n").each(function (i, e) {
        var elm = $(e);
        elm.html(i18n(elm.attr("data-i18n")));
    });

    tpl.find(".q-pop").each(function (i, e) {
        var elm = $(e);
        elm.html(Qpop(elm, elm.attr("data-qpop")));
    });
};

tech.rsqn.core.Templates.prototype.loadTemplate = function (templateName) {
    var uri = constants.contextPath + '/templates/' + templateName;

    Logger.info("Loading template " + templateName + " from " + uri);

    var dfd = $.Deferred();

    $.ajax({
            type: "GET",
            cache: false,
            url: uri
        }
    ).done(function (data, textStatus, jqXHR) {
            dfd.resolve(data);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            dfd.reject(jqXHR);
        });

    return dfd;

};

var rsTemplates = new tech.rsqn.core.Templates();