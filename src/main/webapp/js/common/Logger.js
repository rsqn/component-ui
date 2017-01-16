//Constructor
function LoggingWrapper() {
    var v = "[0.0.4] ";

    LoggingWrapper.prototype.output = function(lvl, s) {
        if (['console']) {
            console.log( v + '[' + lvl + '] ' + s );
        }
    };

    LoggingWrapper.prototype.debug = function(s) {
       // this.output('DEBUG',s);
    };

    LoggingWrapper.prototype.info = function(s) {
        this.output('INFO',s);
    };

    LoggingWrapper.prototype.warn = function(s) {
        this.output('WARN',s);
    };

    LoggingWrapper.prototype.error = function(s) {
        this.output('ERRO',s);
    };
}


// create "static" instance
var Logger = new LoggingWrapper();