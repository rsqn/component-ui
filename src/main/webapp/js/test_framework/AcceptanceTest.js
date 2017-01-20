
function AcceptanceTest() {

};

    Logger.debug('AcceptanceTest Constructor');

    AcceptanceTest.prototype.execute = function(testConsole, callBack) {
        return "Must Override - Execute";
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


AcceptanceTest.suites = {};

AcceptanceTest.addTestCase = function(name) {
    if ( ! this.testFunctions) {
        this.testNames = new Array();
        this.testFunctions = new Array();
    }
    this.testNames[this.testNames.length] = name;
    this.testFunctions[this.testFunctions.length] = this[name];
};

AcceptanceTest.defTest = function(name) {
    if ( ! this.testFunctions) {
        this.testNames = new Array();
        this.testFunctions = new Array();
    }
    this.testNames[this.testNames.length] = name;
    this.testFunctions[this.testFunctions.length] = this[name];
};

AcceptanceTest.defSuite = function(suiteName) {
    var s = AcceptanceTest.suites[suiteName];
    if ( ! s ) {
        s = function() {

        };
        extend(s,AcceptanceTest);
        AcceptanceTest.suites[suiteName] = s;

        s.defTest = function(testName,fn) {
            var suite = AcceptanceTest.suites[suiteName];
            Logger.info("suiteName " + suiteName + " is " + suite);
            suite.prototype[testName] = fn;
            debugger;
            s.addTestCase(testName);
            Logger.info("Acceptance Test " + suiteName + "." + testName  + " registered");
        }

        s.prototype.execute = function(testConsole, callBack) {
            this.executeTests(testConsole, callBack);
        };

        Logger.info("Acceptance Test Suite " + suiteName  + " registered");
    }
    return s;
};
//
//AcceptanceTest.defTest = function(n,fn) {
//    var paths = n.split('.');
//    if ( paths.length != 2) {
//        Logger.error("Acceptance Test should follow format Suite.TestName only");
//        return;
//    }
//    var suiteName = paths[0];
//    var testName = paths[1];
//
//    var suite = AcceptanceTest.suites[suiteName];
//
//    Logger.info("suiteName " + suiteName + " is " + suite);
//    suite.prototype[testName] = fn;
//    Logger.info("Acceptance Test  " + n  + " registered");
//}

//AcceptanceTest.register = function(suite) {
//    extend(suite,AcceptanceTest);
//}
// extend(AcceptanceTest, tech.rsqn.UIComponent);


