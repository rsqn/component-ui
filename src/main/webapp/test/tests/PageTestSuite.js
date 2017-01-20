var PageTestSuite = AcceptanceTestDefinition.suite('PageTestSuite');

PageTestSuite.test('shouldLoadPage',
    function (testConsole, callBack) {

        var n = "/shouldLoadTestAppWithWidgets";

        var div = testConsole.div();
        var page = tech.rsqn.ui.Page.manufacture("test.rsqn",n,"/","/test-tpl.html",n);

        new page().init(div);

        callBack(false);
    }
);
