app.validate = function validate(options) {
  this.elements = this.elements || options.elements;
  this.el = this.el || options.el;
  this.passedClass = 'passed';
  this.errorClass = 'error';
  this.setup();
};

app.validate.prototype.setup = function () {
  var self = this;
  var x = 0;
  for (x in this.elements) {
    this.el.on(this.elements[x].type, this.elements[x].selector, function () {
      self.rules(self.elements[x].selector, self.elements[x].rules);
    });
  }
};

app.validate.prototype.rules = function (sel, rules) {
  var klassArr = [];
  var x = 0;
  for (x in rules) {
    var result;
    switch (x) {
      case 'min':
        result = (this.el.find(sel).val().length > rules[x]) ? true : false;
        break;
      case 'max':
        result = (this.el.find(sel).val().length < rules[x]) ? true : false;
        break;
      case 'notEmpty':
        result = (this.el.find(sel).val().length > 0) ? true : false;
        break;
      case 'email':
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        result = (re.test(this.el.find(sel).val())) ? true : false;
        break;
      case 'numeric':
        var re = /\d+/g;
        result = (re.test(this.el.find(sel).val())) ? true : false;
        break;
    }
    var klass = (result) ? this.passedClass : this.errorClass;
    klassArr.push(klass);
  }
  this.output(sel, klassArr);
};

app.validate.prototype.output = function (sel, klassArr) {
  $(sel).removeClass(this.passedClass + ' ' + this.errorClass);
  if (klassArr.indexOf(this.errorClass) > -1) {
    $(sel).addClass(this.errorClass);
  } else {
    $(sel).addClass(this.passedClass);
  }
};