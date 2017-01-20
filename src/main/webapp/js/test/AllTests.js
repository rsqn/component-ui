#include NoOpTestSuite.js

Logger.info("All Tests");

$(document).ready(function() {
   var testConsole = new TestConsole();
   var suite = new TestSuite();
   Assertions.testConsole = testConsole;
   testConsole.onReady("#test_console");
   suite.setConsole(testConsole);

    AcceptanceTestDefinition.
//   scanNamespaceForInstancesWithProperty('tests','butter');

//   suite.registerTest('NoOpTestSuite',new NoOpTestSuite());
//
//   suite.execute( function(result) {
//        Logger.info("Final callback");
//        testConsole.log("All Suites Complete");
//   });

});