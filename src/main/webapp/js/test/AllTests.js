#include NoOpTestSuite.js

Logger.info("All Tests");

$(document).ready(function() {
   var testConsole = new TestConsole();
   var suite = new TestSuite();
   Assertions.testConsole = testConsole;

   testConsole.onReady("#test_console");
   suite.setConsole(testConsole);

  suite.registerTest('NoOpTestSuite',new NoOpTestSuite());

   var callBack = function(result) {
       Logger.info("Final callback");
       testConsole.log("All Suites Complete");
   };
   suite.execute(callBack);

});