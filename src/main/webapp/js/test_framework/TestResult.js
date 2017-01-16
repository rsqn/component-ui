/**
 * Created by IntelliJ IDEA.
 * User: mandrewes
 * To change this template use File | Settings | File Templates.
 */
// Constructor
function TestResult() {
    Logger.debug('TestResult Constructor');
    var success = true;
    var caseResults = new Array();

    TestResult.prototype.isSuccess = function() {
        return success;
    };

    TestResult.prototype.setSuccess = function() {
        success = true;
    };

    TestResult.prototype.setFailure = function() {
        success = false;
    };

    TestResult.prototype.addCaseResult = function(tcr) {
        caseResults[caseResults.length] = tcr;
        if ( ! tcr.isSuccess()) {
            this.setFailure();
        }
    };
}
// extend(TestResult, UIObject);


