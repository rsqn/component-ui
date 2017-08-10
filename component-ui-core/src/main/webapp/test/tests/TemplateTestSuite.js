var TemplateTestSuite = AcceptanceTestDefinition.suite("TemplateTestSuite");

TemplateTestSuite.test('shouldLoadTemplate',
    function (testConsole, callBack) {

        var config = [
            "test/test-tpl.html"
        ];

        cuiTemplates.init(config, function (err) {
            if (err) {
                return callBack(err);
            }

            var tpl = cuiTemplates.getTemplate("test/test-tpl.html");

            var div = testConsole.div();
            div.append(tpl);

            if (tpl.text() == "itverks") {
                callBack(true);
            } else {
                callBack(false);
            }

        });
    }
);
