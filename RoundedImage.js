Element.Styles.MozBorderRadiusTopleft = "@px";
Element.Styles.MozBorderRadiusTopright = "@px";
Element.Styles.MozBorderRadiusBottomleft = "@px";
Element.Styles.MozBorderRadiusBottomright = "@px";

//(function() {
function $prefix(str) {
  return function(ostr) {
    return str + ostr;
  };
}

var RoundedImage = new Class({
  Implements: [Options, Events],
  
  defaults: {
    borderRadius: 'none',
  },
  
  initialize: function(element, options) {
    this.setOptions(this.defaults, options);
    this.image = $(element);
    this.element = new Element('canvas');
    this.adoptStyles(this.image);
    this.getBorderStyles(this.element);
    this.element.replaces(this.image);
    if(!this.image.width && !this.image.height) {
      this.image.onload = this.render.bind(this);
    } else {
      this.render();
    }
  },
  
  adoptStyles: function(element) {
    this.element.setProperty("id", element.getProperty("id"));
    this.element.setProperty("class", element.getProperty("class"));
  },
  
  getBorderStyles: function(element) {
    var styles = element.getProperty("class").split(" ").map($prefix(".")).map(RoundedImage.search);
    console.log(styles);
    var allStyles = {};
    for(var i = 0, len = styles.length; i < len; i++) allStyles = $merge(allStyles, styles[i]);
    console.log(allStyles);
    this.border = {};
    this.border['top'] = {};
    this.border['bottom'] = {};
    this.border['top']['left'] = parseInt(allStyles['MozBorderRadiusTopleft'] || allStyles['WebkitBorderTopLeftRadius'] || 0);
    this.border['top']['right'] = parseInt(allStyles['MozBorderRadiusTopright'] || allStyles['WebkitBorderTopRightRadius'] || 0);
    this.border['bottom']['left'] = parseInt(allStyles['MozBorderRadiusBottomleft'] || allStyles['WebkitBorderBottomLeftRadius'] || 0);
    this.border['bottom']['right'] = parseInt(allStyles['MozBorderRadiusBottomright'] || allStyles['WebkitBorderBottomRightRadius'] || 0);
    console.log(this.border);
  },
  
  clip: function(ctxt) {
    console.log(this.size, this.border, RoundedImage.HalfPI);
    ctxt.moveTo(this.border['top']['left'], 0);
    ctxt.beginPath();
    ctxt.lineTo(this.size.width - this.border['top']['right'], 0);
    //ctxt.arcTo(this.size.width - this.border['top']['right'], 0, this.size.width, this.border['top']['right'], RoundedImage.HalfPI);
    ctxt.arc(this.size.width - this.border['top']['right'], this.border['top']['right'], this.border['top']['right'], RoundedImage.HalfPI, 0, false);
    ctxt.lineTo(this.size.width, this.size.height - this.border['bottom']['right']);
    ctxt.arcTo(this.size.width, this.size.height - this.border['bottom']['right'], this.size.width - this.border['bottom']['right'], this.size.height, RoundedImage.HalfPI);
    ctxt.lineTo(this.border['bottom']['left'], this.size.height);
    ctxt.arcTo(this.border['bottom']['left'], this.size.height, 0, this.size.height - this.border['bottom']['left'], RoundedImage.HalfPI);
    ctxt.lineTo(0, this.border['top']['left']);
    ctxt.arcTo(0, this.border['top']['left'], this.border['top']['left'], 0, RoundedImage.HalfPI);
    ctxt.clip();
  },
  
  render: function() {
    console.log("render");
    var ctxt = this.element.getContext("2d");
    this.size = {width: parseInt(this.image.width), height: parseInt(this.image.height)};
    this.element.setProperty("width", this.size.width);
    this.element.setProperty("height", this.size.width);
    this.element.setStyles(this.size);
    this.clip(ctxt);
    ctxt.drawImage(this.image, 0, 0, this.size.width, this.size.height);
  }
});
//})();

RoundedImage.init = function(sel) {
  sel = sel || ".rounded-image";
  $$(sel).each(function(el) {
    console.log(el);
    new RoundedImage(el);
  });
}

RoundedImage.HalfPI = Math.PI / 2;

(function() {
var fx = new Fx.CSS();
RoundedImage.search = fx.search.bind(fx);
})();