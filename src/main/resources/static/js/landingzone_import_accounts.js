/*Landing Zone*/

$(document).ready(function() {
	// Start : Import Accounts
	// On-Click handler for Import Accounts (save_import_accounts) Button
	$("button.btn-create-account").click(function(e) {
		// Post Form if data is valid
		var validator = $("#frmLandingZoneAccount").validate();
		var isValid = validator.form();
		if (!isValid) {
			return;
		}

		$("#servicemessage").text("");

		var btn = $(this);
		var btnVal = btn.attr("value");
		//var btnMessage = btn.data("message");

		var modalMessage;
		modalMessage = "Import Accounts";
		$('#mfaExpiryDiv').show();
		$('.btn-proceed').show();

		var modalPopup = $("#infraPopupModal");
		var btnModal = modalPopup.find('.modal-footer button');
		btnModal.attr('value', btnVal);
		modalPopup.find('.modal-message-infra').text(modalMessage);
		modalPopup.find('.modal-title').text("Import AWS Accounts");

		$("#cover-spin").hide();
		$("#infraPopupModal").modal("show");
	});

	// On infraPopupModal Show
	$("#infraPopupModal").on('show.bs.modal', function(e) {
		var btnVal = $("button.btn-create-account").attr("value");
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
			modalPopup.find('.modal-message').text("Invalid Project Details");
			//alert('Account not selected');
		}
	});

	// On infraPopupModal Hide
	$("#infraPopupModal").on('hide.bs.modal', function() {
		$('#tokenExpiry').text('');
		$('#mfaExpiryDiv').hide();
	});

	// On-Click handler for Popup Modal Account Create Button
	$("button.btn-proceed").click(function(e) {
		try {
			// Post Form if data is valid
			var validator = $("#frmLandingZoneAccount").validate();
			var isValid = validator.form();

			if (isValid) {
				$("#cover-spin").show();
				$('#frmLandingZoneAccount').attr("action", "/auth/landingzone?save_import_accounts");
				$("#frmLandingZoneAccount")[0].submit();
			}
			else {
				// Form validation failed
				$("#cover-spin").hide();
				$("#infraPopupModal").modal("hide");
			}

		} catch (error) {
			$('.btn-proceed').hide();
			$('#mfaExpiryDiv').hide();
			$("#infraPopupModal").find('.modal-message').html(error);
			$("#cover-spin").hide();
			return false;
		}

		$('#mfaCode').val('');
	});
	// End : Create Account
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