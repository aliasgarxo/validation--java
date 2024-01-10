$.validator.setDefaults({

	errorElement: 'span',
	errorClass: 'validation-feedback',
	// errorClass: "help-block",

	// Style the HTML element in case of validation errors
	highlight: function(element) {
		$(element).closest('.form-group').find(".form-control:first").addClass('is-invalid');
	},

	// Style the HTML element in case of validation success
	unhighlight: function(element) {
		$(element).closest('.form-group').find(".form-control:first").removeClass('is-invalid');
		$(element).closest('.form-group').find(".form-control:first").addClass('is-valid');

	},

	// Place the error text for different input element types
	errorPlacement: function(error, element) {
		if (element.parent('.input-group').length) {
			error.insertAfter(element.parent());
		}
		else if (element.prop('type') === 'radio' && element.parent('.radio-inline').length) {
			error.insertAfter(element.parent().parent());
		}
		else if (element.prop('type') === 'checkbox' || element.prop('type') === 'radio') {
			error.appendTo(element.parent().parent());
		}
		else if (element.hasClass('selectpicker')) {
			error.appendTo(element.parent().parent().parent());
		}
		else if (element.hasClass('multiselectpicker')) {
			error.appendTo(element.parent().parent().parent());
		}
		else if (element.prop('type') === 'textarea' || element.prop('type') === 'select-one') {
			error.insertAfter(element.parent());
		}
		else {
			error.insertAfter(element);
		}
	}

});
