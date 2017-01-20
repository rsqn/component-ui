#include NoOpTestSuite.js

Logger.info("All Tests");

$(document).ready(function () {
    var suiteRunner = defaultSuiteRunner();
    AcceptanceTestDefinition.addToSuiteRunner('.*', suiteRunner);

    suiteRunner.execute(function (result) {
        Logger.info("Final callback");
    });

});