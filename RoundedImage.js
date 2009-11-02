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

function $postfix(str) {
  return function(ostr) {
    return ostr + str;
  };
}

var HalfPI = Math.PI / 2;
var ThreeFourths = HalfPI + Math.PI;

window.RoundedImage = new Class({
  Implements: [Options, Events],
  
  defaults: {
    borderRadius: 'none',
    selector: 'null'
  },
  
  initialize: function(element, options) {
    this.setOptions(this.defaults, options);
    this.selector = this.options.selector;
    this.image = $(element);
    this.element = new Element('canvas');
    this.adoptStyles(this.image);
    this.getBorderStyles(this.element);
    this.element.replaces(this.image);
    if(!this.image.width && !this.image.height) {
      this.image.onload = this.render.bind(this);
    } else {
      this.render(this.borders);
    }
  },
  
  adoptStyles: function(element) {
    this.element.setProperty("id", element.getProperty("id"));
    this.element.setProperty("class", element.getProperty("class"));
  },
  
  getBorderStyles: function(element) {
    var classes = element.getProperty("class").split(" ").map(String.trim).map($prefix("."));
    var styles = classes.map(RoundedImage.search);
    var allStyles = {};
    for(var i = 0, len = styles.length; i < len; i++) allStyles = $merge(allStyles, styles[i]);
    this.borders = this._getBorderStyles({}, allStyles);
    var hoverStyles = classes.map($postfix(":hover")).map(RoundedImage.search);
    hoverStyles = hoverStyles.filter(function(obj) { return $H(obj).getLength() > 0; });
    var allHoverStyles = {};
    for(var i = 0, len = styles.length; i < len; i++) allHoverStyles = $merge(allHoverStyles, hoverStyles[i]);
    if($H(allHoverStyles).getLength() == 0) return;
    this.element.addEvent('mouseenter', this.onHover.bind(this));
    this.element.addEvent('mouseleave', this.onUnhover.bind(this));
    this.hoverBorders = this._getBorderStyles({}, allHoverStyles);
    this.hoverSize = {width: parseInt(allHoverStyles['width']), height: parseInt(allHoverStyles['height'])};
  },
  
  _getBorderStyles: function(object, styles) {
    object = {};
    object['top'] = {};
    object['bottom'] = {};
    object['top']['left'] = parseInt(styles['MozBorderRadiusTopleft'] || styles['WebkitBorderTopLeftRadius'] || 0);
    object['top']['right'] = parseInt(styles['MozBorderRadiusTopright'] || styles['WebkitBorderTopRightRadius'] || 0);
    object['bottom']['left'] = parseInt(styles['MozBorderRadiusBottomleft'] || styles['WebkitBorderBottomLeftRadius'] || 0);
    object['bottom']['right'] = parseInt(styles['MozBorderRadiusBottomright'] || styles['WebkitBorderBottomRightRadius'] || 0);
    return object;
  },
  
  onHover: function(evt){
    evt = new Event(evt);
    this.render(this.hoverBorders, this.hoverSize);
  },
  
  onUnhover: function(evt) {
    evt = new Event(evt);
    this.render(this.borders, this.size);
  },
  
  clip: function(ctxt, borders, size) {
    ctxt.moveTo(borders['top']['left'], 0);
    ctxt.beginPath();
    ctxt.lineTo(size.width - borders['top']['right'], 0);
    ctxt.arc(size.width - borders['top']['right'], 
             borders['top']['right'], 
             borders['top']['right'], 
             HalfPI, 0, false);
    ctxt.lineTo(size.width, size.height - borders['bottom']['right']);
    ctxt.arc(size.width - borders['bottom']['right'],
             size.height - borders['bottom']['right'],
             borders['bottom']['right'], 
             0, -(ThreeFourths), false);
    ctxt.lineTo(borders['bottom']['left'], size.height);
    ctxt.arc(borders['bottom']['left'],
             size.height - borders['bottom']['left'],
             borders['bottom']['left'],
             -(ThreeFourths), -Math.PI, false);
    ctxt.lineTo(0, borders['top']['left']);
    ctxt.arc(borders['top']['left'], 
             borders['top']['left'], 
             borders['top']['left'],
             -Math.PI, -HalfPI, false);
    ctxt.clip();
  },
  
  render: function(borders, size) {
    var ctxt = this.element.getContext("2d");
    size = size || {width: parseInt(this.image.width), height: parseInt(this.image.height)};
    if(!this.size) this.size = size;
    this.element.setProperty("width", size.width);
    this.element.setProperty("height", size.height);
    this.element.setStyles(size);
    this.clip(ctxt, borders, size);
    ctxt.drawImage(this.image, 0, 0, size.width, size.height);
  }
});
})();

RoundedImage.init = function(selector) {
  if(Browser.Engine.gecko) {
    selector = selector || ".rounded-image";
    $$(selector).each(function(el) {
      new RoundedImage(el, {selector:selector});
    });
  }
};

(function() {
var fx = new Fx.CSS();
RoundedImage.search = fx.search.bind(fx);
})();