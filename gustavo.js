/*
In the 'render' function of your view:

	var validate = new Gustavo({
		el: this.$el,
		elements: {
			'username': {
			'selector': 'input[name="username"]',
			'type': 'keyup',
			'rules': {
				'min': 4,
				'max': 6
			}
		},
		'password': {
			'selector': 'input[name="password"]',
			'type': 'blur',
				'rules': {
					'notEmpty': true
				}
			}
		}
	});
 */
var Gustavo = function ( options ) {
	options = options || {};
	this.elements = options.elements;
	this.el = options.el;
	this.throttleTime = options.throttleTime || 750;
	this.debounceTime = options.debounceTime || 750;
	this.passedClass = options.passedClass || 'passed';
	this.errorClass = options.errorClass || 'error';
	this.setup();
};

Gustavo.prototype.setup = function () {

	var self = this,
			$el,
			key,
			thisElement;

	if ( this.el && ( this.el.nodeType === 1 || typeof this.el === "string" ) ) {
		self.el = $( self.el );
	}

	for( key in self.elements ) {
		thisElement = self.elements[ key ];

		// Gustavo class helps to be sure we don't stack up events
		if( self.el.find( thisElement.selector ).hasClass( "gustavo" ) ) {
			return;
		}

		self.bindEvent({
			el: self.el,
			delegate: thisElement.selector,
			type: thisElement.type,
			rules: thisElement.rules
		});

	}
};

Gustavo.prototype.bindEvent = function ( options ) {
	var self = this,
			options = options || {},
			debouncedEvents = [ 'keyup', 'keydown', 'keypress' ],
			delay = function () { },
			delayOptions = {},
			delayTime = 0;

	// $.inArray API supported in both jQuery and Zepto
	// Using instead of Array.indexOf since that support
	// only exists in IE9+
	if ( $.inArray( options.type, debouncedEvents ) !== -1 ) {
		delay = _.debounce;
		delayOptions.immediate = true;
		delayTime = self.debounceTime;
	} else {
		delay = _.throttle;
		delayTime = self.throttleTime;
	}

	// Register an event listener on each element to validate against
	// Debouncing for keyboard events
	// Throttling for others
	if ( options.el instanceof jQuery ) {
		options.el
			.find( options.delegate )
				.addClass( "gustavo" )
				.end()
			// .on( options.type, options.delegate, _.throttle( function () {
			.on( options.type, options.delegate, delay( function () {
				self.validate( options.delegate, options.rules );
			}, delayTime, delayOptions ) );
	}

};

Gustavo.prototype.validate = function ( selector, rules ) {

	var self = this,
			cssClasses = [],
			cssClass,
			key,
			validator = {},
			pattern;

	// need some validation against rules here to be sure it's the argument we expect
	validator.min = function ( item, selector ) {
		return ( item.find( selector ).val().length > rules[ key ] ) ? true : false;
	};
	validator.max = function ( item, selector ) {
		return ( item.find( selector ).val().length < rules[ key ] ) ? true : false;
	};

	validator.notEmpty = function ( item, selector ) {
		return ( item.find( selector ).val().length > 0 ) ? true : false;
	};

	validator.email = function ( item, selector ) {
		var pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return ( pattern.test( item.find( selector ).val() ) ) ? true : false;
	}

	validator.numeric = function ( item, selector ) {
		var pattern = /\d+/g;
		return ( pattern.test( item.find( selector ).val() ) ) ? true : false;
	}

	for( key in rules ) {
		// call the appropriate function to determine truthy/falsy
		// need validation that result[ key ] exists
		cssClass = ( validator[ key ]( self.el, selector ) ) ? this.passedClass : this.errorClass;
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
