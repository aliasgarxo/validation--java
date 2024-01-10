/*Landing Zone*/

$(document).ready(function() {
	// On-Click handler for 'Update Policy in AWS' Button
	$("button.btn-update-policy").on("click", { param: "update-policy" }, btnClickHandler);

	// On-Click handler for 'Delete Policy in AWS' Button
	$("button.btn-delete-policy").on("click", { param: "delete-policy" }, btnClickHandler);

	// On infraPopupModal Show
	$("#infraPopupModal").on('show.bs.modal', function(e) {
		var btnVal = $("button.btn-update-policy").attr("value");
		if (btnVal && btnVal.length > 0) {
			$('#mfaCode').val('');

			try {
				var objMFA = getTokenExpiry(activityType);
				// Show MFA and Expiry if available
				if (objMFA && objMFA.showMFAExpiry) {
					$('#mfaExpiryDiv').show();
					$('#tokenExpiry').text(objMFA.expiryString);
					// Set focus on MFA Textbox
					$('#mfaCode').trigger('focus');
				}
				else {
					$('#mfaExpiryDiv').hide();
					// Set focus on Proceed Button
					$('#infraPopupModal').trigger('focus');
				}
			} catch (error) {
				$('.btn-proceed').hide();
				$('#mfaExpiryDiv').hide();
				$("#infraPopupModal").find('.modal-message').html(error);
			}
		}
		else {
			var modalPopup = $("#infraPopupModal");
			modalPopup.find('.modal-message').text("Invalid Policy Details");
			//alert('Account not selected');
		}
	});

	// On infraPopupModal Hide
	$("#infraPopupModal").on('hide.bs.modal', function() {
		$('#tokenExpiry').text('');
		$('#mfaExpiryDiv').hide();
	});

	// On-Click handler for 'Proceed' Button
	$("button.btn-proceed").click(function(e) {
		try {
			var btnModalParam = $(this).attr("param");

			$("#cover-spin").show();
			$('#frmAWSPolicy').attr("action", "/auth/landingzone/awspolicy?" + btnModalParam);
			$("#frmAWSPolicy")[0].submit();

			/*// Post Form if data is valid
			var validator = $("#frmAWSPolicy").validate();
			var isValid = validator.form();

			if (isValid) {
				$("#cover-spin").show();
				$('#frmAWSPolicy').attr("action", "/auth/landingzone/awspolicy?update-policy");
				$("#frmAWSPolicy")[0].submit();
			}
			else {
				// Form validation failed
				$("#cover-spin").hide();
				$("#infraPopupModal").modal("hide");
			}*/
		} catch (error) {
			$('.btn-proceed').hide();
			$('#mfaExpiryDiv').hide();
			$("#infraPopupModal").find('.modal-message').html(error);
			$("#cover-spin").hide();
			return false;
		}

		$('#mfaCode').val('');
	});
});

// Get MFA Token from Session
function getTokenExpiry(strActivity) {
	var objMFA;
	var errorValue = null;

	// Prepare Form Data
	var formData = {
		infrastructure: $("button.btn-proceed").attr("value"),
		activity: strActivity
	}

	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: "/auth/lz/tokenexpiry",
		async: false,
		data: JSON.stringify(formData),
		dataType: 'json',
		beforeSend: function(xhr) {
			xhr.setRequestHeader(header, token);
		},
		cache: false,
		timeout: 600000,
		success: function(data) {
			console.log("SUCCESS : ", data);
			objMFA = data;
		},
		error: function(e) {
			console.log("ERROR : ", e);
			errorValue = e.responseText;
			return false;
		}
	});

	if (errorValue != null) {
		throw errorValue;
	}
	else {
		return objMFA;
	}
};

// Common Button Click Handler
function btnClickHandler(e) {
	//alert(e.data.param);

	/*// Post Form if data is valid
	var validator = $("#frmAWSPolicy").validate();
	var isValid = validator.form();
	if (!isValid) {
		return;
	}*/

	$("#servicemessage").text("");

	var btn = $(this);
	var btnVal = btn.attr("value");
	var btnMessage = btn.data("message");

	const arrMessage = btnMessage.split(" : ");
	var strTitle = arrMessage[0].trim();

	$('#mfaExpiryDiv').show();
	$('.btn-proceed').show();

	var modalPopup = $("#infraPopupModal");
	var btnModal = modalPopup.find('.modal-footer button');
	btnModal.attr('value', btnVal);

	modalPopup.find('.modal-title').text(strTitle);
	modalPopup.find('.modal-message-infra').text(btnMessage);
	modalPopup.find('.modal-footer button').attr('param', e.data.param);

	$("#cover-spin").hide();
	$("#infraPopupModal").modal("show");
};
