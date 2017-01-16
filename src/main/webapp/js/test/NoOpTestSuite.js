/**
 * Created by IntelliJ IDEA.
 * User: mandrewes
 * To change this template use File | Settings | File Templates.
 */
// Constructor

//@deprecated
function NoOpTestSuite() {

    NoOpTestSuite.prototype.execute = function (testConsole, callBack) {
        this.addTestCase("shouldDoNothing");
        this.executeTests(testConsole, callBack);
    };

    NoOpTestSuite.prototype.shouldDoNothing = function (testConsole, callBack) {
        testConsole.log("within shouldRunTestCaseOne");
        callBack(true);
    };
}
extend(NoOpTestSuite, AcceptanceTest);



