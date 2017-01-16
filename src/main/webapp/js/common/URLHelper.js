function URLUtil() {
    URLUtil.prototype.addParameter = function (uri,name,value) {
        if ( name === undefined) {
            return uri;
        }

        if ( uri.contains("?")) {
            return uri + "&" + name + "=" + value;
        }  else {
            return uri + "?" + name + "=" + value;
        }
    };

    URLUtil.prototype.getURLParameter = function (name) {
        return decodeURIComponent(
            (RegExp(name + '=' + '(.+?)(&|$)', 'i').exec(location.search) || [, ""])[1]
        );
    };
}


var urlUtil = new URLUtil();