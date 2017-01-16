
ns("tech.rsqn.core");

tech.rsqn.core.Model = function () {
    this.modelData = {};
    this.changed = {};
    this.listeners = {};
    this.bindings = {};
};

var __lseq = 1000;

tech.rsqn.core.Model.prototype.dispose = function () {
    for (var _n in this.bindings) {

    }
};

tech.rsqn.core.Model.prototype.watch = function (n, cb) {
    if (!this.listeners[n]) {
        this.listeners[n] = [];
    }
    var id = __lseq++;
    var subscription = {
        subscriptionId: id,
        callback: function (data, src) {
            if (src && src.subscriptionId == id) {
                Logger.debug("Subscription " + id + " ignoring notify of " + n);
            } else {
                cb(data);
            }
        }
    };
    this.listeners[n][this.listeners[n].length] = subscription;

    Logger.debug("added listener " + subscription.subscriptionId + "  on field " + n + " for listeners now " + this.listeners[n].length);
    return subscription;
};


tech.rsqn.core.Model.prototype.get = function (k) {
    var self = this;
    var parts = k.split('.'), currentPart = '';
    var curVal = self.modelData;

    for (var i = 0, length = parts.length; i < length; i++) {
        currentPart = parts[i];
        if (curVal[currentPart]) {
            //curVal = self.modelData[currentPart] || {};
            curVal = curVal[currentPart];
        } else {
            return null;
        }
    }
    return curVal;
};

tech.rsqn.core.Model.prototype.bind = function (parentElm, bindings) {
    this.parentElm = parentElm;
    this.bindings = bindings;
    this._bind(bindings);
};

tech.rsqn.core.Model.prototype._bind = function (bindings) {
    var self = this;

    for (var _n in bindings) {
        var nothing = function () {
            //var np = _n.split(".");
            var n = _n;
            var selector = bindings[n];
            Logger.info("Biding Model Element (" + n + ") to selector (" + bindings[n] + ")");
            self.parentElm.find(selector).change(function (evt) {
                var e = $(this);
                self.modelData[n] = e.val();
                self.changed[n] = e.val();
                //Logger.info("selector " + n + " has changed : (" + self.modelData[n] + ")");
                self.__notify(n, e.val());
                if(e.is(':checkbox')){
                      if(e.is(':checked')){
                          self.modelData[n] = true;
                      }
                      else self.modelData[n] = false;
                }
            });
            self.parentElm.find(selector).keyup(function (evt) {
                var e = $(this);
                self.modelData[n] = e.val();
                self.changed[n] = e.val();
                //Logger.info("selector " + n + " has keyup : (" + self.modelData[n] + ")");
                if(e.is(':checkbox')){
                      if(e.is(':checked')){
                          self.modelData[n] = true;
                      }
                      else self.modelData[n] = false;
                }
            });
            self.parentElm.find(selector).each(function (i, _e) {
                var e = $(_e);
                if (e.is(':input')) {
                    if(e.is(':checkbox')){
                        if(e.is(':checked')){
                            self.modelData[n] = true;
                        } else {
                            self.modelData[n] = false;
                        }
                    } else {
                        self.modelData[n] = e.val();
                    }
                }
            });
        }();
    }
};


tech.rsqn.core.Model.prototype.getBinding = function (n) {
    var self = this;
    var selector = self.bindings[n];
    return self.parentElm.find(selector);
};

tech.rsqn.core.Model.prototype.__notify = function (k, v, src) {
    //this.modelData[k] = v;
    if (( !k ) || k == '') {
        return;
    }
    if (this.listeners[k]) {
        Logger.info("Notifying Listeners for " + k);
        for (var i = 0; i < this.listeners[k].length; i++) {
            Logger.debug("Notifying listener[" + this.listeners[k][i].subscriptionId + "] for field " + k + " with " + JSON.stringify(v));
            this.listeners[k][i].callback(v, src);
        }
    } else {
        //Logger.debug("No Listeners for " + k);
    }
};

tech.rsqn.core.Model.prototype.notify = function (k,src) {
    var self = this;
    var v = self.get(k);
    self.__notify(k,v,src);
};

tech.rsqn.core.Model.prototype.makeKey = function (pts, len) {
    var ret = "";
    for (var i = 0; i < len; i++) {
        ret += pts[i];
        if (i != len - 1) {
            ret += ".";
        }
    }
    return ret;
};

/**
 * I don't need the functionality enough right now to be worth building this out
 * only used on the enter customer details form right now, and that model is just a view - only model
 */

tech.rsqn.core.Model.prototype.tmpNotifyAllBindings = function () {
    var self = this;

    for (var _n in self.bindings) {
        var n = _n;
        var v = self.get(n);
        var selector = self.bindings[n];

        Logger.debug("tmpNotifyAllBindings: [" + n + "]=" + v);
        var elm = self.parentElm.find(selector);

        if (elm.hasClass("select2")) {
            elm.val(v).trigger("change");
        } else {
            elm.val(v);
        }
        //self.set(n,v);
    }
};

tech.rsqn.core.Model.prototype.clear = function (v) {
    var self = this;

    for (var _n in self.bindings) {
        var n = _n;
        self.set(n, v);
    }
};


tech.rsqn.core.Model.prototype.set = function (keyOrModel, v, src) {
    var self = this;

    if ($.type(keyOrModel) === "string") {
        var pts = keyOrModel.split(".");
        for (var i = pts.length; i >= 0; i--) {
            var key = self.makeKey(pts, i);
            this.modelData[key] = v;
            var selector = self.bindings[key]; //todo - need multiple bindings
            if (selector) {
                var e = self.parentElm.find(selector);
                if (e.is(':input')) {
                    if(e.is(':checkbox')){
                        if(v!==false){
                            e.prop('checked', true);
                        }
                    }
                    else e.val(v);
                }
                else {
                    e.text(v);
                }
            }
            self.changed[key] = v;
            self.__notify(key, v, src);
        }
    } else {
        this.modelData = keyOrModel;
        this.changed = {};
        for (var n in keyOrModel) {
            var val = keyOrModel[n];
            self.set(n,keyOrModel[n]);
        }
    }

};

tech.rsqn.core.Model.prototype.clearChanged = function () {
    this.changed = {};
};

tech.rsqn.core.Model.prototype.getChanged = function () {
    return this.changed;
};

tech.rsqn.core.Model.prototype.getData = function (filter) {
    Logger.debug("model.getData == " + JSON.stringify(this.modelData));
    var ret = {};
    if (filter) {
        for (var i = 0; i < filter.length; i++) {
            if (this.modelData[filter[i]]) {
                ret[filter[i]] = this.modelData[filter[i]];
            }
        }
    } else {
        for (var n in this.modelData) {
            ret[n] = this.modelData[n];
        }
    }
    return ret;
};
