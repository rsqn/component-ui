/**
 * Created by IntelliJ IDEA.
 * User: mandrewes
 * To change this template use File | Settings | File Templates.
 */
// Constructor
function TestConsole() {
    Logger.debug('TestConsole Constructor');
    var blotter;
    /**
     *
     */
    TestConsole.prototype.onReady = function(divName) {
        Logger.debug('TestConsole onReady in divName ' + divName);
        blotter = $(divName);
        Logger.debug("Blotter initialised");
        this.log("Blotter Initialized");
    };

    TestConsole.prototype.runTests = function(testSuite) {
        Logger.debug('TestConsole runTests ');
        this.log("Running Tests");
        testSuite.execute(this);
    };

    TestConsole.prototype.blot = function(s) {
        blotter.append(s);
        var x = 0;  //horizontal coord
        var y = document.height; //vertical coord
        window.scroll(x,y);
    };

    TestConsole.prototype.log = function(s) {
        this.blot("<font color=gray>--" + s + "</font><br/>");
    };

    TestConsole.prototype.logRegister = function(s) {
        this.blot("<b>[test registered] </b>" + s + "<br/>");
    };

    TestConsole.prototype.logTestSuiteStart = function(s) {
        this.blot("<hr/>");
        this.blot("<h3>Suite - " + s + " - Start</h3>");
    };

    TestConsole.prototype.logTestSuiteEnd = function(s) {
        this.blot("<h3>Suite -" + s + " - End</h3>");
    };

    TestConsole.prototype.logTestCaseStart = function(s) {
        this.blot("<b>" + s + " - Start</b><br/>");
    };

    TestConsole.prototype.logTestCaseEnd = function(s, res) {
        if ( res == true) {
            this.blot("<b><font color=green>" + s + " - PASS</font></b><br/><br/>");
        } else {
            this.blot("<b><font color=red>" + s + " - FAIL</font></b><br/><br/>");
        }
    };

}
// extend(TestConsole, UIObject);



