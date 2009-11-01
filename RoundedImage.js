Element.Styles.MozBorderRadiusTopleft = "@px";
Element.Styles.MozBorderRadiusTopright = "@px";
Element.Styles.MozBorderRadiusBottomleft = "@px";
Element.Styles.MozBorderRadiusBottomright = "@px";

(function() {
function $prefix(str) {
  return function(ostr) {
    return str + ostr;
  };
}

var HalfPI = Math.PI / 2;
var ThreeFourths = HalfPI + Math.PI;

window.RoundedImage = new Class({
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
    var allStyles = {};
    for(var i = 0, len = styles.length; i < len; i++) allStyles = $merge(allStyles, styles[i]);
    this.border = {};
    this.border['top'] = {};
    this.border['bottom'] = {};
    this.border['top']['left'] = parseInt(allStyles['MozBorderRadiusTopleft'] || allStyles['WebkitBorderTopLeftRadius'] || 0);
    this.border['top']['right'] = parseInt(allStyles['MozBorderRadiusTopright'] || allStyles['WebkitBorderTopRightRadius'] || 0);
    this.border['bottom']['left'] = parseInt(allStyles['MozBorderRadiusBottomleft'] || allStyles['WebkitBorderBottomLeftRadius'] || 0);
    this.border['bottom']['right'] = parseInt(allStyles['MozBorderRadiusBottomright'] || allStyles['WebkitBorderBottomRightRadius'] || 0);
  },
  
  clip: function(ctxt) {
    ctxt.moveTo(this.border['top']['left'], 0);
    ctxt.beginPath();
    ctxt.lineTo(this.size.width - this.border['top']['right'], 0);
    ctxt.arc(this.size.width - this.border['top']['right'], 
             this.border['top']['right'], 
             this.border['top']['right'], 
             HalfPI, 0, false);
    ctxt.lineTo(this.size.width, this.size.height - this.border['bottom']['right']);
    ctxt.arc(this.size.width - this.border['bottom']['right'],
             this.size.height - this.border['bottom']['right'],
             this.border['bottom']['right'], 
             0, -(ThreeFourths), false);
    ctxt.lineTo(this.border['bottom']['left'], this.size.height);
    ctxt.arc(this.border['bottom']['left'],
             this.size.height - this.border['bottom']['left'],
             this.border['bottom']['left'],
             -(ThreeFourths), -Math.PI, false);
    ctxt.lineTo(0, this.border['top']['left']);
    ctxt.arc(this.border['top']['left'], 
             this.border['top']['left'], 
             this.border['top']['left'],
             -Math.PI, -HalfPI, false);
    ctxt.clip();
  },
  
  render: function() {
    var ctxt = this.element.getContext("2d");
    this.size = {width: parseInt(this.image.width), height: parseInt(this.image.height)};
    this.element.setProperty("width", this.size.width);
    this.element.setProperty("height", this.size.height);
    this.element.setStyles(this.size);
    this.clip(ctxt);
    ctxt.drawImage(this.image, 0, 0, this.size.width, this.size.height);
  }
});
})();

RoundedImage.init = function(sel) {
  if(!Browser.Engine.webkit) {
    sel = sel || ".rounded-image";
    $$(sel).each(function(el) {
      new RoundedImage(el);
    });
  }
};

(function() {
var fx = new Fx.CSS();
RoundedImage.search = fx.search.bind(fx);
})();