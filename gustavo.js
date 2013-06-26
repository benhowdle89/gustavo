/*
In the 'render' function of your view:

	var validate = new Gustavo({
		el: this.$el,
		elements: {
			'username': {
			'selector': 'input[name="username"]',
			'type': 'change',
			'rules': {
				'min': 4,
				'max': 6
			}
		},
		'password': {
			'selector': 'input[name="password"]',
			'type': 'change',
				'rules': {
					'notEmpty': true
				}
			}
		}
	});
 */
var Gustavo = function ( options ) {
	options = options || {};
	this.elements = this.elements || options.elements;
	this.el = this.el || options.el;
	this.passedClass = options.passedClass || 'passed';
	this.errorClass = options.errorClass || 'error';
	this.setup();
};

Gustavo.prototype.setup = function () {

	var self = this,
			key, thisElement;

	// need some validation against this.el

	for( key in self.elements ) {
		thisElement = self.elements[ key ];
		// Register an event listener on each element to validate against
		this.el.on( thisElement.type, thisElement.selector, function () {
			self.rules( thisElement.selector, thisElement.rules );
		});
	}
};

Gustavo.prototype.rules = function ( selector, rules ) {

	var self = this,
			cssClasses = [],
			cssClass,
			key,
			validate = {},
			pattern;

	// need some validation against rules here to be sure it's the argument we expect
	//
	validate.min = function ( item, selector ) {
		// `this` not right here
		// `item` should now be relative to what `this` was supposed to be
		return ( item.find( selector ).val().length > rules[ key ] ) ? true : false;
	};
	validate.max = function ( item, selector ) {
		// `this` not right here
		return ( item.find( selector ).val().length < rules[ key ] ) ? true : false;
	};

	validate.notEmpty = function ( item, selector ) {
		return ( item.find( selector ).val().length > 0 ) ? true : false;
	};

	validate.email = function ( item, selector ) {
		var pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return ( pattern.test( item.find( selector ).val() ) ? true : false;
	}

	validate.numeric = function ( item, selector ) {
		var pattern = /\d+/g;
		return ( pattern.test( item.find( selector ).val() ) ? true : false;
	}

	for( key in rules ) {
		// call the appropriate function to determine truthy/falsy
		// need validation that result[ key ] exists
		cssClass = ( validate[ key ]( self.el ) ) ? this.passedClass : this.errorClass;
		cssClasses.push( cssClass );
	}

	self.output( selector, cssClasses );

};

Gustavo.prototype.output = function ( selector, cssClasses ) {

	var self = this,
			$el = $( selector );

	$el.removeClass( self.passedClass + " " + self.errorClass );

	if( cssClasses.indexOf( self.errorClass ) > -1 ) {
		$el.addClass( self.errorClass );
	} else {
		$el.addClass( self.passedClass );
	}

};
