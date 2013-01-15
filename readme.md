# A form validation library for Backbone Views.

## Usage 

In the 'render' function of your view:

	var validate = new app.validate({
		el: $(this.el),
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