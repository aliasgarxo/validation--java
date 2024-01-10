/*Manage Infra*/

$(document).ready(function() {

	// On-Change handler for Cloud Provider
	$("#providerId").on('change',
		function() {
			var providerId = $(this).val();
			if (providerId > 0) {
				// Submit : Do Form Post
				$(this).closest('form').submit();
			}
			else {
				var projectDropdown = $('#projectId');
				projectDropdown.empty();
				projectDropdown.append($('<option/>', {
					value: "",
					text: "--All Projects--"
				}));

				var accountDropdown = $('#accountId');
				accountDropdown.empty();
				accountDropdown.append($('<option/>', {
					value: "",
					text: "--Select Account--"
				}));

				var regionDropdown = $('#regionCode');
				regionDropdown.val("");
			}
		});

	// On-Change handler for Account DropDown
	$("#accountId").on('change',
		function() {
			var accountVal = $(this).val();
			var projectVal = $('#projectId option:selected').val();

			if (projectVal && projectVal.length > 0) {
				// If project is already selected, then do not change region code
			}
			else {
				if (accountVal && accountVal.length > 0) {
					getRegionByAccount();
				}
				else {
					var regionDropdown = $('#regionCode');
					regionDropdown.val("");
				}
			}
		});

	// On-Change handler for Project DropDown
	$("#projectId").on('change',
		function() {
			var projectVal = $(this).val();
			if (projectVal && projectVal.length > 0) {
				getRegionByProject(projectVal);
			}
			else {
				getRegionByAccount();
			}
		});

	// On-Click handler for Infrastructure button
	$("#fetchDetails").click(function() {
		// Validate data
		var providerVal = $('#providerId option:selected').val();
		var accountVal = $('#accountId option:selected').val();
		var modalPopupInfra = $("#infraPopupModal");
		var modalInfraMessage = modalPopupInfra.find('.modal-message-infra');

		if (providerVal > 0) {
			if (accountVal && accountVal.length > 0) {
				$('#infra').show();
				modalInfraMessage.text('Fetch Details?');
			} else {
				$('#infra').hide();
				modalInfraMessage.text('Please select Account');
			}
		} else {
			$('#infra').hide();
			modalInfraMessage.text('Please select Cloud Provider');
		}

		$("#cover-spin").hide();
		modalPopupInfra.modal('show');
	});

	// On infraPopupModal Show
	$("#infraPopupModal").on('show.bs.modal', function() {
		var objMFA = getTokenExpiry();
		$('#mfaCode').val('');

		// Show MFA and Expiry only if Terraform Activity is Not : Generate/Format/Update
		if (objMFA.showMFAExpiry) {
			$('#mfaExpiryDiv').show();
			$('#tokenExpiry').text(objMFA.expiryString);

			// Set focus on MFA Textbox
			$('#mfaCode').trigger('focus');
		}
		else {
			$('#mfaExpiryDiv').hide();

			// Set focus on Proceed Button
			$('#infra').trigger('focus');
		}
	});

	// On infraPopupModal Hide
	$("#infraPopupModal").on('hide.bs.modal', function() {
		$('#tokenExpiry').text('');
		$('#mfaExpiryDiv').hide();
	});

});

//Hide Modal Popup and Proceed with Infra activity
function proceed() {
	// Clear Message Bar
	$('#servicemessage').css('color', 'blue');
	$('#servicemessage').text("Performing Infrastructure Activity ...");

	var modalPopup = $("#infraPopupModal");

	// Validate data
	if (isValidData()) {
		$("#infraPopupModal").modal("hide");
		// Post Form if data is valid
		$("#cover-spin").show();

		// Since fetchDetails Button is Clicked, clear formDataBeanFilter
		$('#formDataBeanFilter').val('');
		$('#frmManageInfra')[0].submit();
	}
	else {
		modalPopup.find('.modal-message-infra').text('Invalid Data. Cannot Proceed');
		$('.btn-proceed').hide();
		modalPopup.modal("show");
	}
}

function isValidData() {
	// Validations
	if (!$('#providerId').val()) {
		alert('Please select Cloud Provider');
		return false;
	}

	if (!$('#accountId').val()) {
		alert('Please select Account');
		return false;
	}

	return true;
}

function getTokenExpiry() {
	var objMFA;

	// Prepare Form Data
	var formData = {
		infrastructure: $('#projectId').val(),
		activity: $('#activity').val(),
		account: $('#accountId option:selected').val(),
		region: $('#regionCode option:selected').val()
	}

	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: "/auth/tokenexpiry",
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
		}
	});

	return objMFA;
}

// Get Default Region By Account
function getRegionByAccount() {
	var accountVal = $('#accountId option:selected').val();

	// Prepare Form Data
	var formData = {
		accountId: accountVal
	}

	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: "/auth/regionbyaccount",
		async: false,
		data: JSON.stringify(formData),
		beforeSend: function(xhr) {
			xhr.setRequestHeader(
				header, token);
		},
		cache: false,
		timeout: 600000,
		success: function(data) {
			console.log("SUCCESS : ", data);

			var regionDropdown = $('#regionCode');
			regionDropdown.val(data);
		},
		error: function(e) {
			console.log("ERROR : ", e);
		}
	});
};


// Get Default Region By Account
function getRegionByProject() {
	var projectVal = $('#projectId option:selected').val();

	// Prepare Form Data
	var formData = {
		projectId: projectVal
	}

	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: "/auth/regionbyproject",
		async: false,
		data: JSON.stringify(formData),
		beforeSend: function(xhr) {
			xhr.setRequestHeader(
				header, token);
		},
		cache: false,
		timeout: 600000,
		success: function(data) {
			console.log("SUCCESS : ", data);

			var regionDropdown = $('#regionCode');
			regionDropdown.val(data);
		},
		error: function(e) {
			console.log("ERROR : ", e);
		}
	});
};