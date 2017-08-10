function ns(namespaceString) {
    var parts = namespaceString.split('.'),
        parent = window,
        currentPart = '';

    for(var i = 0, length = parts.length; i < length; i++) {
        currentPart = parts[i];
        parent[currentPart] = parent[currentPart] || {};
        parent = parent[currentPart];
    }

    return parent;
}


function extend(subclass, superclass) {
    subclass.prototype = new superclass;
    subclass.prototype.constructor = subclass;
    subclass.superclass = superclass;
    subclass.superproto = superclass.prototype;
}

function createDelegate(obj, method, args, appendArgs){
    return function() {
        var callArgs = args || arguments;
        if(appendArgs === true){
            callArgs = Array.prototype.slice.call(arguments, 0);
            callArgs = callArgs.concat(args);
        }else if(typeof appendArgs == "number"){
            callArgs = Array.prototype.slice.call(arguments, 0);
            var applyArgs = [appendArgs, 0].concat(args);
            Array.prototype.splice.apply(callArgs, applyArgs);
        }
        return method.apply(obj || window, callArgs);
    };
};

ns('tech.rsqn.util');

var scanNamespaceForInstancesWithProperty = function (nsName, propName) {
    var paths = nsName.split('.');
    var pkg = window[paths[0]];

    var ret = new Array();

    Logger.info("Scanning namespace (" + nsName + ") for instances with property " + propName + " = true ");

    for ( var i = 1; i < paths.length; i++) {
        pkg = pkg[paths[i]];
    }

    for (var c in pkg) {
        var n = nsName + "." + c;
        Logger.info("n is " + n);

        var propVal = eval(n + '["' + propName+ '"] === true');
        if ( propVal === true ) {
            Logger.info("Found " + n + " with " + propName + " === true");
//            var componentName = eval(n).componentName;
//            this.register(componentName,n);
        }
    }

    Logger.info("Found " + ret.length + " instances with property " + propName + " === true");
};