
#include AcceptanceTestUtil.js
#include Assertions.js
#include AcceptanceTestDefinition.js
#include AcceptanceTest.js
#include TestCaseResult.js
#include TestConsole.js
#include TestResult.js
#include TestSuiteRunner.js

var defaultSuiteRunner = function() {
    var testConsole = new TestConsole();
    var suiteRunner = new TestSuiteRunner();
    Assertions.testConsole = testConsole;
    testConsole.onReady("#test_console");
    suiteRunner.setConsole(testConsole);
    return suiteRunner;
};

Logger.info("included package: test_framework");