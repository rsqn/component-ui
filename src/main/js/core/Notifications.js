ns("tech.rsqn.ui.notification");


tech.rsqn.ui.notification.Notification = function () {
};

//    title: Notification Tittle
//    content: The text inside of the notification
//    img: (optional), If you don't specify an image, the plugin will show a default cloud picture.
//    number: (optional) A number that will appear in the bottom left side of the notification.
//    color: (optional) HTML color code. Example: #ec008c  = pink
//    timeout: (optional) Time in miliseconds. Example: 1000 = 1 second
//    sound(Optinal): Default value is true, but set it to false, if you don't want the sound (Available in version 4.5 or later)
//    colortime: (Optional) Time in miliseconds to change the background color. New in v5
//    colors: (Optional) Array of HTML color that you want to show. New in v5


tech.rsqn.ui.notification.Notification.successNotification = function (title, message, options) {
    var p = {
        title: title,
        content: message,
        timeout: 20000,
        img: constants.contextPath + "/icon/thumb_up-50.png"
    };

    if ( options ) {
        for (var k in options) {
            p[k] = options[k];
        }
    }
    $.bigBox(p);
};

tech.rsqn.ui.notification.Notification.errorNotification = function (title, message, options, callback) {
    tech.rsqn.ui.notification.Notification.fatalNotification(title,message,options, callback);
//    var p = {
//        title: title,
//        content: message,
//        timeout: 60000,
//        img: "/icon/error-50.png"
//    };
//
//    if ( options ) {
//        for (var k in options) {
//            p[k] = options[k];
//        }
//    }
//    $.bigBox(p);
};

tech.rsqn.ui.notification.Notification.fatalNotification = function (title, message, options, callback) {
    var p = {
        title: title,
        content: message,
        timeout: 60000,
        img:  constants.contextPath + "/icon/error-50.png",
        buttons: "[I See]"
    };

    if ( options ) {
        for (var k in options) {
            p[k] = options[k];
        }
    }
    $.MetroMessageBox(p, callback);
};

tech.rsqn.ui.notification.Notification.buttons = function (buttonList) {
    var ret = [];

    for( var i = 0; i < buttonList.length; i++) {
        ret[i] = "[" + buttonList[i] + "]";
    }
    return ret;
};

tech.rsqn.ui.notification.Notification.confirmNotification = function (title, message, options, callback) {
    var p = {
        title: title,
        content: message,
        timeout: 60000,
        buttons: "[Yes][No]"
    };

    if ( options ) {
        for (var k in options) {
            p[k] = options[k];
        }
    }
    $.MetroMessageBox(p, callback);
};

tech.rsqn.ui.notification.Notification.warnNotification = function (title, message, options) {
    var p = {
        title: title,
        content: message,
        timeout: 10000,
        img:  constants.contextPath + "/icon/error-50.png"
    };

    if ( options ) {
        for (var k in options) {
            p[k] = options[k];
        }
    }
    $.bigBox(p);
};

tech.rsqn.ui.notification.Notification.infoNotification = function (title, message, options) {
    var p = {
        title: title,
        content: message,
        timeout: 10000,
        img:  constants.contextPath + "/icon/info-50.png"
    };

    if ( options ) {
        for (var k in options) {
            p[k] = options[k];
        }
    }
    $.bigBox(p);
};

var rsNotification = tech.rsqn.ui.notification.Notification;
var notify = rsNotification;


