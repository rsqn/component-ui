ns("tech.rsqn.ui.dataview");

/** this contains two classes, DataView and DataWindow .. DataWindow is internal **/

tech.rsqn.ui.dataview.DataWindow = function () {
    this.clear();
    this.sequence = 0;
};


tech.rsqn.ui.dataview.DataWindow.prototype.addData = function (data) {
    this.lastSequence = data["sequence_response"];
    this.totalRecords = data["total_records"];
    this.loadedRecords += data["data"].length;
    this.data = this.data.concat(data["data"]);
    Logger.debug("DataWindow addData ls " + this.lastSequence + " loadedRecords " + this.loadedRecords + " ds " + this.data.length);
};

tech.rsqn.ui.dataview.DataWindow.prototype.clear = function () {
    this.lastSequence = 0;
    this.totalRecords = 0;
    this.loadedRecords = 0;
    this.windowPosition = 0;
    this.windowEnd = 0;
    this.data = [];
};


tech.rsqn.ui.dataview.DataWindow.prototype.drawData = function (preCb, postCb) {
    var self = this;

    if (preCb) {
        preCb();
    }

    var rowcb = function (rowData) {
        rowData = flatten(rowData);

        cuiTemplates.getTemplate("dataview/" + self.templateName + "/row-template.html").then(function (rowTpl) {
            for (var i = 0; i < self.headerSource.headers.length; i++) {
                var hdrName = i18n(self.headerSource.headers[i]);
                cuiTemplates.getTemplate("dataview/" + self.templateName + "/cell-template.html").then(function (cellTpl) {
                    self.dataSource.cellRenderer(hdrName, rowData, cellTpl);
                    rowTpl.append(cellTpl);
                });
            }
            self.myElement.find(".dv-body").append(rowTpl);
            if (postCb) {
                postCb();
            }
        });
    };

    // append/remove then drop elements off the dom
    for (var i = self.windowEnd; i < self.data.length; i++) {
        self.windowPosition++;
        self.windowEnd++;
        rowcb(self.data[i]);
    }
};

tech.rsqn.ui.dataview.DataWindow.prototype.criteriaChangeUpdate = function () {
    var self = this;
    var cb = function (data) {
        self.clear();
        self.addData(data);
        self.drawData(
            function () {
                Logger.debug("criteriaChangeUpdate Post Callback");
                self.myElement.find(".dv-body tr").remove();
            },
            function () {
                $('html:not(:animated),body:not(:animated)').animate({scrollTop: '0px'}, 10);
                Logger.debug("criteriaChangeUpdate Post Callback");
            });
    };

    this.dataSource.fetchFn(this.sequence++, 0, self.windowSize, cb, self.buildQuery(), self.buildSort());
};


tech.rsqn.ui.dataview.DataWindow.prototype.update = function () {
    var self = this;
    var cb = function (data) {
        self.addData(data);
        self.drawData(null, null);
    };

    this.dataSource.fetchFn(this.sequence++, self.windowPosition, self.windowSize, cb, self.buildQuery(), self.buildSort());
};

tech.rsqn.ui.dataview.DataWindow.prototype.refresh = function () {
    var self = this;
    var cb = function (data) {
        self.addData(data);
        self.drawData(function () {
            Logger.debug("criteriaChangeUpdate Post Callback");
            self.myElement.find(".dv-body tr").remove();
        }, null);
    };
    self.clear();
    this.dataSource.fetchFn(this.sequence++, self.windowPosition, self.windowSize, cb, self.buildQuery(), self.buildSort());
};


tech.rsqn.ui.dataview.DataWindow.prototype.loadMore = function () {
    var self = this;
    var cb = function (data) {
        self.addData(data);
        self.drawData(
            function () {
            },
            function () {
                $('html:not(:animated),body:not(:animated)').animate({scrollTop: $(document).height()}, 800);
            });
    };
    this.dataSource.fetchFn(this.sequence++, self.loadedRecords, self.windowSize, cb, self.buildQuery(), self.buildSort());
};

tech.rsqn.ui.dataview.DataWindow.prototype.bindListeners = function () {
    var self = this;

    /*** CONTROLS ***/
    self.myContainer.find(".dv-loadmore-button").click(function () {
        Logger.debug("loadmore clicked");
        self.myContainer.trigger("dv-load-more");
    });

    self.myContainer.find(".dv-filter").change(function (e,ignore) {
        Logger.debug("filter: dv-filter changed");
        if(ignore !== undefined && ignore === 'ignore'){
           Logger.debug("filter: dv-filter ignored change");
        }
        else{
             self.criteriaChangeUpdate();
        }
    });

    self.myContainer.find(".dv-query").keyup(function (e) {
        var elm = $(this);
        if (elm.val() == "" || elm.val().length >= 3) {
            self.criteriaChangeUpdate();
        }
    });

    self.myContainer.find(".dv-refresh-button").click(function () {
        self.myContainer.trigger("dv-refresh");
    });


    /*** EVENTS ***/
    self.myContainer.on("dv-load-more", function () {
        Logger.debug("datawindow received dv-load-more");
        self.loadMore();
    });

    self.myContainer.on("dv-update", function () {
        Logger.debug("datawindow received dv-update");
        self.update();
    });

    self.myContainer.on("dv-refresh", function () {
        Logger.debug("datawindow received dv-refresh");
        self.refresh();
    });

    self.myContainer.on("dv-sort", function () {
        Logger.debug("datawindow received dv-sort " + self.buildSort());
        self.criteriaChangeUpdate();
    });
};


/**
 *
 * @param rsClass
 */
tech.rsqn.ui.dataview.DataWindow.prototype.buildSort = function () {
    var sortString = "";
    Logger.debug("sortString " + sortString);

    this.myElement.find(".dv-sort-column").each(function (index, element) {
        var e = $(element);
        var col = e.attr('dv-sort-column').replace(/\|/g,'.');
        var dir = e.attr('dv-sort-dir');

        Logger.debug("dv-sort-column = " + col);
        Logger.debug("dv-sort-dir = " + dir);

        if (dir != "none") {
            sortString += col + "=" + dir;
        }
    });
    return encodingTools.encodeURIComponent(sortString);
};


/**
 *
 * @param rsClass
 */
tech.rsqn.ui.dataview.DataWindow.prototype.buildQuery = function () {
    var self = this;
    var queryObject = {
        query: []
    };

    var dv_query = [];

    this.myContainer.find(".dv-query").each(function (index, element) {
        if($(element).val() !== ''){
            queryObject.query.push({
               cmp: 'LIKE',
               fields: $(element).attr('data-field').split(','),
               values: [$(element).val()]
           });
            dv_query.push($(element).val());
        }
    });

    var filter_fields = {};
    this.myContainer.find(".dv-filter").each(function (index, element) {
        var elm = $(element);
        var value = '';
        if (elm.attr('type') === 'checkbox') {
            if (elm.is(':checked')) {
               value = $(element).attr('data-value');
            }
        } else if (elm.attr('type') === 'radio') {
            if (elm.is(':checked')) {
                value = $(element).attr('data-value');
            }
        } else if (elm.is('select')){
            //select2 dropdown uses value, not data-value
            value = elm.find('option').filter(':selected').attr('value');
            if(value === undefined){
                value = elm.find('option').filter(':selected').attr('data-value');
            }
        } else {
            value = criteria.values.push($(element).attr('data-value'));
        }
        if(value !== undefined && value !== ''){
            if (filter_fields[$(element).attr('data-field')] === undefined){
                filter_fields[$(element).attr('data-field')] = [];
            }
            filter_fields[$(element).attr('data-field')].push(value);
        }
    });

    $.each(filter_fields, function(key, value) {
        queryObject.query.push({
           cmp:'EQ',
           fields:[key],
           values:value
        });
    });

    var queryString = JSON.stringify(queryObject);
    Logger.debug("DataTablesQuery has queryString " + queryString);

    var encoded_json = encodeURIComponent(JSON.stringify({
        'filter':filter_fields,
        'query':dv_query
    }));

    //add path+hash to browser navigation history
    history.replaceState({path:window.location.pathname+"#"+encoded_json}, undefined, "#"+encoded_json)

    return encodingTools.encodeURIComponent(queryString);

};

/**
 *
 * @param
 * @param
 * @constructor
 */
tech.rsqn.ui.dataview.DataView = function (templateName, container) {
    this.myContainer = container;
    this.templateName = templateName;
    this.sequence = 0;
    this.dataWindow = new tech.rsqn.ui.dataview.DataWindow();
    this.dataWindow.windowSize = 50;

    this.tableTopRenderer = function (ttElm) {
    };

    this.prefetchTemplates(templateName);
};

/**
 * ack no sync loading in new jQuery busted my templates
 * @param templateName
 */
tech.rsqn.ui.dataview.DataView.prototype.prefetchTemplates = function (templateName) {
    cuiTemplates.getTemplate("dataview/" + templateName + "/body-template.html");
    cuiTemplates.getTemplate("dataview/" + templateName + "/cell-template.html");
    cuiTemplates.getTemplate("dataview/" + templateName + "/row-template.html");
    cuiTemplates.getTemplate("dataview/" + templateName + "/header-cell-template.html");
};

/**
 *
 */
tech.rsqn.ui.dataview.DataView.prototype.init = function (cb) {
    var self = this;
    cuiTemplates.getTemplate("dataview/" + this.templateName + "/body-template.html").then(function (bodyTpl) {
        self.bodyTpl = bodyTpl;
        self.myContainer.append(self.bodyTpl);
        self.myElement = self.myContainer.find(".dv-wrapper");
        self.dataWindow.myElement = self.myElement;
        self.dataWindow.myContainer = self.myContainer;
        self.dataWindow.templateName = self.templateName;

        //allows caller to load dynamic filter data before calling readUrl
        var finishInit = function(){
            self.readUrl();
            self.dataWindow.bindListeners();
            self.tableTopRenderer(self.myElement.find(".tabletop"));
            self.renderHeader();
            self.refresh();
        }

        if(cb !== undefined){
            cb(finishInit);
        }
        else{
            finishInit();
        }
    });
};


/**
 *
 */
tech.rsqn.ui.dataview.DataView.prototype.refresh = function () {
    this.myElement.find(".dv-row").remove();
//    this.myContainer.trigger("dv-update");
    this.myContainer.trigger("dv-refresh");

};

/**
 *
 */
tech.rsqn.ui.dataview.DataView.prototype.update = function () {
    this.myContainer.trigger("dv-update");
};


/**
 *
 */
tech.rsqn.ui.dataview.DataView.prototype.renderHeader = function () {
    var self = this;
    Logger.debug("rendering headers");
    var headerRow = this.myElement.find(".dv-header");

    var addHeader = function (hdrName) {
        var hdrLabel = self.headerSource.headerLabels[i];
        var hdrAttrs = "";
        if ( self.headerSource.headerAttrs ) {
            hdrAttrs = self.headerSource.headerAttrs[i];
        }

        Logger.debug("rendering header " + i + " - " + hdrName);
        cuiTemplates.getTemplate("dataview/" + self.templateName + "/header-cell-template.html").then(function (cellTpl) {
            cellTpl.attr('dv-sort-column', hdrName);
            cellTpl.attr('dv-sort-dir', 'none');
            cellTpl.addClass('dv-sort-column');

            if ( hdrAttrs == "sort=DSC") {
                cellTpl.addClass("dv-sort-dsc").removeClass("dv-sort-none");
                cellTpl.attr("dv-sort-dir","DSC");
            } else if ( hdrAttrs == "sort=ASC" ) {
                cellTpl.addClass("dv-sort-asc").removeClass("dv-sort-none");
                cellTpl.attr("dv-sort-dir","ASC");
            }

            cellTpl.click(function (e) {
                var me = $(this);
                var myAttr = me.attr("dv-sort-dir");
                me.removeClass("dv-sort-asc").removeClass("dv-sort-dsc");
                self.myElement.find(".dv-sort-column").attr("dv-sort-dir", "none").removeClass("dv-sort-dsc").removeClass("dv-sort-asc").addClass("dv-sort-none");
                if (myAttr == "none") {
                    myAttr = "ASC";
                    me.addClass("dv-sort-asc").removeClass("dv-sort-none");
                } else if (myAttr == "ASC") {
                    myAttr = "DSC";
                    me.addClass("dv-sort-dsc").removeClass("dv-sort-none");
                } else if (myAttr == "DSC") {
                    myAttr = "ASC";
                    me.addClass("dv-sort-asc").removeClass("dv-sort-none");
                }

                me.attr("dv-sort-dir", myAttr);
                self.myContainer.trigger("dv-sort")
            });
            self.headerSource.headerCellRenderer(hdrName, hdrLabel, cellTpl);
            headerRow.find(".dv-header-row").append(cellTpl);
        });
    };

    for (var i = 0; i < self.headerSource.headers.length; i++) {
        var hdrName = self.headerSource.headers[i];
        addHeader(hdrName);
    }
};


/**
 *
 * @param hs
 */
tech.rsqn.ui.dataview.DataView.prototype.withHeaderSource = function (hs) {
    if (!hs.hasOwnProperty("headerCellRenderer")) {
        Logger.debug("Adding Default header cell renderer");
        hs["headerCellRenderer"] = function (name, hdrLabel, cellElm) {
            cellElm.html(i18n(hdrLabel));
        };
    }
    this.headerSource = hs;
    this.dataWindow.headerSource = hs;
};


/**
 *
 * @param ds
 */
tech.rsqn.ui.dataview.DataView.prototype.withDataSource = function (ds) {
    /** actual impl **/
    if (!ds.hasOwnProperty("cellRenderer")) {
        Logger.info("Adding Default Cell Renderer");
        ds["cellRenderer"] = function (name, rowData, cellElm) {
            if (rowData.hasOwnProperty(name)) {
                cellElm.html(rowData[name]);
            } else {
                cellElm.html("0");
            }

        };
    }
    this.dataSource = ds;
    this.dataWindow.dataSource = ds;

};

tech.rsqn.ui.dataview.DataView.prototype.readUrl = function () {
    var self = this;
    var hash = window.location.hash;
    var dv_query = self.myContainer.find(".dv-query");

    if(hash != ''){
        var dv_filter = self.myContainer.find(".dv-filter");
        var urlData = JSON.parse(decodeURIComponent(hash.substr(1)));
        if(urlData != undefined){
            dv_filter.each(function (index, element) {
                var elm = $(element);
                var field = elm.attr('data-field');
                if ((elm.attr('type') === 'checkbox') ||(elm.attr('type') === 'radio')){
                    if(urlData.filter !== undefined && urlData.filter[field] !== undefined &&
                        $.inArray($(element).attr('data-value'),urlData.filter[field]) > -1){
                        elm.prop('checked', true);
                    }
                    else{
                        elm.prop('checked', false);
                    }
                }
                else if (elm.is('select')){
                    if(urlData.filter !== undefined && urlData.filter[field] != undefined){
                        elm.val(urlData.filter[field][0]);
                    }
                    else{
                        elm.val("");
                    }
                    //need to trigger change for select2 dropdown, tell dv-filter listeners to ignore
                    elm.trigger('change','ignore');
                }
            });

            if(urlData.query != undefined){
                dv_query.val(urlData.query[0]);
            }
            else{
                dv_query.val("");
            }
        }
    }

    //causes dataview or url to be updated
    dv_query.trigger("keyup");
};