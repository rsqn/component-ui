

var Assertions = new Object();
Assertions.arrayHasValue = function(o,v) {
    if ( $.inArray(v, o) >= 0) {
        Assertions.testConsole.log("value " + v  + " was found in array " + o);
        return;
    }
    Assertions.testConsole.log("value " + v  + " was not found in array " + o);
    throw  ("none");
};

Assertions.arrayHasLength = function(o,len) {
    if (o.length == len) {
        Assertions.testConsole.log("Array has correct length of " + len);
        return;
    }
    Assertions.testConsole.log("Array has incorrect length of " + o.length + " expectation was " + len);
    throw  ("none");
};

Assertions.objectHasProperty = function(o,name) {
    if ( o[name]) {
        Assertions.testConsole.log("Object does have property " + name);
        return;
    }
    Assertions.testConsole.log("Object does not have property " + name);
    throw  ("none");
};

Assertions.arrayLengthIsGreaterThan = function(o,len) {
    if (o.length > len) {
        Assertions.testConsole.log("Array has correct length of " + len);
        return;
    }
    Assertions.testConsole.log("Array has incorrect length of " + o.length + " expectation was " + len);
    throw  ("none");
};


Assertions.objectDoesNotHaveProperty = function(o,name) {
    if (o[name]) {
        Assertions.testConsole.log("Object does have property " + name);
        throw  ("none");
    }
    if (o[name]=='' ) {
        Assertions.testConsole.log("Object does have property (but no value) " + name);
        throw  ("none");
    }
    Assertions.testConsole.log("Object does not have property " + name);
};

Assertions.propertyIsEqualTo = function(o,name,shouldBe) {
    if ( o[name]) {
        if ( o[name] == shouldBe) {
            Assertions.testConsole.log("Object value " + name + " equals " + shouldBe);
            return;
        }
    }
    Assertions.testConsole.log("Object property " + name + " value " + o[name] + " is not equal to " + shouldBe);
    throw  ("none");
};

