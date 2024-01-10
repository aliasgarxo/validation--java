/*Manage Infra*/

const defaultAppType = 1;
const databaseImportAppType = 2;
const databaseRDSImportAppType = 3;
const databaseExportAppType = 4;
const databaseRDSExportAppType = 5
const customAppType = 6;
const winChocolateyAppType = 7;
const winInstallerAppType = 8;

$(document).ready(function() {
	// Enable Multi Select Dropdown with Checkboxes
	$('#targetHosts').multiselect({
		numberDisplayed: 1,
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

	// Enable Multi Select Dropdown with Radio Button
	$('#bastionHost').multiselect({
		numberDisplayed: 1,
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

	// Enable Multi Select Dropdown with Checkboxes
	$('#customScripts').multiselect({
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

	// On-Change handler for Cloud Provider
	$("#providerId").on('change',
		function() {
			var providerId = $(this).val();
			if (providerId > 0) {
				getProjectsByProvider();
				getAccountsByProvider();
				resetTargetsAndBastionHost();
			}
			else {
				var projectDropdown = $('#targetProject');
				projectDropdown.empty();
				projectDropdown.append($('<option/>', {
					value: "",
					text: "--Select Project--"
				}));

				var accountDropdown = $('#targetAccount');
				accountDropdown.empty();
				accountDropdown.append($('<option/>', {
					value: "",
					text: "--Select Account--"
				}));

				resetTargetsAndBastionHost();
			}
		});

	// On-Change handler for Target OS Type DropDown
	$("#osType").on('change', function() {
		resetTargetsAndBastionHost();
	});

	// On-Change handler for Project DropDown
	$("#targetProject").on('change', function() {
		resetTargetsAndBastionHost();
	});

	// On-Change handler for Account DropDown
	$("#targetAccount").on('change', function() {
		resetTargetsAndBastionHost();
	});

	// On-Change handler for Application Type DropDown
	$("#applicationType").on('change', function() {
		var nAppType = $(this).val();
		var selectedAppType = getAppType(nAppType);
		// Update Captions
		//updateCaptions(nAppType);

		if (selectedAppType == customAppType) {
			$('.trSourceCustom').show();
			$('.trChocolatey').hide();
			$('.trWindows').hide();
			$('.trSourceApp').hide();
			$('.trTargetLocation').hide();
			$('.tdTargetServer').hide();
			$('.trTargetDB').hide();

			// Clear App Source Type Dropdown
			var sourceTypeDropdown = $('#sourceType');
			sourceTypeDropdown.val("0");

			$('#sourceLocation').val("");
			$('#sourceUserName').val("");
			$('#sourcePassword').val("");

			// Clear Chocolatey Package Details
			$('#chocolateyPackages').val("");

			// Clear Target DB Controls
			$('#targetLocation').val("");
			$('#targetServer').val("");
			$('#targetDatabaseName').val("");
			$('#targetDatabasePort').val("");
			$('#targetDatabaseUserName').val("");
			$('#targetDatabasePassword').val("");
		}
		else if (selectedAppType == winChocolateyAppType) {
			$('.trChocolatey').show();
			$('.trWindows').show();
			$('.trSourceCustom').hide();
			$('.trSourceApp').hide();
			$('.trTargetLocation').hide();
			$('.tdTargetServer').hide();
			$('.trTargetDB').hide();

			// Clear App Source Type Dropdown
			var sourceTypeDropdown = $('#sourceType');
			sourceTypeDropdown.val("0");

			// Clear App Source Target Details
			$('#sourceLocation').val("");
			$('#sourceUserName').val("");
			$('#sourcePassword').val("");

			// Clear Target DB Controls
			$('#targetServer').val("");
			$('#targetDatabaseName').val("");
			$('#targetDatabasePort').val("");
			$('#targetDatabaseUserName').val("");
			$('#targetDatabasePassword').val("");
		}
		else if (selectedAppType == winInstallerAppType) {
			$('.trChocolatey').hide();
			$('.trWindows').show();
			$('.trSourceCustom').hide();
			$('.trSourceApp').show();
			$('.trTargetLocation').show();
			$('.tdTargetServer').show();
			$('.trTargetDB').hide();

			// Change Caption to "Product Id"
			$('#tdTargetServer').html('Product Id');

			// Clear App Source Type Dropdown
			// var sourceTypeDropdown = $('#sourceType');
			// sourceTypeDropdown.val("0");

			// Clear Target DB Controls
			// $('#targetServer').val("");
			$('#targetDatabaseName').val("");
			$('#targetDatabasePort').val("");
			$('#targetDatabaseUserName').val("");
			$('#targetDatabasePassword').val("");

			// Clear Chocolatey Package Details
			$('#chocolateyPackages').val("");

			// Clear CustomScripts Dropdown
			var customScriptsDropdown = $('#customScripts');
			customScriptsDropdown.val("");
			customScriptsDropdown.multiselect('rebuild');
		}
		else if (selectedAppType == databaseImportAppType) {
			$('.trSourceCustom').hide();
			$('.trChocolatey').hide();
			$('.trWindows').hide();
			$('.trSourceApp').show();
			$('.trTargetLocation').show();
			$('.tdTargetServer').hide();
			$('.trTargetDB').show();

			// Clear Chocolatey Package Details
			$('#chocolateyPackages').val("");

			// Clear Target Server Control
			$('#targetServer').val("");

			// Clear CustomScripts Dropdown
			var customScriptsDropdown = $('#customScripts');
			customScriptsDropdown.val("");
			customScriptsDropdown.multiselect('rebuild');
		}
		else if (selectedAppType == databaseRDSImportAppType) {
			$('.trSourceCustom').hide();
			$('.trChocolatey').hide();
			$('.trWindows').hide();
			$('.trSourceApp').show();
			$('.trTargetLocation').show();
			$('.tdTargetServer').show();
			$('.trTargetDB').show();

			// Change Caption to "Target Server Endpoint *"
			$('#tdTargetServer').html('Target Server Endpoint *');

			// Clear Chocolatey Package Details
			$('#chocolateyPackages').val("");

			// Clear CustomScripts Dropdown
			var customScriptsDropdown = $('#customScripts');
			customScriptsDropdown.val("");
			customScriptsDropdown.multiselect('rebuild');
		}
		else if (selectedAppType == databaseExportAppType) {
			$('.trSourceCustom').hide();
			$('.trChocolatey').hide();
			$('.trWindows').hide();
			$('.trSourceApp').hide();
			$('.trTargetLocation').show();
			$('.tdTargetServer').hide();
			$('.trTargetDB').show();

			// Clear Target Server Control
			$('#targetServer').val("");

			// Clear App Source Type Dropdown
			var sourceTypeDropdown = $('#sourceType');
			sourceTypeDropdown.val("0");

			// Clear Chocolatey Package Details
			$('#chocolateyPackages').val("");

			// Clear App Source Target Details
			$('#sourceLocation').val("");
			$('#sourceUserName').val("");
			$('#sourcePassword').val("");

			// Clear CustomScripts Dropdown
			var customScriptsDropdown = $('#customScripts');
			customScriptsDropdown.val("");
			customScriptsDropdown.multiselect('rebuild');
		}
		else if (selectedAppType == databaseRDSExportAppType) {
			$('.trSourceCustom').hide();
			$('.trChocolatey').hide();
			$('.trWindows').hide();
			$('.trSourceApp').hide();
			$('.trTargetLocation').show();
			$('.tdTargetServer').show();
			$('.trTargetDB').show();

			// Change Caption to "Target Server Endpoint *"
			$('#tdTargetServer').html('Target Server Endpoint *');

			// Clear App Source Type Dropdown
			var sourceTypeDropdown = $('#sourceType');
			sourceTypeDropdown.val("0");

			// Clear Chocolatey Package Details
			$('#chocolateyPackages').val("");
			$('#sourceLocation').val("");
			$('#sourceUserName').val("");
			$('#sourcePassword').val("");

			// Clear CustomScripts Dropdown
			var customScriptsDropdown = $('#customScripts');
			customScriptsDropdown.val("");
			customScriptsDropdown.multiselect('rebuild');
		}
		else {
			$('.trSourceCustom').hide();
			$('.trChocolatey').hide();
			$('.trWindows').hide();
			$('.trSourceApp').show();
			$('.trTargetLocation').show();
			$('.tdTargetServer').hide();
			$('.trTargetDB').hide();

			// Clear Chocolatey Package Details
			$('#chocolateyPackages').val("");

			// Clear Target Server Control
			$('#targetServer').val("");

			// Clear Target DB Controls
			$('#targetDatabaseName').val("");
			$('#targetDatabasePort').val("");
			$('#targetDatabaseUserName').val("");
			$('#targetDatabasePassword').val("");

			// Clear CustomScripts Dropdown
			var customScriptsDropdown = $('#customScripts');
			customScriptsDropdown.val("");
			customScriptsDropdown.multiselect('rebuild');
		}

	}).change();

	/*
	// On-Change handler for Source Type DropDown
	$("#sourceType").on('change', function() {
		var nSourceType = $(this).val();
		// Hide Source Location and User Details for Local File Source Type

		if (nSourceType == 3) {
			$('.trSourceAppLocation').hide();
			$('.trSourceAppUser').hide();

			$('#sourceLocation').val("");
			$('#sourceUserName').val("");
			$('#sourcePassword').val("");
		}
		else {
			$('.trSourceAppLocation').show();
			$('.trSourceAppUser').show();
		}
	}).change();
	*/

	// On-Click handler for Fetch Targets button
	$("#fetchInstances").click(function() {
		// Validate data
		var providerVal = $('#providerId option:selected').val();
		var strTargetProject = $('#targetProject option:selected').val();
		var strTargetProjectText = $('#targetProject option:selected').text();
		var strTargetAccount = $('#targetAccount option:selected').val();
		var strTargetAccountText = $('#targetAccount option:selected').text();

		var modalMessage;
		var modalMessageAccount;
		var isValidProvider = false;
		var isValidAccount = false;
		var isValidProject = false;

		// Validate Account
		if (strTargetAccount && strTargetAccount.length > 0) {
			isValidAccount = true;
		} else {
			modalMessage = "Please Select Target Account";
			modalMessageAccount = "";
		}

		// Validate Project
		if (strTargetProject && strTargetProject.length > 0) {
			isValidProject = true;
		} else {
			modalMessage = "Please Select Target Project";
			modalMessageAccount = "";
		}

		// Validate Cloud Provider
		if (providerVal > 0) {
			isValidProvider = true;
		} else {
			modalMessage = "Please Select Cloud Provider";
			modalMessageAccount = "";
		}

		// If both Validation Succeeds
		if (isValidProvider && isValidProject && isValidAccount) {
			modalMessage = "Target Project : " + strTargetProjectText;
			modalMessageAccount = "Target Account : " + strTargetAccountText;
			$('.btn-fetchInstancesModal').show();
		} else {
			$('.btn-fetchInstancesModal').hide();
			$('#fetchInstancesTokenExpiry').text('');
			$('#fetchInstancesMFAExpiryDiv').hide();
		}

		var modalPopupInstances = $("#fetchInstancesPopupModal");

		$("#fetchInstancesPopupModal").find('.modal-message-project').html(modalMessage);
		$("#fetchInstancesPopupModal").find('.modal-message-account').html(modalMessageAccount);

		$("#cover-spin").hide();
		modalPopupInstances.modal('show');
	});

	// On fetchInstancesPopupModal Show
	$("#fetchInstancesPopupModal").on('show.bs.modal', function() {
		var objMFA = getTokenExpiryFetchInstances();
		$('#fetchInstancesMFACode').val('');

		// Show MFA and Expiry only if Terraform Activity is Not : Generate/Format/Update
		if (objMFA.showMFAExpiry) {
			$('#fetchInstancesMFAExpiryDiv').show();
			$('#fetchInstancesTokenExpiry').text(objMFA.expiryString);

			// Set focus on MFA Textbox
			$('#fetchInstancesMFACode').trigger('focus');
		}
		else {
			$('#fetchInstancesMFAExpiryDiv').hide();

			// Set focus on Proceed Button
			$('.btn-fetchInstancesModal').trigger('focus');
		}
	});

	// On fetchInstancesPopupModal Hide
	$("#fetchInstancesPopupModal").on('hide.bs.modal', function() {
		$('#fetchInstancesTokenExpiry').text('');
		$('#fetchInstancesMFAExpiryDiv').hide();
	});


	// On-Click handler for Popup Modal Account Fetch Button
	$("button.btn-fetchInstancesModal").click(function(e) {
		var mfaCodeValue = $("#fetchInstancesMFACode").val();
		$("#cover-spin").show();

		try {
			fetchInstances(mfaCodeValue);
		} catch (error) {
			$('.btn-fetchInstancesModal').hide();
			$('#fetchInstancesMFAExpiryDiv').hide();
			$("#fetchInstancesPopupModal").find('.modal-message-project').html(error);

			$("#cover-spin").hide();
			$("#fetchInstancesPopupModal").modal("show");
			$("#cover-spin").hide();
			return false;
		}

		$('#fetchInstancesMFACode').val('');
	});

});

function isValidData() {
	// Validations
	if (!$('#providerId').val()) {
		alert('Please select Cloud Provider');
		return false;
	}

	if (!$('#targetAccount').val()) {
		alert('Please select Account');
		return false;
	}

	return true;
}

// Get Projects By Cloud Provider
function getProjectsByProvider() {
	var providerId = $('#providerId option:selected').val();

	// Prepare Form Data
	var formData = {
		providerId: providerId
	}

	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: "/auth/projectsbyprovider",
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

			var projectsDropdown = $('#targetProject');
			projectsDropdown.empty();

			var optionSelect = option
				+ "<option value=''>"
				+ '--Select--'
				+ "</option>";

			var option = "";

			for (var i = 0; i < data.length; i++) {
				option = option
					+ "<option value='" + data[i].serviceId + "'>"
					+ data[i].serviceName
					+ "</option>";
			}

			projectsDropdown.append(optionSelect + option);
		},
		error: function(e) {
			console.log("ERROR : ", e);
		}
	});
};

// Get Accounts By Cloud Provider
function getAccountsByProvider() {
	var providerId = $('#providerId option:selected').val();

	// Prepare Form Data
	var formData = {
		providerId: providerId
	}

	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: "/auth/accountsbyprovider",
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

			var accountsDropdown = $('#targetAccount');
			accountsDropdown.empty();

			var optionSelect = option
				+ "<option value=''>"
				+ '--Select--'
				+ "</option>";

			var option = "";

			for (var i = 0; i < data.length; i++) {
				option = option
					+ "<option value='" + data[i].serviceId + "'>"
					+ data[i].serviceName
					+ "</option>";
			}

			accountsDropdown.append(optionSelect + option);
		},
		error: function(e) {
			console.log("ERROR : ", e);
		}
	});
};

// Reset Target Hosts and Bastion
function resetTargetsAndBastionHost() {
	var targetHostsDropdown = $('#targetHosts');
	targetHostsDropdown.empty();
	targetHostsDropdown.multiselect('rebuild');

	var bastionHostDropdown = $('#bastionHost');
	bastionHostDropdown.empty();
	bastionHostDropdown.multiselect('rebuild');
};

// Check if App Type is a Normal Default App, or Database or Custom Install Script
function getAppType(nAppType) {
	if (nAppType > 0 && nAppType <= 500) {
		return defaultAppType;
	}
	else if (nAppType > 500 && nAppType <= 600) {
		return databaseImportAppType;
	}
	else if (nAppType > 600 && nAppType <= 700) {
		return databaseRDSImportAppType;
	}
	else if (nAppType > 700 && nAppType <= 800) {
		return databaseExportAppType;
	}
	else if (nAppType > 800 && nAppType <= 900) {
		return databaseRDSExportAppType;
	}
	else if (nAppType == 910 || nAppType == 920) {
		return customAppType;
	}
	else if (nAppType == 930) {
		return winChocolateyAppType;
	}
	else if (nAppType == 940) {
		return winInstallerAppType;
	}
	else {
		return 0;
	}
};

function getTokenExpiryFetchInstances() {
	var objMFA;
	var strActivity = $('#ansible_activity').val();

	// Prepare Form Data
	var formData = {
		infrastructure: $('#targetProject').val(),
		activity: strActivity,
		account: $('#targetAccount option:selected').val()
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

// Fetch Instances for the selected Project and Account
function fetchInstances(mfaCodeValue) {
	resetTargetsAndBastionHost();

	var lstInstances;
	var errorValue = null;

	var strInfrastructure = $("#fetchInstances").val();
	var strTargetProject = $('#targetProject option:selected').val();
	var strTargetAccount = $('#targetAccount option:selected').val();
	var osType = $('#osType option:selected').val();

	// Validate Project
	if (strTargetProject && strTargetProject.length > 0) {
		// Proceed
	} else {
		return;
	}

	// Validate Account
	if (strTargetAccount && strTargetAccount.length > 0) {
		// Proceed
	} else {
		return;
	}

	// Prepare Form Data
	var formData = {
		infrastructure: strInfrastructure,
		activity: $('#ansible_activity').val(),
		project: strTargetProject,
		account: strTargetAccount,
		ostype: osType,
		mfaCode: mfaCodeValue
	}

	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: "/auth/fetchinstances",
		async: true,
		data: JSON.stringify(formData),
		dataType: 'json',
		beforeSend: function(xhr) {
			xhr.setRequestHeader(header, token);
		},
		cache: false,
		timeout: 600000,
		success: function(data) {
			lstInstances = data;
			console.log("SUCCESS : ", data);

			var option = "";

			// Populate targetHosts
			var targetHostsDropdown = $('#targetHosts');
			targetHostsDropdown.empty();

			for (var i = 0; i < data.length; i++) {
				option = option
					+ "<option value='" + data[i].instanceId + "'>"
					+ data[i].instanceName + " (" + data[i].privateIP + " - " + data[i].platform + ")"
					+ "</option>";
			}

			targetHostsDropdown.append(option);
			targetHostsDropdown.multiselect('rebuild');

			// Populate bastionHost
			option = "<option value='0'>None selected</option>";
			var bastionHostDropdown = $('#bastionHost');
			bastionHostDropdown.empty();

			for (var i = 0; i < data.length; i++) {
				var strPublicIP = data[i].publicIP;

				if (strPublicIP && strPublicIP.length > 0) {
					option = option
						+ "<option value='" + data[i].instanceId + "'>"
						+ data[i].instanceName + (strPublicIP ? " (" + strPublicIP + " - " + data[i].platform + ")" : "")
						+ "</option>";
				}
			}

			bastionHostDropdown.append(option);
			bastionHostDropdown.multiselect('rebuild');

			$('#servicemessage').css('color', 'blue');
			$("#servicemessage").text("Successfully fetched Instances for the Selected Project and Account");
			$("#cover-spin").hide();
		},
		error: function(e) {
			console.log("ERROR : ", e);
			errorValue = e.responseText;

			$('#servicemessage').css('color', 'red');
			$("#servicemessage").text(errorValue);
			$("#cover-spin").hide();
			return false;
		}
	});

	if (errorValue != null) {
		throw errorValue;
	}
	else {
		return lstInstances;
	}
};
