Element.Styles.MozBorderRadiusTopleft = "@px";
Element.Styles.MozBorderRadiusTopright = "@px";
Element.Styles.MozBorderRadiusBottomleft = "@px";
Element.Styles.MozBorderRadiusBottomright = "@px";

var RoundedImage = new Class({
  Implements: [Options, Events],
  
  defaults: {
    borderRadius: 'none',
  },
  
  initialize: function(element, options) {
    this.setOptions(this.defaults, options);
    this.image = $(element);
    this.element = new Element('canvas');
    this.adoptStyles();
    this.styles = element.getProperty("class").split(" ").map(RoundedImage.search);
    this.element.replaces(this.image);
    if(!this.image.width && !this.image.height) {
      this.image.onload = this.render.bind(this);
    } else {
      this.render();
    }
  },
  
  adoptStyles: function() {
    this.element.setProperty("id", this.image.getProperty("id"));
    this.element.setProperty("class", this.image.getProperty("class"));
  },
  
  render: function() {
    console.log("render");
    var ctxt = this.element.getContext("2d");
    var size = {width: this.image.width, height: this.image.height};
    this.element.setProperty("width", size.width);
    this.element.setProperty("height", size.width);
    this.element.setStyles(size);
    // define the clipping region
    ctxt.drawImage(this.image, 0, 0, size.width, size.height);
  }
});

RoundedImage.init = function(sel) {
  sel = sel || ".rounded-image";
  $$(sel).each(function(el) {
    console.log(el);
    new RoundedImage(el);
  });
}

(function() {
var fx = new Fx.CSS();
RoundedImage.search = fx.search.bind(fx);
})();