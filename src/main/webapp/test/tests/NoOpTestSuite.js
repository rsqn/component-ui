var NoOpTestSuite = AcceptanceTestDefinition.suite('NoOpTestSuite');

NoOpTestSuite.test('shouldDoNothing',
    function (testConsole, callBack) {
        testConsole.log("within shouldDoNothing");
        callBack(true);
    }
);



NoOpTestSuite.test('shouldFailTests',
    function (testConsole, callBack) {
        callBack(true);
    }
);
