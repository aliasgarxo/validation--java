$(document).ready(
		function() {
			// alert('ready');

			$('.anotherhover tr').filter(':has(:checkbox:checked)').addClass(
					'selected').end();

			$('.anotherhover tr').click(function(event) {
				// alert('anotherhover');
				if (event.target.type !== 'checkbox') {

					$(this).toggleClass('selected');

					// $(':checkbox', this).trigger('click');
					// update prop instead
					// $(':checkbox', this).prop('checked', true);
					// and if you want to toggle 'checked'
					$(':checkbox', this).prop('checked', function(_, checked) {
						return !checked;
					});
				}
			});

			$(document).on('click', 'input[type="checkbox"]', function(e) {
				// e.stopPropagation();
				$(this).parent().parent().toggleClass('selected');
				// $(this).toggleClass('selected');
			});

		});
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
