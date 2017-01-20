
function AcceptanceTestDefinition() {
    this.testCases = new Array();
};

AcceptanceTestDefinition.globalSuites = {};

AcceptanceTestDefinition.suite = function(suiteName) {
    var s = AcceptanceTestDefinition.globalSuites[suiteName];
    if ( ! s ) {
        s = new AcceptanceTestDefinition();
        s.suiteName = suiteName;
        AcceptanceTestDefinition.globalSuites[suiteName] = s;
        Logger.info("Acceptance Test Suite " + suiteName  + " globally registered");
    }
    return s;
};

AcceptanceTestDefinition.addToSuiteRunner = function(pattern,suiteRunner) {
    Logger.info("Adding tests matching pattern " + pattern + " to test suite");

    for ( var n in AcceptanceTestDefinition.globalSuites ) {
        Logger.info("Adding " + n + " to suite ");
        var instance = AcceptanceTestDefinition.globalSuites[n].newTestInstance();
        suiteRunner.registerTest(n,instance);
    }
};


AcceptanceTestDefinition.prototype.addTestCase = function(name,fn) {
    var self = this;

    var testCase = {
        name: name,
        fn: fn
    };

    self.testCases.push(testCase);

};

AcceptanceTestDefinition.prototype.test = function(testName,fn) {
    var self = this;
    Logger.info("suiteName " + self.suiteName + " is " + self);
    self.addTestCase(testName,fn);
};


AcceptanceTestDefinition.prototype.newTestInstance = function() {
    var self = this;
    var suite = AcceptanceTestDefinition.globalSuites[self.suiteName];
    Logger.info("creating new instance of " + self.suiteName + " is " + suite);

    var testScope = function() {

    };
    extend(testScope,AcceptanceTest);

    for ( var i = 0 ; i < self.testCases.length; i++) {
        var testCase = self.testCases[i];
        testScope.prototype[testCase.name] = testCase.fn;
    }

    var instance = new testScope();

    for ( var i = 0 ; i < self.testCases.length; i++) {
        var testCase = self.testCases[i];
        instance.addTestCase(testCase.name);
    }

    return instance;
};

