ns("tech.rsqn.core");

tech.rsqn.core.NavigationCommon = function () {
    this.attempts = 0;
};

tech.rsqn.core.NavigationCommon.prototype.registerBase = function (path) {
    page.base(path);
};

tech.rsqn.core.NavigationCommon.prototype.scan = function (pkgName, container) {
    var paths = pkgName.split('.');
    var pkg = window[paths[0]];
    var dfd = $.Deferred();

    Logger.info("Scanning package " + pkgName + " for Pages to register with selector " + container);

    for ( var i = 1; i < paths.length; i++) {
        pkg = pkg[paths[i]];
    }

    var countUp = 0;

    for (var c in pkg) {
        var n = pkgName + "." + c;
        var ins = eval('new ' + n + '();');

        if ( ins instanceof tech.rsqn.ui.Page ) {
            Logger.info("Initializing (" + n + ")");
            countUp++;

            // ins.initAsync(container).then(function(){
            //     countUp--;
            //     Logger.debug('init async callback');
            //
            //     if ( countUp <= 0) {
            //         Logger.debug('countdown complete');
            //         dfd.resolve();
            //     }
            // });
        } else {
            //todo - dont do this thing that i do
            Logger.info("Skipping (" + n + ")");
            delete ins;
        }
    }

    return dfd;

};

tech.rsqn.core.NavigationCommon.prototype.registerFn = function (path, fn) {
    Logger.info("registerFn " + path);
    page(path, fn);
};

tech.rsqn.core.NavigationCommon.prototype.mkNavFn = function (path) {
    return function(e) {
        navCommon.navigate(path);
    }
};

tech.rsqn.core.NavigationCommon.prototype.registerPath = function (path, eventName) {
    Logger.info("registerPath " + path);

    // page(path, function (ctx, next) {
    //         Logger.info("registerPath.navigateTo path (" + path + ") eventName(" + eventName + ") with ctx " + JSON.stringify(ctx));
    //         $("body").trigger("nav-clear");
    //         if ("*" === path) {
    //             Logger.info("Frontend 404 " + ctx.canonicalPath);
    //             //ga('send', 'pageview', {
    //             //    'page': ctx.canonicalPath,
    //             //    'title': eventName
    //             //});
    //         } else {
    //             $("body").trigger("nav-do-" + path, ctx);
    //             //ga('send', 'pageview', {
    //             //    'page': ctx.canonicalPath,
    //             //    'title': eventName
    //             //});
    //         }
    //     }
    // );
};

tech.rsqn.core.NavigationCommon.prototype.ready = function () {
    // page();
};

tech.rsqn.core.NavigationCommon.prototype.navigate = function (path) {
    Logger.info("NavigationCommon.navigate (" + path + ")");
    // page(path);
};

//tech.rsqn.core.NavigationCommon.prototype.back = function () {
//    Logger.info("NavigationCommon.back");
//    page.exit();
//    //page(path);
//}

var navCommon = new tech.rsqn.core.NavigationCommon();

