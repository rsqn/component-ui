/**
 * Created by IntelliJ IDEA.
 * User: mandrewes
 * To change this template use File | Settings | File Templates.
 */
// Constructor
function TestSuite() {
    var names = new Array();
    var tests = new Array();
    Logger.debug('TestSuite Constructor');
    var testConsole;

    TestSuite.prototype.setConsole = function(cs) {
        Logger.debug("TestSuite Console set");
        testConsole = cs;
    };

   /**
     *
     */
    TestSuite.prototype.registerTest = function(name, testObj) {
        Logger.debug("TestSuite register test [" + name + "]");
        testConsole.logRegister(name);
        names[names.length] = name;
        tests[tests.length] = testObj;
    };

    TestSuite.prototype.createTestCallBack = function(currentIndex, nextIndex, tests, finalCallBack) {
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

    TestSuite.prototype.execute = function(callBack) {
        Logger.debug('TestSuite execute');
        testConsole.log("Executing Test Suite");

        testConsole.logTestSuiteStart(names[0]);
        tests[0].execute(testConsole,this.createTestCallBack(0,1,tests,function(result) {
            Logger.info("TestSuite final callback " + result.isSuccess());
            if (result.isSuccess()) {
                testConsole.log("<font color=green>Test Suite Complete - PASS</font>");
            } else {
                testConsole.log("<font color=red>Test Suite Complete - FAIL</font>");
            }
            //callBack(result);
        }));
    };
}
// extend(TestSuite, UIObject);


