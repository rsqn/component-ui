var NoOpTestSuite = AcceptanceTestDefinition.suite('NoOpTestSuite');

NoOpTestSuite.test('shouldDoNothing',
    function (testConsole, callBack) {
        testConsole.log("within shouldDoNothing");
        callBack(true);
    }
);
//
//AcceptanceTest.defTest('NoOpTestSuite.shouldDoNothing',
//    function (testConsole, callBack) {
//      testConsole.log("within shouldDoNothing");
//      callBack(true);
//    }
//);

//
//tests.NoOpTestSuite = function(){
//
//};
//
//tests.NoOpTestSuite.prototype.execute = function (testConsole, callBack) {
//        this.addTestCase("shouldDoNothing");
//        this.executeTests(testConsole, callBack);
//    };
//
//    tests.NoOpTestSuite.prototype.shouldDoNothing = function (testConsole, callBack) {
//        testConsole.log("within shouldRunTestCaseOne");
//        callBack(true);
//    };

//AcceptanceTest.register(tests.NoOpTestSuite);




