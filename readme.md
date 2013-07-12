# A form validation library for Backbone Views.

## Usage

In the `render` function of your view:

```javascript

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

```
