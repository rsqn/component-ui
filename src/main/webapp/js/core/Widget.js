ns("tech.rsqn.ui");


tech.rsqn.ui.Widget = function () {
    this.api = new tech.rsqn.api.AbstractApi();
    this.isWidget = true;
    this.model = new tech.rsqn.core.Model();
};

extend(tech.rsqn.ui.Widget, tech.rsqn.core.UIComponent);


tech.rsqn.ui.Widget.prototype.show = function() {
    this.myElement.show();
};

tech.rsqn.ui.Widget.prototype.hide = function() {
    this.myElement.hide();
};

tech.rsqn.ui.Widget.prototype.visible = function() {
//    this.myElement.hide();
};

tech.rsqn.ui.Widget.prototype.invisible = function() {
//    this.myElement.hide();
};

tech.rsqn.ui.Widget.prototype.dispose = function() {
    this.myElement.remove();
};
