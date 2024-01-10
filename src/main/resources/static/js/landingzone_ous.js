/*Landing Zone*/

$(document).ready(function() {
	// Start : Add Recommended OUs
	// On-Click handler for 'add-recommended-ous' Button - Add Recommended OUs in AWS
	$("button.btn-add-recommended-ous").on("click", { param: "add-recommended-ous" }, btnClickHandler);

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
			var btnModalParam1 = $(this).attr("param1");
			// var btnModalParam2 = $(this).attr("param2");

			$("#cover-spin").show();
			$('#frmManageLandingZone').attr("action", "/auth/landingzone?" + btnModalParam1);
			// $('#selectedPolicyId').val(btnModalParam2);
			$("#frmManageLandingZone")[0].submit();
		} catch (error) {
			$('.btn-proceed').hide();
			$('#mfaExpiryDiv').hide();
			$("#infraPopupModal").find('.modal-message').html(error);
			$("#cover-spin").hide();
			return false;
		}

		$('#mfaCode').val('');
	});
	// End : Add Recommended OUs


	// Start : Rename OU
	// On-Click handler for Rename OU Button
	$("button.btn-rename-ou").click(function(e) {
		$("#servicemessage").text("");

		var btn = $(this);
		var btnVal = btn.attr("value");
		var btnMessage = btn.data("message");

		var modalMessage;
		modalMessage = btnMessage;
		$('#renameMFAExpiryDiv').show();
		$('.btn-renameModal').show();

		var modalPopup = $("#renamePopupModal");
		var btnModal = modalPopup.find('.modal-footer button');
		btnModal.attr('value', btnVal);
		modalPopup.find('.modal-message').text(modalMessage);
		modalPopup.find('.modal-title').text("Rename Organizational Unit");

		$("#cover-spin").hide();
		$("#renamePopupModal").modal("show");
	});

	// On renamePopupModal Show
	$("#renamePopupModal").on('show.bs.modal', function(e) {
		var btnVal = $("button.btn-rename-ou").attr("value");
		if (btnVal && btnVal.length > 0) {
			$('#renameMFACode').val('');
			$('#newOUName').show();

			try {
				var objMFA = getTokenExpiry(activityType);
				// Show MFA and Expiry if available
				if (objMFA && objMFA.showMFAExpiry) {
					$('#renameMFAExpiryDiv').show();
					$('#renameTokenExpiry').text(objMFA.expiryString);
					// Set focus on MFA Textbox
					$('#renameMFACode').trigger('focus');
				}
				else {
					$('#renameMFAExpiryDiv').hide();
					// Set focus on Proceed Button
					$('#renameModal').trigger('focus');
				}
			} catch (error) {
				$('.btn-renameModal').hide();
				$('#renameMFAExpiryDiv').hide();
				$("#renamePopupModal").find('.modal-message').html(error);
			}
		}
		else {
			var modalPopup = $("#renamePopupModal");
			modalPopup.find('.modal-message').text("Organizational Unit not selected");
			//alert('Account not selected');
		}
	});

	// On renamePopupModal Hide
	$("#renamePopupModal").on('hide.bs.modal', function() {
		$('#renameTokenExpiry').text('');
		$('#renameMFAExpiryDiv').hide();
	});

	// On-Click handler for Popup Modal Account Fetch Button
	$("button.btn-renameModal").click(function(e) {
		try {
			// Validate Data
			//$('#newOUName').valid();
			var validator = $("#frmManageLandingZone").validate();
			validator.element("#newOUName");

			var newOUName = $('#newOUName').val();
			if (newOUName && newOUName.length > 0) {
				$("#cover-spin").show();
			}
			else {
				$("#cover-spin").hide();
				return false;
			}
		} catch (error) {
			$('.btn-renameModal').hide();
			$('#newOUName').hide();
			$('#renameMFAExpiryDiv').hide();
			$("#renamePopupModal").find('.modal-message').html(error);
			$("#cover-spin").hide();
			return false;
		}

		$('#renameMFACode').val('');
	});
	// End : Rename OU


	// Start : Delete OU
	// On-Click handler for deleteOU Button
	$("button.btn-delete-ou").click(function(e) {
		$("#servicemessage").text("");

		var btn = $(this);
		var btnVal = btn.attr("value");
		var btnMessage = btn.data("message");

		var modalMessage;
		modalMessage = btnMessage;
		$('#deleteOUMFAExpiryDiv').show();
		$('.btn-deleteOUModal').show();

		var modalPopup = $("#deleteOUPopupModal");
		var btnModal = modalPopup.find('.modal-footer button');
		btnModal.attr('value', btnVal);
		modalPopup.find('.modal-message').text(modalMessage);
		modalPopup.find('.modal-title').text("Delete Organizational Unit");

		$("#cover-spin").hide();
		$("#deleteOUPopupModal").modal("show");
	});

	// On deleteOUPopupModal Show
	$("#deleteOUPopupModal").on('show.bs.modal', function(e) {
		var btnVal = $("button.btn-delete-ou").attr("value");
		if (btnVal && btnVal.length > 0) {
			$('#deleteOUMFACode').val('');

			try {
				var objMFA = getTokenExpiry(activityType);
				// Show MFA and Expiry if available
				if (objMFA && objMFA.showMFAExpiry) {
					$('#deleteOUMFAExpiryDiv').show();
					$('#deleteOUTokenExpiry').text(objMFA.expiryString);
					// Set focus on MFA Textbox
					$('#deleteOUMFACode').trigger('focus');
				}
				else {
					$('#deleteOUMFAExpiryDiv').hide();
					// Set focus on Proceed Button
					$('#deleteOUModal').trigger('focus');
				}
			} catch (error) {
				$('.btn-deleteOUModal').hide();
				$('#deleteOUMFAExpiryDiv').hide();
				$("#deleteOUPopupModal").find('.modal-message').html(error);
			}
		}
		else {
			var modalPopup = $("#deleteOUPopupModal");
			modalPopup.find('.modal-message').text("Account not selected");
			//alert('Account not selected');
		}
	});

	// On deleteOUPopupModal Hide
	$("#deleteOUPopupModal").on('hide.bs.modal', function() {
		$('#deleteOUTokenExpiry').text('');
		$('#deleteOUMFAExpiryDiv').hide();
	});
	// End : Delete OU
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


// Start : Add Recommended OUs
// Common Button Click Handler
function btnClickHandler(e) {
	$("#servicemessage").text("");

	var btn = $(this);
	var btnVal = btn.attr("value");
	var btnMessageVal = btn.data("message");
	//var btnParam2 = btn.data("param2");

	const arrMessage = btnMessageVal.split(" : ");
	var strTitle = arrMessage[0].trim();

	var modalPopup = $("#infraPopupModal");
	var btnModal = modalPopup.find('.modal-footer button');
	btnModal.attr('value', btnVal);

	modalPopup.find('.modal-title').text(strTitle);
	modalPopup.find('.modal-footer button').attr('param1', e.data.param);
	// modalPopup.find('.modal-footer button').attr('param2', btnParam2);

	// Validations for Project Id
	var isValidationPassed = false;
	if (btnVal && btnVal.trim().length > 0) {
		isValidationPassed = onValidationPassed("Add Recommended OUs to Root");
	}
	else {
		return onValidationFailed("Invalid Project Details");
	}

	if (isValidationPassed) {
		$('#mfaExpiryDiv').show();
		$('.btn-proceed').show();

		$("#cover-spin").hide();
		$("#infraPopupModal").modal("show");
	}
};

// Validation Passed Method
function onValidationPassed(strMessage) {
	$("#infraPopupModal").find('.modal-message-infra').text(strMessage);
	return true;
};

// Validation Failed Method
function onValidationFailed(strMessage) {
	$('#mfaExpiryDiv').hide();
	$('.btn-proceed').hide();
	$("#infraPopupModal").find('.modal-message-infra').html(strMessage);

	$("#cover-spin").hide();
	$("#infraPopupModal").modal("show");
	return false;
};
// End : Add Recommended OUs
