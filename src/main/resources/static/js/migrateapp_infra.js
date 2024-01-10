/*Migrate App*/

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

	// On-Click handler for Infrastructure button
	$("#infrastructure").click(function() {
		// Validate data
		// var btn = $(this);
		// var btnVal = btn.attr("value").trim();
		var strActivity = $('#activity option:selected').val();
		var modalPopupInfra = $("#infraPopupModal");
		var modalInfraMessage = modalPopupInfra.find('.modal-message-infra');

		if (strActivity && strActivity.length > 0) {
			$('#infra').show();
			$('#mfaExpiryDiv').show();
			modalInfraMessage.text('Proceed with Infra Activity?');
		} else {
			$('#infra').hide();
			$('#mfaExpiryDiv').hide();
			modalInfraMessage.text('Please select Activity to perform');
		}

		modalPopupInfra.modal('show');
	});

	// On infraPopupModal Show
	$("#infraPopupModal").on('show.bs.modal', function() {
		var strActivity = $('#activity option:selected').val();
		if (strActivity && strActivity.length > 0) {

			try {
				var objMFA = getTokenExpiryMigrate();
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
			} catch (error) {
				var modalPopup = $("#infraPopupModal");
				modalPopup.find('.modal-message-infra').html(error);
				$('#mfaExpiryDiv').hide();
				$('.btn-proceed').hide();
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
	if (isValidInfraData()) {
		if (isActiveProjectStatus()) {

			try {
				$("#infraPopupModal").modal("hide");
				var mfaCodeValue = $("#mfaCode").val();
				connect(mfaCodeValue);
				$('#mfaCode').val('');

			} catch (error) {
				var modalPopup = $("#infraPopupModal");
				modalPopup.find('.modal-message-infra').html(error);
				$('#mfaExpiryDiv').hide();
				$('.btn-proceed').hide();
			}
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
}

function connect(mfaCodeValue) {
	var socket = new SockJS('/chat');
	stompClient = Stomp.over(socket);

	stompClient.connect({}, function(frame) {
		document.getElementById('tfresponse').value = '';
		console.log('Connected: ' + frame);
		stompClient.subscribe('/topic/migrate_messages', function(messageOutput) {
			showMessageOutput(JSON.parse(messageOutput.body));
		});

		create_infra(mfaCodeValue);
	});

}

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
}

function sendMessage() {
	var from = document.getElementById('from').value;
	var text = document.getElementById('text').value;
	stompClient.send("/app/chat", {}, JSON.stringify({ 'from': from, 'text': text }));
}

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
}

function isValidInfraData() {
	// Validations

	if (isInfraInProgress) {
		alert('Infrastructure creation is in progress');
		return false;
	}

	if (!$('#activity').val()) {
		alert('Select Infrastructure Activity to perform');
		return false;
	}

	// Consolidated Validation
	if (!isInfraInProgress && $('#activity').val()) {
		//alert('Executing Infrastructure Activity');
		return true;
	}
	else {
		alert('Invalid details');
		return false;
	}

	/*
	if (!$('#targetProject').val()) {
		alert('Select Project for Infrastructure Activity');
		return false;
	}

	if (!$('#targetAccount').val()) {
		alert('Select Account for Infrastructure Activity');
		return false;
	}

	if ($('#activity').val() && $('#targetProject').val() && $('#targetAccount').val()) {
		//alert('Executing Infrastructure Activity');
		return true;
	}
	else {
		alert('Invalid details');
		return false;
	}
	*/

}

function getTokenExpiryMigrate(strActivity) {
	var objMFA;
	var errorValue = null;
	var strActivity = $('#activity option:selected').val();

	// Prepare Form Data
	var formData = {
		infrastructure: $('#infrastructure').val(),
		activity: strActivity,
		targetproject: $('#targetProject option:selected').val(),
		targetaccount: $('#targetAccount option:selected').val()
	}

	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: "/auth/tokenexpirymigrate",
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
		return objMFA;
	}

	//return objMFA;
}

function isActiveProjectStatus() {
	var isActive = false;

	// Prepare Form Data
	var formData = {
		infrastructure: $('#infrastructure').val()
	}

	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: "/auth/isactivemigrate",
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
	var strActivity = $('#activity option:selected').val();

	// Maximize tfresponse Textarea
	maximizeTFTextArea();

	// Prepare Form Data
	var formData = {
		infrastructure: $('#infrastructure').val(),
		activity: strActivity,
		mfaCode: mfaCodeValue
	}

	isInfraInProgress = true;
	$("#infrastructure").attr("disabled", true);

	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: "/auth/migrateapp",
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

			setTimeout(() => {
				console.log('Success : Timeout complete');
				$("#infrastructure").attr("disabled", false);
				// disconnect();
			}, 3000);

		},
		error: function(e) {
			console.log("ERROR : ", e);
			$('#servicemessage').css('color', 'red');
			$('#servicemessage').text(e);

			isInfraInProgress = false;

			setTimeout(() => {
				console.log('Error : Timeout complete');
				$("#infrastructure").attr("disabled", false);
				// disconnect();
			}, 3000);

		}
	});
}

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
