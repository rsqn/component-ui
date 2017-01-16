/**
 * Created by IntelliJ IDEA.
 * User: mandrewes
 * To change this template use File | Settings | File Templates.
 */
// Constructor
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

var Assertions = new Object();
Assertions.arrayHasValue = function(o,v) {
    if ( $.inArray(v, o) >= 0) {
        Assertions.testConsole.log("value " + v  + " was found in array " + o);
        return;
    }
    Assertions.testConsole.log("value " + v  + " was not found in array " + o);
    throw  ("none");
};

Assertions.arrayHasLength = function(o,len) {
    if (o.length == len) {
        Assertions.testConsole.log("Array has correct length of " + len);
        return;
    }
    Assertions.testConsole.log("Array has incorrect length of " + o.length + " expectation was " + len);
    throw  ("none");
};

Assertions.objectHasProperty = function(o,name) {
    if ( o[name]) {
        Assertions.testConsole.log("Object does have property " + name);
        return;
    }
    Assertions.testConsole.log("Object does not have property " + name);
    throw  ("none");
};

Assertions.arrayLengthIsGreaterThan = function(o,len) {
    if (o.length > len) {
        Assertions.testConsole.log("Array has correct length of " + len);
        return;
    }
    Assertions.testConsole.log("Array has incorrect length of " + o.length + " expectation was " + len);
    throw  ("none");
};


Assertions.objectDoesNotHaveProperty = function(o,name) {
    if (o[name]) {
        Assertions.testConsole.log("Object does have property " + name);
        throw  ("none");
    }
    if (o[name]=='' ) {
        Assertions.testConsole.log("Object does have property (but no value) " + name);
        throw  ("none");
    }
    Assertions.testConsole.log("Object does not have property " + name);
};

Assertions.propertyIsEqualTo = function(o,name,shouldBe) {
    if ( o[name]) {
        if ( o[name] == shouldBe) {
            Assertions.testConsole.log("Object value " + name + " equals " + shouldBe);
            return;
        }
    }
    Assertions.testConsole.log("Object property " + name + " value " + o[name] + " is not equal to " + shouldBe);
    throw  ("none");
};



function AcceptanceTest() {
//    var testNames = new Array();
//    var this.testFunctions = new Array();

    Logger.debug('AcceptanceTest Constructor');

    AcceptanceTest.prototype.execute = function(testConsole, callBack) {
        return "Must Override - Execute";
    };

    AcceptanceTest.prototype.addTestCase = function(name) {
        if ( ! this.testFunctions) {
            this.testNames = new Array();
            this.testFunctions = new Array();
        }
        this.testNames[this.testNames.length] = name;
        this.testFunctions[this.testFunctions.length] = this[name];
    };

    AcceptanceTest.prototype.executeTests = function(testConsole, callBack) {
        var result = new TestResult();
        Logger.info("Number of Test Cases " + this.testNames.length);
        var i = 0;
        for( i = 0; i < this.testNames.length; i++) {
            Logger.info("Name " + this.testNames[i]);
        }
        testConsole.logTestCaseStart(this.testNames[0]);
        this.testFunctions[0](testConsole,this.createTestCaseCallBack(result, testConsole,0, 1,this.testFunctions,function() {
            Logger.info("In test - final callback");
            callBack(result);
        }));
    };

    AcceptanceTest.prototype.createTestCaseCallBack = function(fullResults, testConsole, currentIndex, nextIndex, tests, finalCallBack) {
        var self = this;

        if ( nextIndex >= tests.length) {
            return function(result) {
                Logger.info("testCaseEnd Final");
                testConsole.logTestCaseEnd(self.testNames[currentIndex],result);
                var tcr = new TestCaseResult();
                tcr.setName(self.testNames[currentIndex]);
                if ( result && result == true) {
                    tcr.setSuccess();
                }
                fullResults.addCaseResult(tcr);
                finalCallBack(result);
            };
        }

        return function(result) {
            Logger.info("testCaseEnd Standard " + currentIndex + " result " + result);
            testConsole.logTestCaseEnd(self.testNames[currentIndex],result);
            Logger.debug('AcceptanceTest Constructor');
            var tcr = new TestCaseResult();
            tcr.setName(self.testNames[currentIndex]);
            if ( result && result == true) {
                tcr.setSuccess();
            }
            fullResults.addCaseResult(tcr);
            testConsole.logTestCaseStart(self.testNames[nextIndex]);
            var ncb = self.createTestCaseCallBack(fullResults,testConsole, nextIndex, nextIndex+1,tests,finalCallBack);
            try {
                tests[nextIndex](testConsole,ncb);
            } catch (err) {
                testConsole.log("Error in test " + self.testNames[currentIndex] + err);
                ncb(false);
            }
        };
    };


}
// extend(AcceptanceTest, tech.rsqn.UIComponent);


