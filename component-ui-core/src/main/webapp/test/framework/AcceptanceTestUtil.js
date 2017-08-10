
var AcceptanceTestUtil = new Object();

AcceptanceTestUtil.ajaxRequest = function(requestType, url, postBody, contentType, testConsole, testCallBackFunc, successFunc, errorFunc) {
    testConsole.log("AJAXRequest - Endpoint: " + url);
    testConsole.log("AJAXRequest - Request Type: " + requestType);

    try {
        var parsed = JSON.parse(postBody);
//        Logger.info("Parsed postBody");
        testConsole.log("AJAXRequest - Body: <pre>" + JSON.stringify(parsed,null, '&nbsp;') + "</pre>");
    } catch ( err ) {
//        Logger.info("Error parsing postBody");
        testConsole.log("AJAXRequest - Body: " + postBody);
    }



    $.ajax({
        type: requestType,
        cache: false,
        url:url,
        contentType: contentType,
        data: postBody,
        success: function(result,jqXHR) {
            testConsole.log("AJAXResponse (OK) - <pre>" + JSON.stringify(result,null, '&nbsp;') + "</pre>");
            try {
                successFunc(result);
            } catch ( err ) {
                testCallBackFunc(false);
            }
        },
        error: function(jqXHR, textStatus) {
            testConsole.log("AJAXResponse (ERROR) - " + jqXHR.responseText);
            testConsole.log(JSON.stringify(jqXHR));

            var responseObj = $.parseJSON(jqXHR.responseText);

            try {
                errorFunc(responseObj, jqXHR);
            } catch ( err ) {
                testCallBackFunc(false);
            }
        }
    });
};