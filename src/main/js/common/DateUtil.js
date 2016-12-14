ns("tech.rsqn.util");


tech.rsqn.util.DateUtil = function () {
};

tech.rsqn.util.DateUtil.prototype.format = function (date,timeZone) {
    var format = 'YYYY-MM-DD HH:mm:ss';

    if(timeZone === undefined){
       timeZone = jstz.determine().name();
    }

    if(timeZone)
        return moment(date).tz(timeZone).format(format) + ' ' + timeZone;
    else
        return moment(date).format(format);
};

tech.rsqn.util.DateUtil.prototype.fromGsonDate = function (strDate) {
    return new Date(strDate);
};

tech.rsqn.util.DateUtil.prototype.formatString = function (strDate,timeZone){
     var date = new Date(strDate);
     if(isNaN(date))
        return null;
     return this.format(date,timeZone);
}


tech.rsqn.util.DateUtil.prototype.formatShortString = function (strDate,timeZone) {
    var date = new Date(strDate);
     if(isNaN(date))
        return null;

    if(timeZone === undefined){
       timeZone = jstz.determine().name();
    }

    if(timeZone)
        return moment(date).tz(timeZone).format('YYYY-MM-DD HH:mm z');
    else
        return moment(date).format('YYYY-MM-DD HH:mm');
};

var dateUtil = new tech.rsqn.util.DateUtil();