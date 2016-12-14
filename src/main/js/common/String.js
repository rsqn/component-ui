String.prototype.startsWith = function (str) {
    return (this.match("^" + str) == str)
};

String.prototype.endsWith = function (s) {
    return this.length >= s.length && this.substr(this.length - s.length) == s;
}

String.prototype.containsIgnoreCase = function (it) {
    it = it.toLowerCase();
    return this.toLowerCase().indexOf(it) != -1;
};

String.prototype.contains = function (it) {
    return this.indexOf(it) != -1;
};


function StringBuffer() {
    this.buffer = [];
}

StringBuffer.prototype.append = function append(string) {
    this.buffer.push(string);
    return this;
};

StringBuffer.prototype.toString = function toString() {
    return this.buffer.join("");
};

if (!String.prototype.format2) {
    String.prototype.format2 = function() {
        var args = arguments[0];
        if ( ! args ) {
            return this;
        }
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        if ( ! args ) {
            return this;
        }
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}