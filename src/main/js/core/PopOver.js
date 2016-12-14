ns("tech.rsqn.core");


tech.rsqn.core.Qpop = function () {

};

var Qpop = function (element, msg, args) {

    var msgResolved = i18n(msg, args);

    //element.attr("tooltip", i18n(msg, args));
    element.attr("data-toggle", "popover");
    element.attr("data-content", msgResolved);

    element.popover({
        delay: {
            "show": 500,
            "hide": 100
        },
        trigger: "hover focus manual"
    });

    if ( msgResolved == msg) {
        element.css("color","red");
    }
};

