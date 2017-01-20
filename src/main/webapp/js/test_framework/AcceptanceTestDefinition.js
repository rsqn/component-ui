
function AcceptanceTestDefinition() {
};

AcceptanceTestDefinition.globalSuites = {};

AcceptanceTestDefinition.prototype.addTestCase = function(name) {
    var self = this;
    if ( ! this.testFunctions) {
        self.testNames = new Array();
        self.testFunctions = new Array();
    }
    self.testNames[this.testNames.length] = name;
    self.testFunctions[this.testFunctions.length] = this[name];
};

AcceptanceTestDefinition.prototype.test = function(testName,fn) {
    var self = this;
    var suiteDefinition = AcceptanceTestDefinition.globalSuites[self.suiteName];
    Logger.info("suiteName " + self.suiteName + " is " + suiteDefinition);
//    suiteDefinition[testName] = fn;
//    suiteDefinition.addTestCase(testName);
    Logger.info("Acceptance Test " + self.suiteName + "." + testName  + " registered");
};

AcceptanceTestDefinition.prototype.newTestInstance = function() {
    var self = this;
    var suite = AcceptanceTestDefinition.globalSuites[self.suiteName];
    Logger.info("creating new instance of " + self.suiteName + " is " + suite);

    var instance = suite;  // wrong
    suite[testName] = fn;
    suite.addTestCase(testName);
    Logger.info("Acceptance Test " + self.suiteName + "." + testName  + " registered");
};

AcceptanceTestDefinition.prototype.addToSuite = function(testSuite) {
    var self = this;

    for ( var n in AcceptanceTestDefinition.globalSuites ) {
        Logger.info("Adding " + n + " to suite ");
        var instance = AcceptanceTestDefinition.globalSuites[n].newTestInstance();
        testSuite.registerTest(n,instance);
    }
};

AcceptanceTestDefinition.suite = function(suiteName) {
    var s = AcceptanceTest.suites[suiteName];
    if ( ! s ) {
        s = new AcceptanceTestDefinition();
        s.suiteName = suiteName;
        AcceptanceTestDefinition.globalSuites[suiteName] = s;
        Logger.info("Acceptance Test Suite " + suiteName  + " globally registered");
    }
    return s;
};
//
//AcceptanceTest.defTest = function(n,fn) {
//    var paths = n.split('.');
//    if ( paths.length != 2) {
//        Logger.error("Acceptance Test should follow format Suite.TestName only");
//        return;
//    }
//    var suiteName = paths[0];
//    var testName = paths[1];
//
//    var suite = AcceptanceTest.suites[suiteName];
//
//    Logger.info("suiteName " + suiteName + " is " + suite);
//    suite.prototype[testName] = fn;
//    Logger.info("Acceptance Test  " + n  + " registered");
//}

//AcceptanceTest.register = function(suite) {
//    extend(suite,AcceptanceTest);
//}
// extend(AcceptanceTest, tech.rsqn.UIComponent);


