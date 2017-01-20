ns("tech.rsqn.ui");


tech.rsqn.ui.Page = function () {
    // this.api = new tech.rsqn.api.AbstractApi();
};

extend(tech.rsqn.ui.Page, tech.rsqn.core.UIComponent);


tech.rsqn.ui.Page.prototype.trigger = function (name, param) {
    for ( var i = 0; i < this.widgets.length; i++) {
        this.widgets[i].onEvent(name,param);
    }
};

tech.rsqn.ui.Page.prototype.removeWidgets = function () {
    for ( var i = 0; i < this.widgets.length; i++) {
        this.widgets[i].dispose();
    }
    this.widgets = [];
};


tech.rsqn.ui.Page.manufacture = function(pkgName,clsName,navPath,tplPath,optTitle) {
    Logger.info("Manufacturing page " + pkgName + "." + clsName);

    var pkg = ns(pkgName);

    var bake = function() {
        var cls = pkg[clsName] =  function () {
            this.attempts = 0;
            this.name = clsName;
            this.path = navPath;
            if ( optTitle ) {
                this.title = optTitle;
            }
        };

        extend(cls, tech.rsqn.ui.Page);

        cls.prototype.init = function(container) {
            var self = this;
            this.initTemplate(container, tplPath);
            Logger.info( clsName + " initialized");

            var navIn = function (ctx) {
                self.myElement.show();
            };

            var navOut = function (ctx) {
                self.myElement.hide();
            };

            var onLoad = function (ctx) {
                self.container.append(self.myElement);
                navIn(ctx);
            };

            this.bindNavigationListeners(this.name, this.path, navIn, navOut, onLoad);
        };

        return cls;
    };

    return bake();

};


