/*Landing Zone*/

var isInfraInProgress = false;
var stompClient = null;

$(document).ready(function() {
	// Disconnect Websocket if already connected
	// disconnect();
	if (stompClient != null) {
		stompClient.disconnect();
		console.log("Disconnected");
	}

	// On-Click handler for toggle_tfTextArea button
	$("#toggle_tfTextArea").click(function() {
		var tfTextArea = $("#tfresponse");
		var countRows = tfTextArea.attr('rows');

		// Maximize
		if (countRows < 6) {
			minimizeTFTextArea();
		}
		else if (countRows >= 6 && countRows < 18) {
			maximizeTFTextArea();
		}
		// Minimize Textarea
		else if (countRows >= 18) {
			minimizeTFTextArea();
		}
		else {
			minimizeTFTextArea();
		}
	});

	//window.onerror = OnError;

	// Enable Multi Select Dropdown with Checkboxes
	$('#lstGovernedRegions').multiselect({
		numberDisplayed: 3,
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

	$('#lstOrgConfigRules').multiselect({
		numberDisplayed: 3,
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

	$('#lstOrgConfigExcludedAccounts').multiselect({
		numberDisplayed: 3,
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

	// On-Change handler for Master Account DropDown
	$("#masterAccount").on('change', function() {
		var strMasterAccount = $(this).val();

		// Set Default Master Account Region
		if (strMasterAccount && strMasterAccount.length > 0) {
			getRegionByAccount();
		}
		else {
			var regionDropdown = $('#defaultRegion');
			regionDropdown.val("");
		}

		// Clear Audit and Log Archive Accounts on Master Account Change
		var lstAuditAccount = $('#auditAccount');
		var lstLogArchiveAccount = $('#loggingAccount');
		var lstOrgConfigExcludedAccounts = $('#lstOrgConfigExcludedAccounts');

		lstAuditAccount.empty();
		lstLogArchiveAccount.empty();

		lstOrgConfigExcludedAccounts.empty();
		lstOrgConfigExcludedAccounts.multiselect('rebuild');

		var option = option
			+ "<option value=''>"
			+ '--Select--'
			+ "</option>";

		lstAuditAccount.append(option);
		lstLogArchiveAccount.append(option);
	});

	// Trigger Change event to populate Region details
	//$("#masterAccount").trigger("change");

	// On-Click handler for Landing Zone Screen Account Fetch Button
	$("#fetchAccounts").click(function() {
		$("#servicemessage").text("");

		// Validate data
		var strMasterAccount = $('#masterAccount option:selected').val();
		var strMasterAccountText = $('#masterAccount option:selected').text();

		var modalMessage;
		if (strMasterAccount && strMasterAccount.length > 0) {
			modalMessage = "Master Account : " + strMasterAccountText;
			$('.btn-fetchAccountsModal').show();
		}
		else {
			modalMessage = "Please Select Master Account";
			$('.btn-fetchAccountsModal').hide();
			$('#fetchAccountsTokenExpiry').text('');
			$('#fetchAccountsMFAExpiryDiv').hide();
		}

		var modalPopup = $("#fetchAccountsPopupModal");
		var btnModal = modalPopup.find('.modal-footer button');
		btnModal.attr('value', strMasterAccount);
		modalPopup.find('.modal-message').text(modalMessage);

		$("#cover-spin").hide();
		$("#fetchAccountsPopupModal").modal("show");
	});

	// On fetchAccountsPopupModal Show
	$("#fetchAccountsPopupModal").on('show.bs.modal', function(e) {
		var strMasterAccount = $('#masterAccount option:selected').val();
		if (strMasterAccount && strMasterAccount.length > 0) {
			$('#fetchAccountsMFACode').val('');

			try {
				var objMFA = getTokenExpiryMasterAccount(activityType);
				// Show MFA and Expiry if available
				if (objMFA && objMFA.showMFAExpiry) {
					$('#fetchAccountsMFAExpiryDiv').show();
					$('#fetchAccountsTokenExpiry').text(objMFA.expiryString);
					// Set focus on MFA Textbox
					$('#fetchAccountsMFACode').trigger('focus');
				}
				else {
					$('#fetchAccountsMFAExpiryDiv').hide();
					// Set focus on Proceed Button
					$('#fetchAccountsModal').trigger('focus');
				}
			} catch (error) {
				$('.btn-fetchAccountsModal').hide();
				$('#fetchAccountsMFAExpiryDiv').hide();
				$("#fetchAccountsPopupModal").find('.modal-message').html(error);
			}
		}
		else {
			//alert('Account not selected');
		}
	});

	// On fetchAccountsPopupModal Hide
	$("#fetchAccountsPopupModal").on('hide.bs.modal', function() {
		$('#fetchAccountsTokenExpiry').text('');
		$('#fetchAccountsMFAExpiryDiv').hide();
	});

	// On-Click handler for Popup Modal Account Fetch Button
	$("button.btn-fetchAccountsModal").click(function(e) {
		var mfaCodeValue = $("#fetchAccountsMFACode").val();
		$("#cover-spin").show();

		try {
			fetchControlTowerAccounts(mfaCodeValue);
		} catch (error) {
			$('.btn-fetchAccountsModal').hide();
			$('#fetchAccountsMFAExpiryDiv').hide();
			$("#fetchAccountsPopupModal").find('.modal-message').html(error);

			$("#cover-spin").hide();
			$("#fetchAccountsPopupModal").modal("show");
			$("#cover-spin").hide();
			return false;
		}

		$('#fetchAccountsMFACode').val('');
	});

	// Start : Save Project
	// On-Click handler for Save Button
	$("button.btn-save-project").click(function(e) {
		$("#servicemessage").text("");

		var btn = $(this);
		var btnVal = btn.attr("value");

		// Validate data
		var strMasterAccount = $('#masterAccount option:selected').val();

		var modalMessage;
		if (strMasterAccount && strMasterAccount.length > 0) {
			modalMessage = "Save Project";
			$('#saveProjectMFAExpiryDiv').show();
			$('.btn-saveProjectModal').show();
		}
		else {
			modalMessage = "Please Select Master Account";
			$("#saveProjectModal").hide();
			$('#saveProjectTokenExpiry').text('');
			$('#saveProjectMFAExpiryDiv').hide();
		}

		var modalPopup = $("#saveProjectPopupModal");
		var btnModal = modalPopup.find('.modal-footer button');
		btnModal.attr('value', btnVal);
		modalPopup.find('.modal-message').text(modalMessage);
		modalPopup.find('.modal-title').text("Save Landing Zone Project");

		$("#cover-spin").hide();
		$("#saveProjectPopupModal").modal("show");
	});

	// On saveProjectPopupModal Show
	$("#saveProjectPopupModal").on('show.bs.modal', function(e) {
		var btnVal = $("button.btn-saveProjectModal").attr("value");
		if (btnVal && btnVal.length > 0) {
			$('#saveProjectMFACode').val('');
			$('#save').show();

			try {
				var objMFA = getTokenExpirySaveProject(activityType);
				// Show MFA and Expiry if available
				if (objMFA && objMFA.showMFAExpiry) {
					$('#saveProjectMFAExpiryDiv').show();
					$('#saveProjectTokenExpiry').text(objMFA.expiryString);
					// Set focus on MFA Textbox
					$('#saveProjectMFACode').trigger('focus');
				}
				else {
					$('#saveProjectMFAExpiryDiv').hide();
					// Set focus on Proceed Button
					$('#saveProjectModal').trigger('focus');
				}
			} catch (error) {
				$('.btn-saveProjectModal').hide();
				$('#saveProjectMFAExpiryDiv').hide();
				$("#saveProjectPopupModal").find('.modal-message').html(error);
			}
		}
		else {
			var modalPopup = $("#saveProjectPopupModal");
			modalPopup.find('.modal-message').text("Invalid Project Details");
			//alert('Account not selected');
		}
	});

	// On saveProjectPopupModal Hide
	$("#saveProjectPopupModal").on('hide.bs.modal', function() {
		$('#saveProjectTokenExpiry').text('');
		$('#saveProjectMFAExpiryDiv').hide();
	});

	// On-Click handler for Popup Modal Save Button
	$("button.btn-saveProjectModal").click(function(e) {
		// Post Form if data is valid
		var validator = $("#frmProject").validate();
		var isValid = validator.form();

		if (isValid) {
			var btn = $(this);
			var btnVal = btn.attr("value");

			$("#cover-spin").show();
			$('#frmProject').attr("action", "/auth/landingzone?save=" + btnVal);
			$("#frmProject")[0].submit();
		}
		else {
			// Form validation failed
			$("#servicemessage").text("Please Enter Mandatory Values");
			$("#cover-spin").hide();
			$("#saveProjectPopupModal").modal("hide");
		}
	});

	// Create Infrastructure through Terraform
	// Select first options
	if ($("#activity")[0] != null) {
		$("#activity")[0].selectedIndex = 0;
	}

	// On-Click handler for Landing Zone Screen Infrastructure button
	$("#infrastructure").click(function(e) {
		$("#servicemessage").text("");

		// Validate data
		var activityVal = $('#activity option:selected').val().trim();
		var modalPopupInfra = $("#infraPopupModal");
		var modalInfraMessage = modalPopupInfra.find('.modal-message-infra');

		if (activityVal && activityVal.length > 0) {
			$('#infra').show();
			modalInfraMessage.text('Proceed with Infra Activity?');
		} else {
			$('#infra').hide();
			$('#tokenExpiry').text('');
			$('#mfaExpiryDiv').hide();
			modalInfraMessage.text('Please select Activity to perform');
		}

		$("#cover-spin").hide();
		modalPopupInfra.modal('show');
	});

	// On infraPopupModal Show
	$("#infraPopupModal").on('show.bs.modal', function() {
		var strInfraActivity = $('#activity option:selected').val();

		if (strInfraActivity && strInfraActivity.length > 0) {
			$('#mfaCode').val('');

			try {
				var objMFA = getTokenExpiryInfra(strInfraActivity);
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
					$('#infra').trigger('focus');
				}
			} catch (error) {
				$('#infra').hide();
				$('#tokenExpiry').text('');
				$('#mfaExpiryDiv').hide();
				$("#infraPopupModal").find('.modal-message').html(error);
			}
		}
		else {
			//alert('Activity not selected');
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
	// Disconnect Websocket if already connected
	if (stompClient != null) {
		stompClient.disconnect();
	}

	// Clear Message Bar
	$('#servicemessage').css('color', 'blue');
	$('#servicemessage').text("Performing Infrastructure Activity ...");

	var modalPopup = $("#infraPopupModal");

	// Validate data
	if (isValidData()) {
		if (isActiveProjectStatus()) {
			$("#infraPopupModal").modal("hide");
			var mfaCodeValue = $("#mfaCode").val();
			connect(mfaCodeValue);
			$('#mfaCode').val('');
		}
		else {
			modalPopup.find('.modal-message-infra').text('Project Status is not "Active"');
			$('.btn-proceed').hide();
			modalPopup.modal("show");

			// disconnect();
			if (stompClient != null) {
				stompClient.disconnect();
			}
		}
	}
	else {
		modalPopup.find('.modal-message-infra').text('Invalid Data. Cannot Proceed');
		$('.btn-proceed').hide();
		modalPopup.modal("show");

		// disconnect();
		if (stompClient != null) {
			stompClient.disconnect();
		}
	}
};

function connect(mfaCodeValue) {
	var socket = new SockJS('/chat');
	stompClient = Stomp.over(socket);

	stompClient.connect({}, function(frame) {
		document.getElementById('tfresponse').value = '';
		console.log('Connected: ' + frame);
		stompClient.subscribe('/topic/lz_messages', function(messageOutput) {
			showMessageOutput(JSON.parse(messageOutput.body));
		});

		create_infra(mfaCodeValue);
	});

};

function disconnect() {
	if (stompClient != null) {

		// Disconnect after 30 seconds (30000 milliseconds)
		setTimeout(() => {
			console.log('disconnect : Timeout complete');
			stompClient.disconnect();
		}, 30000);

		// stompClient.disconnect();
	}

	console.log("Disconnected");
};

function sendMessage() {
	var from = document.getElementById('from').value;
	var text = document.getElementById('text').value;
	stompClient.send("/app/chat", {}, JSON.stringify({ 'from': from, 'text': text }));
};

function showMessageOutput(messageOutput) {
	var msg = messageOutput.text;
	var tfTextArea = $('#tfresponse');

	if (tfTextArea.val().trim().length > 0) {
		tfTextArea.val(tfTextArea.val() + '\n' + msg);
	}
	else {
		tfTextArea.val(msg);
	}

	tfTextArea.scrollTop(tfTextArea[0].scrollHeight);
};

function isValidData() {
	// Validations

	if (isInfraInProgress) {
		alert('Infrastructure creation is in progress');
		return false;
	}

	if (!$('#infrastructure').val()) {
		alert('Invalid Project Details');
		return false;
	}

	if (!$('#activity').val()) {
		alert('Select Infrastructure Activity to perform');
		return false;
	}

	if ($('#infrastructure').val() && $('#activity').val()) {
		//alert('Executing Infrastructure Activity');
		return true;
	}
	else {
		alert('Invalid details');
		return false;
	}
};

// Get MFA Token from Session for Save Project
function getTokenExpirySaveProject(strActivity) {
	var objMFA;
	var errorValue = null;

	// Prepare Form Data
	var formData = {
		infrastructure: $("#save-project").attr("value"),
		activity: strActivity,
		account: $('#masterAccount option:selected').val()
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

// Get MFA Token from Session for Infra Creation
function getTokenExpiryInfra(strActivity) {
	var objMFA;
	var errorValue = null;

	// Prepare Form Data
	var formData = {
		infrastructure: $("#fetchAccounts").attr("value"),
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


// Get MFA Token from Session for Master Account
function getTokenExpiryMasterAccount(strActivity) {
	var objMFA;
	var errorValue = null;

	// Prepare Form Data
	var formData = {
		infrastructure: $("#fetchAccounts").attr("value"),
		activity: strActivity,
		account: $('#masterAccount option:selected').val()
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

// Get Control Tower Accounts By Master Account
function fetchControlTowerAccounts(mfaCodeValue) {
	var lstControlTowerAccounts;
	var errorValue = null;

	var strMasterAccount = $('#masterAccount option:selected').val();
	if (!strMasterAccount) {
		return;
	}

	// Prepare Form Data
	var formData = {
		infrastructure: $("#fetchAccounts").attr("value"),
		activity: activityType,
		account: strMasterAccount,
		mfaCode: mfaCodeValue
	}

	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: "/auth/lz/controltoweraccounts",
		async: true,
		data: JSON.stringify(formData),
		dataType: 'json',
		beforeSend: function(xhr) {
			xhr.setRequestHeader(header, token);
		},
		cache: false,
		timeout: 600000,
		success: function(data) {
			lstControlTowerAccounts = data;
			console.log("SUCCESS : ", data);

			var lstAuditAccount = $('#auditAccount');
			var lstLogArchiveAccount = $('#loggingAccount');
			var lstOrgConfigExcludedAccounts = $('#lstOrgConfigExcludedAccounts');

			lstAuditAccount.empty();
			lstLogArchiveAccount.empty();
			lstOrgConfigExcludedAccounts.empty();

			var optionSelect = option
				+ "<option value=''>"
				+ '--Select--'
				+ "</option>";

			var option = "";

			for (var i = 0; i < data.length; i++) {
				option = option
					+ "<option value='" + data[i].nodeId + "'>"
					+ data[i].nodeName
					+ "</option>";
			}

			lstAuditAccount.append(optionSelect + option);
			lstLogArchiveAccount.append(optionSelect + option);

			lstOrgConfigExcludedAccounts.append(option);
			lstOrgConfigExcludedAccounts.multiselect('rebuild');

			$("#servicemessage").text("Fetched Control Tower Accounts. Please select Audit and Log Archive Accounts");
			$("#cover-spin").hide();
		},
		error: function(e) {
			console.log("ERROR : ", e);
			errorValue = e.responseText;

			$("#servicemessage").text(errorValue);
			$("#cover-spin").hide();
			return false;
		}
	});

	if (errorValue != null) {
		throw errorValue;
	}
	else {
		return lstControlTowerAccounts;
	}

	//return lstControlTowerAccounts;
};

// Get Default Region By Account
function getRegionByAccount() {
	var strMasterAccount = $('#masterAccount option:selected').val();
	if (!strMasterAccount) {
		return;
	}

	// Prepare Form Data
	var formData = {
		accountId: strMasterAccount
	}

	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: "/auth/regionbyaccount",
		async: true,
		data: JSON.stringify(formData),
		beforeSend: function(xhr) {
			xhr.setRequestHeader(header, token);
		},
		cache: false,
		timeout: 600000,
		success: function(data) {
			console.log("SUCCESS : ", data);

			var regionDropdown = $('#defaultRegion');
			regionDropdown.val(data);
		},
		error: function(e) {
			console.log("ERROR : ", e);
		}
	});
};

function isActiveProjectStatus() {
	var isActive = false;

	// Prepare Form Data
	var formData = {
		infrastructure: $('#infrastructure').val()
	}

	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: "/auth/lz/isactive",
		async: false,
		data: JSON.stringify(formData),
		beforeSend: function(xhr) {
			xhr.setRequestHeader(header, token);
		},
		cache: false,
		timeout: 600000,
		success: function(data) {
			isActive = data;
			console.log("SUCCESS : ", data);
		},
		error: function(e) {
			console.log("ERROR : ", e);
		}
	});

	return isActive;
};

function create_infra(mfaCodeValue) {
	// Maximize tfresponse Textarea
	maximizeTFTextArea();

	// Prepare Form Data
	var formData = {
		infrastructure: $('#infrastructure').val(),
		activity: $('#activity option:selected').val(),
		mfaCode: mfaCodeValue
	}

	isInfraInProgress = true;
	$("#infrastructure").attr("disabled", true);

	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: "/auth/lz/infrastructure",
		async: true,
		data: JSON.stringify(formData),
		beforeSend: function(xhr) {
			xhr.setRequestHeader(header, token);
		},
		cache: false,
		timeout: 600000,
		success: function(data) {
			console.log("SUCCESS : ", data);
			if (data.match("^Error")) {
				$('#servicemessage').css('color', 'red');
			}
			else {
				$('#servicemessage').css('color', 'blue');
			}

			$('#servicemessage').text(data);

			isInfraInProgress = false;

			// 10 Seconds for disconnect() and 3 seconds for infrastructure button
			setTimeout(() => {
				console.log('Success : Timeout complete');
				$("#infrastructure").attr("disabled", false);
				// disconnect();
			}, 3000);

		},
		error: function(e) {
			console.log("ERROR : ", e);
			$('#servicemessage').text(e);

			isInfraInProgress = false;

			// 10 Seconds for disconnect() and 3 seconds for infrastructure button
			setTimeout(() => {
				console.log('Error : Timeout complete');
				$("#infrastructure").attr("disabled", false);
				// disconnect();
			}, 3000);

		}
	});
};

function OnError(xhr) {
	var responseText;
	$("#errorDiv").html("");
	try {
		responseText = jQuery.parseJSON(xhr.responseText);
		/*$("#errorDiv").append("<div><b>" + errorType + " " + exception + "</b></div>");*/
		$("#errorDiv").append("<div><u>Exception</u>:<br /><br />" + responseText.ExceptionType + "</div>");
		$("#errorDiv").append("<div><u>StackTrace</u>:<br /><br />" + responseText.StackTrace + "</div>");
		$("#errorDiv").append("<div><u>Message</u>:<br /><br />" + responseText.Message + "</div>");
	} catch (e) {
		responseText = xhr.responseText;
		$("#errorDiv").html(responseText);
	}

	$("#errorPopupModal").modal("show");
};

function OnError_Old(xhr, errorType, exception) {
	var responseText;
	$("#dialog").html("");
	try {
		responseText = jQuery.parseJSON(xhr.responseText);
		$("#dialog").append("<div><b>" + errorType + " " + exception + "</b></div>");
		$("#dialog").append("<div><u>Exception</u>:<br /><br />" + responseText.ExceptionType + "</div>");
		$("#dialog").append("<div><u>StackTrace</u>:<br /><br />" + responseText.StackTrace + "</div>");
		$("#dialog").append("<div><u>Message</u>:<br /><br />" + responseText.Message + "</div>");
	} catch (e) {
		responseText = xhr.responseText;
		$("#dialog").html(responseText);
	}
	$("#dialog").dialog({
		title: "Error Details",
		width: 700,
		buttons: {
			Close: function() {
				alert('error');
				$("#fetchAccountsPopupModal").modal("hide");
				$(this).dialog('close');
			}
		}
	});
};

function maximizeTFTextArea() {
	console.log("Mazimize TextArea");

	var tfTextArea = $("#tfresponse");
	tfTextArea.animate({ rows: 18 }, 500);
	tfTextArea.css({ height: '' });
	tfTextArea.css({ width: '' });

	// Move to Bottom of Page
	var $target = $('html,body');
	$target.animate({ scrollTop: $target.height() }, 500);
}

function minimizeTFTextArea() {
	console.log("Minimize TextArea");

	var tfTextArea = $("#tfresponse");
	tfTextArea.animate({ rows: 6 }, 500);
	tfTextArea.css({ height: '' });
	tfTextArea.css({ width: '' });

	// Move to Bottom of Page
	var $target = $('html,body');
	$target.animate({ scrollTop: $target.height() }, 500);
}
