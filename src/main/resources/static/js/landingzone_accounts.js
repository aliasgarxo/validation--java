/*Landing Zone*/

$(document).ready(function() {
	// Start : Move Account
	// On-Click handler for moveAccount Button
	$("button.btn-move-account").click(function(e) {
		$("#servicemessage").text("");

		var btn = $(this);
		var btnVal = btn.attr("value");
		var btnMessage = btn.data("message");

		var modalMessage;
		modalMessage = "Move Account : " + btnMessage;
		$('#moveAccountMFAExpiryDiv').show();
		$('.btn-moveAccountModal').show();

		var modalPopup = $("#moveAccountPopupModal");
		var btnModal = modalPopup.find('.modal-footer button');
		btnModal.attr('value', btnVal);
		modalPopup.find('.modal-message').text(modalMessage);
		modalPopup.find('.modal-title').text("Move Account to Another OU");

		$("#cover-spin").hide();
		$("#moveAccountPopupModal").modal("show");
	});

	// On moveAccountPopupModal Show
	$("#moveAccountPopupModal").on('show.bs.modal', function(e) {
		var btnVal = $("button.btn-move-account").attr("value");
		if (btnVal && btnVal.length > 0) {
			$('#moveAccountMFACode').val('');
			$('#moveAccountOU').show();

			try {
				var objMFA = getTokenExpiry(activityType);
				// Show MFA and Expiry if available
				if (objMFA && objMFA.showMFAExpiry) {
					$('#moveAccountMFAExpiryDiv').show();
					$('#moveAccountTokenExpiry').text(objMFA.expiryString);
					// Set focus on MFA Textbox
					$('#moveAccountMFACode').trigger('focus');
				}
				else {
					$('#moveAccountMFAExpiryDiv').hide();
					// Set focus on Proceed Button
					$('#moveAccountModal').trigger('focus');
				}
			} catch (error) {
				$('.btn-moveAccountModal').hide();
				$('#moveAccountMFAExpiryDiv').hide();
				$("#moveAccountPopupModal").find('.modal-message').html(error);
			}
		}
		else {
			var modalPopup = $("#moveAccountPopupModal");
			modalPopup.find('.modal-message').text("Account not selected");
			//alert('Account not selected');
		}
	});

	// On moveAccountPopupModal Hide
	$("#moveAccountPopupModal").on('hide.bs.modal', function() {
		$('#moveAccountTokenExpiry').text('');
		$('#moveAccountMFAExpiryDiv').hide();
	});

	// On-Click handler for Popup Modal Account Fetch Button
	$("button.btn-moveAccountModal").click(function(e) {
		try {
			// Validate Data
			//$('#newOU').valid();
			var validator = $("#frmManageLandingZone").validate();
			validator.element("#newOU");


			var strNewOU = $('#newOU option:selected').val();
			if (strNewOU && strNewOU.length > 0) {
				$("#cover-spin").show();
			}
			else {
				$("#cover-spin").hide();
				return false;
			}
		} catch (error) {
			$('.btn-moveAccountModal').hide();
			$('#moveAccountOU').hide();
			$('#moveAccountMFAExpiryDiv').hide();
			$("#moveAccountPopupModal").find('.modal-message').html(error);
			$("#cover-spin").hide();
			return false;
		}

		$('#moveAccountMFACode').val('');
	});
	// End : Move Account

	// Start : Remove Account
	// On-Click handler for removeAccount Button
	$("button.btn-remove-account").click(function(e) {
		$("#servicemessage").text("");

		var btn = $(this);
		var btnVal = btn.attr("value");
		var btnMessage = btn.data("message");

		var modalMessage;
		modalMessage = "Remove Account : " + btnMessage;
		$('#removeAccountMFAExpiryDiv').show();
		$('.btn-removeAccountModal').show();

		var modalPopup = $("#removeAccountPopupModal");
		var btnModal = modalPopup.find('.modal-footer button');
		btnModal.attr('value', btnVal);
		modalPopup.find('.modal-message').text(modalMessage);
		modalPopup.find('.modal-title').text("Remove Account from Organization");

		$("#cover-spin").hide();
		$("#removeAccountPopupModal").modal("show");
	});

	// On removeAccountPopupModal Show
	$("#removeAccountPopupModal").on('show.bs.modal', function(e) {
		var btnVal = $("button.btn-remove-account").attr("value");
		if (btnVal && btnVal.length > 0) {
			$('#removeAccountMFACode').val('');

			try {
				var objMFA = getTokenExpiry(activityType);
				// Show MFA and Expiry if available
				if (objMFA && objMFA.showMFAExpiry) {
					$('#removeAccountMFAExpiryDiv').show();
					$('#removeAccountTokenExpiry').text(objMFA.expiryString);
					// Set focus on MFA Textbox
					$('#removeAccountMFACode').trigger('focus');
				}
				else {
					$('#removeAccountMFAExpiryDiv').hide();
					// Set focus on Proceed Button
					$('#removeAccountModal').trigger('focus');
				}
			} catch (error) {
				$('.btn-removeAccountModal').hide();
				$('#removeAccountMFAExpiryDiv').hide();
				$("#removeAccountPopupModal").find('.modal-message').html(error);
			}
		}
		else {
			var modalPopup = $("#removeAccountPopupModal");
			modalPopup.find('.modal-message').text("Account not selected");
			//alert('Account not selected');
		}
	});

	// On removeAccountPopupModal Hide
	$("#removeAccountPopupModal").on('hide.bs.modal', function() {
		$('#removeAccountTokenExpiry').text('');
		$('#removeAccountMFAExpiryDiv').hide();
	});
	// End : Remove Account
});

// Get MFA Token from Session
function getTokenExpiry(strActivity) {
	var objMFA;
	var errorValue = null;

	// Prepare Form Data
	var formData = {
		infrastructure: $("#projectId").val(),
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