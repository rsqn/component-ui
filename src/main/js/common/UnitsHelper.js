ns("tech.rsqn.util");


tech.rsqn.util.UnitsUtil = function () {
};

tech.rsqn.util.UnitsUtil.prototype.formatBytes = function (v) {
    if ( v < 1024 )  {
        return v + " b";
    } else if ( v < (1024 * 1024)) {
        return (v/1024).toFixed(2)  + " KB";
    } else if ( v < (1024 * 1024 * 1024)) {
        return (v/1024/1024).toFixed(2)  + " MB";
    } else if ( v < (1024 * 1024 * 1024 * 1024)) {
        return (v/1024/1024/1024).toFixed(2)  + " GB";
    } else if ( v < (1024 * 1024 * 1024 * 1024 * 1024)) {
        return (v/1024/1024/1024/1024).toFixed(2) + " TB";
    }
};

var unitsUtil = new tech.rsqn.util.UnitsUtil();
