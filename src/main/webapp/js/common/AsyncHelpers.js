
ns("tech.rsqn.common");


ns("tech.rsqn.common.sequences");
tech.rsqn.common.sequences.global = 1;

function seq(n) {
    return tech.rsqn.common.sequences.global++;
}

tech.rsqn.common.CountDownLatch = function(n, cb) {
    this.n = n;
    this.v = n;
    this.cb = cb;
    this.id = seq("CountDownLatch");
};


tech.rsqn.common.CountDownLatch.prototype.countDown = function() {
    var self = this;
    self.v--;

    if ( self.v == 0 ) {
        Logger.debug("CountDownLatch " + self.id + " complete");
        self.cb();
    }
    return Logger.debug("CountDownLatch " + self.id + " incomplete " + self.n + " / " + self.v);
};