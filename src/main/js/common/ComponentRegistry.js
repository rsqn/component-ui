ns("tech.rsqn.util");


tech.rsqn.util.ComponentRegistry = function () {
    this.registry = {};
};

tech.rsqn.util.ComponentRegistry.prototype.scan = function (pkgName) {
    var paths = pkgName.split('.');
    var pkg = window[paths[0]];

    Logger.info("Scanning package " + pkgName + " for components");

    for ( var i = 1; i < paths.length; i++) {
        pkg = pkg[paths[i]];
    }

    for (var c in pkg) {
        //Logger.info("c == " + c);
        var n = pkgName + "." + c;

        var isComponent = eval(n + '["isComponent"] === true;');
        if ( isComponent === true ) {
            var componentName = eval(n).componentName;
            this.register(componentName,n);
        }
    }
};

tech.rsqn.util.ComponentRegistry.prototype.register = function (name, clsName) {
    Logger.debug("Registered component " + name + " : " + clsName);
    this.registry[name] = clsName;
};

tech.rsqn.util.ComponentRegistry.prototype.getInstance = function (name) {
    var cls = this.registry[name];
    var ins = eval('new ' + cls + '();');
    return ins;
};

var componentRegistry = new tech.rsqn.util.ComponentRegistry();