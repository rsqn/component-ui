
function EnquiryTestSuite() {
    var enquiryUid = "-1";

    EnquiryTestSuite.prototype.execute = function (testConsole, callBack) {
        this.addTestCase("shouldAddEnquiry");
        this.addTestCase("shouldFailToAddEnquiryWithNoEmailAddress");
        this.addTestCase("shouldListEnquiries");
//        this.addTestCase("shouldPostEnquiry");
        
        this.executeTests(testConsole, callBack);
    };


    EnquiryTestSuite.prototype.shouldAddEnquiry = function (testConsole, callBack) {
        var url = "/pbc/service/v1/enquiry/add";
        var itemToAdd = {
            "email" : "me@me.com",
            "name" : "Mr Bigglesworth",
            "company" : "Rogue Fluffy",
            "position" : "CDO",
            "phone" : "6969696969",
            "mobile" : "9696969696",
            "lookingFor" : [ "Peanuts", "Whiskey" , "Beer"]
        };
        var self = this;

        AcceptanceTestUtil.ajaxRequest(
            "POST",
            url,
            JSON.stringify(itemToAdd),
            "application/json",
            testConsole,
            callBack,
            function (result) {
                Assertions.objectHasProperty(result,"uid");
                Assertions.objectHasProperty(result,"looking_for");
                self.enquiryUid = result.uid;
                callBack(true);
            }
            ,
            function (responseObj, jqXHR) {
                callBack(false);
            }
        );
    };

    EnquiryTestSuite.prototype.shouldFailToAddEnquiryWithNoEmailAddress = function (testConsole, callBack) {
        var url = "/pbc/service/v1/enquiry/add";
        var itemToAdd = {
            "name" : "Mr Bigglesworth",
            "company" : "Rogue Fluffy",
            "position" : "CDO",
            "phone" : "6969696969",
            "mobile" : "9696969696",
            "lookingFor" : [ "Peanuts", "Whiskey" , "Beer"]
        };
        var self = this;

        AcceptanceTestUtil.ajaxRequest(
            "POST",
            url,
            JSON.stringify(itemToAdd),
            "application/json",
            testConsole,
            callBack,
            function (result) {
                callBack(false);
            }
            ,
            function (responseObj, jqXHR) {
                callBack(true);

            }
        );
    };


    EnquiryTestSuite.prototype.shouldListEnquiries = function (testConsole, callBack) {
        var url = "/pbc/service/v1/enquiry/list";
        var self = this;

        AcceptanceTestUtil.ajaxRequest(
            "GET",
            url,
            "",
            "application/json",
            testConsole,
            callBack,
            function (result) {
                Assertions.arrayLengthIsGreaterThan(result,0);
                var i = 0;
                var pass = false;
                for ( i = 0; i < result.length; i++) {
                    if ( result[i].uid == self.enquiryUid) {
                        pass=true;
                    }
                }
                if ( pass == true) {
                    callBack(true);
                } else {
                    callBack(false);
                }
            }
            ,
            function (responseObj, jqXHR) {
                callBack(false);
            }
        );
    };

    EnquiryTestSuite.prototype.shouldPostEnquiry = function (testConsole, callBack) {
        var url = "/pbc/service/v1/enquiry/submit?success_uri=http://my.success.uri&failure_uri=http://my.failure.uri";
        var itemToAdd = {
            "email" : "me@me.com",
            "name" : "Mr Bigglesworth",
            "company" : "Rogue Fluffy",
            "position" : "CDOX",
            "phone" : "6969696969",
            "mobile" : "9696969696",
            "lookingFor" : [ "Peanuts", "Whiskey" , "Beer"]
        };
        var self = this;

        var postBody = ajaxTools.convertObjectToFormPost(itemToAdd);
        Logger.info("postBody is " + postBody);

        AcceptanceTestUtil.ajaxRequest(
            "POST",
            url,
            postBody,
            "application/x-www-form-urlencoded",
            testConsole,
            callBack,
            function (result) {
                Logger.info("Within success");
                callBack(true);
            }
            ,
            function (responseObj, jqXHR) {
                Logger.info("Within failure");
                callBack(true);
            }
        );
    };
}
//extend(EnquiryTestSuite, AcceptanceTest);



