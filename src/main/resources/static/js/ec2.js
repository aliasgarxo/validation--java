/*EC2 Instances*/

$(document).ready(function() {
	$('#lstUserDataScripts').multiselect({
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

	$('#lstSubnets').multiselect({
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

	$('#lstSecurityGroups').multiselect({
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

	$("#vpcModuleId").on('change', function() {
		var detailId = $(this).val();
		var dataValue = $("#saveEC2").attr("value");

		if (detailId > 0) {
			getSubnets(detailId, dataValue);
		} else {
			var lstSubnets = $('#lstSubnets');
			lstSubnets.empty();
			lstSubnets.multiselect('rebuild');
		}
	});

	// On-Change handler for OS Type DropDown
	$("#osType").on('change', function() {
		var nOSType = $(this).val();
		populateInstallScripts(nOSType);
	});

	$("#frmService").validate({
		rules: {
			'serviceDescription': {
				required: true,
				minlength: 5,
				maxlength: 255
			},
			'moduleName': {
				required: true,
				nowhitespace: true,
				minlength: 3,
				maxlength: 255
			},
			'vpcModuleId': {
				valueNotEquals: "0"
			},
			'instanceCount': {
				required: true
			},
			'instanceName': {
				required: true,
				nowhitespace: true,
				alphanumeric: true,
				minlength: 1,
				maxlength: 255
			},
			'amiId': {
				required: true
			},
			'instanceType': {
				required: true
			},
			'lstSubnets': {
				required: true
			},
			'osType': {
				valueNotEquals: "0"
			}
		}
	});
});


function getSubnets(detailId, dataValue) {
	var subnetMap;

	// Prepare Form Data
	var formData = {
		detailId: detailId,
		dataValue: dataValue
	}

	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: "/auth/subnets",
		async: false,
		data: JSON.stringify(formData),
		dataType: 'json',
		beforeSend: function(xhr) {
			xhr.setRequestHeader(header, token);
		},
		cache: false,
		timeout: 600000,
		success: function(data) {
			subnetMap = data;
			console.log("SUCCESS : ", data);

			var lstSubnets = $('#lstSubnets');
			lstSubnets.empty();

			var option = "";
			for (var i = 0; i < data.length; i++) {
				option = option
					+ "<option value='" + data[i].subnetValue + "'>"
					+ data[i].subnetName
					+ "</option>";
			}

			lstSubnets.append(option);
			lstSubnets.multiselect('rebuild');
		},
		error: function(e) {
			console.log("ERROR : ", e);
		}
	});

	return subnetMap;
};

// Get Install Scripts By OS Type
function populateInstallScripts(nOSType) {
	var userDataScriptsDropdown = $('#lstUserDataScripts');

	if (nOSType == 1 || nOSType == 2) {
		// Prepare Form Data
		var formData = {
			osType: nOSType
		}

		$.ajax({
			type: "POST",
			contentType: "application/json",
			url: "/auth/getinstallscripts",
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

				userDataScriptsDropdown.empty();
				/*var optionSelect = option
					+ "<option value=''>"
					+ '--Select--'
					+ "</option>";*/

				var option = "";

				for (var i = 0; i < data.length; i++) {
					option = option
						+ "<option value='" + data[i].scriptId + "'>"
						+ data[i].scriptName
						+ "</option>";
				}

				// userDataScriptsDropdown.append(optionSelect + option);
				userDataScriptsDropdown.append(option);
				userDataScriptsDropdown.multiselect('rebuild');
			},
			error: function(e) {
				console.log("ERROR : ", e);
			}
		});
	}
	else {
		userDataScriptsDropdown.empty();
		userDataScriptsDropdown.multiselect('rebuild');
	}

};
