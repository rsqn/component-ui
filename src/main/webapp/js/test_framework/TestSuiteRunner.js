
function TestSuiteRunner() {
    var names = new Array();
    var tests = new Array();
    Logger.debug('TestSuiteRunner Constructor');
    var testConsole;

    TestSuiteRunner.prototype.setConsole = function(cs) {
        Logger.debug("TestSuiteRunner Console set");
        testConsole = cs;
    };

   /**
     *
     */
    TestSuiteRunner.prototype.registerTest = function(name, testObj) {
        Logger.debug("TestSuiteRunner register test [" + name + "]");
        testConsole.logRegister(name);
        names[names.length] = name;
        tests[tests.length] = testObj;
    };

    TestSuiteRunner.prototype.createTestCallBack = function(currentIndex, nextIndex, tests, finalCallBack) {
        var self = this;

        if ( nextIndex >= tests.length) {
            return function(result) {
                Logger.info("logTestEndCallback Final");
                testConsole.logTestSuiteEnd(names[currentIndex]);
                finalCallBack(result);
            };
        }

        return function(result) {
            Logger.info("logTestEndCallback Standard " + currentIndex);
            testConsole.logTestSuiteEnd(names[currentIndex]);
            testConsole.logTestSuiteStart(names[nextIndex]);
            tests[nextIndex].execute(testConsole,self.createTestCallBack(nextIndex, nextIndex+1,tests,finalCallBack));
        };
    };

    TestSuiteRunner.prototype.execute = function(callBack) {
        Logger.debug('TestSuiteRunner execute');
        testConsole.log("Executing Test Suite");

        testConsole.logTestSuiteStart(names[0]);
        tests[0].execute(testConsole,this.createTestCallBack(0,1,tests,function(result) {
            Logger.info("TestSuiteRunner final callback " + result.isSuccess());
            if (result.isSuccess()) {
                testConsole.log("<font color=green>Test Suite Complete - PASS</font>");
            } else {
                testConsole.log("<font color=red>Test Suite Complete - FAIL</font>");
            }
            //callBack(result);
        }));
    };
}
// extend(TestSuiteRunner, UIObject);


