
function TestCaseResult() {
    var name;
    var success = false;

    TestCaseResult.prototype.setName = function(n) {
        name = n;
    };

    TestCaseResult.prototype.setSuccess = function() {
        Logger.info("Success true");
        success = true;
    };

    TestCaseResult.prototype.isSuccess = function() {
        Logger.info("isSuccess " + success);
        return success;
    };
}
// extend(TestCaseResult, UIObject);


