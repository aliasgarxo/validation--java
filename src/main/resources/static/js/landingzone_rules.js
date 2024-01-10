/*Landing Zone*/

$(document).ready(function() {
	// Enable Multi Select Dropdown with Checkboxes
	$('#data').multiselect({
		numberDisplayed: 2,
		maxHeight: 300,
		/*buttonWidth: '400px',*/
		enableFiltering: true,
		enableCaseInsensitiveFiltering: true,
		includeSelectAllOption: true,
		selectAllValue: '',
		selectAllJustVisible: true,
		allSelectedText: false,
		buttonClass: 'btn btn-secondary',
		inheritClass: false
	});

	// On-Click handler for 'Add Config Rules' Button - Add Config Rules in AWS
	$("button.btn-add-config-rules").on("click", { param: "add-config-rules" }, btnClickHandler);

	// On-Click handler for 'Fetch' Button - Fetch All AWS Config Rules
	$("button.btn-fetch-config-rules").on("click", { param: "fetch-config-rules" }, btnClickHandler);

	// On-Click handler for 'Remove' Button - Remove Config Rule in AWS
	$("button.btn-remove-config-rule").on("click", { param: "remove-config-rule" }, btnClickHandler);

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
			var btnModalParam2 = $(this).attr("param2");

			$("#cover-spin").show();
			$('#frmAWSConfigRules').attr("action", "/auth/landingzone?" + btnModalParam1);
			$('#selectedConfigRuleId').val(btnModalParam2);
			$("#frmAWSConfigRules")[0].submit();

			/*// Post Form if data is valid
			var validator = $("#frmAWSConfigRules").validate();
			var isValid = validator.form();

			if (isValid) {
				$("#cover-spin").show();
				$('#frmAWSConfigRules').attr("action", "/auth/landingzone/awspolicy?update-policy");
				$("#frmAWSConfigRules")[0].submit();
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
	var validator = $("#frmAWSConfigRules").validate();
	var isValid = validator.form();
	if (!isValid) {
		return;
	}*/

	$("#servicemessage").text("");

	var btn = $(this);
	var btnVal = btn.attr("value");
	var btnMessage = btn.data("message");
	var btnParam2 = btn.data("param2");

	const arrMessage = btnMessage.split(" : ");
	var strTitle = arrMessage[0].trim();

	var modalPopup = $("#infraPopupModal");
	var btnModal = modalPopup.find('.modal-footer button');
	btnModal.attr('value', btnVal);

	modalPopup.find('.modal-title').text(strTitle);
	modalPopup.find('.modal-footer button').attr('param1', e.data.param);
	modalPopup.find('.modal-footer button').attr('param2', btnParam2);

	var nodeAccountsVal = $('#nodeAccounts option:selected').val();
	var regionCodeVal = $('#regionCode option:selected').val();
	var isValidationPassed = false;

	// Common Validations for Selected Node - Accounts or OU
	if (nodeAccountsVal && nodeAccountsVal.trim().length > 0) {
		isValidationPassed = onValidationPassed(btnMessage);
	}
	else {
		return onValidationFailed("Please Select Account");
	}

	// Common Validations for Selected Region Code
	if (regionCodeVal && regionCodeVal.trim().length > 0) {
		isValidationPassed = onValidationPassed(btnMessage);
	}
	else {
		return onValidationFailed("Please Select Region");
	}

	// Validations for Add Config Rules
	var nSelectedCount = $("#data :selected").length;
	if (e.data.param === "add-config-rules" && nSelectedCount === 0) {
		return onValidationFailed("Please Select Config Rules to Add or Update");
	}
	else {
		isValidationPassed = onValidationPassed(btnMessage);
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

