/*Landing Zone*/

$(document).ready(function() {
	// Organization Tree
	$(function() {
		var $tree = $('#treeview1').treeview({
			levels: 6,
			showTags: true,
			data: ou_data,
			onNodeSelected: function(event, node) {
				getOrgNodeDetails(event, node);
			},
			onNodeUnselected: function(event, node) {
				clearNodeDetails();
			}
		});

	});

	// On-Click handler for Landing Zone Screen Fetch Button
	$("#fetch").click(function(e) {
		$("#servicemessage").text("");

		var strOrgActvityId = $('#orgActvityId option:selected').val();
		var strOrgActvityIdText = $('#orgActvityId option:selected').text();

		var modalMessage;
		if (strOrgActvityId && strOrgActvityId.length > 0) {
			modalMessage = strOrgActvityIdText;
			$('#fetchAccountsMFAExpiryDiv').show();
			$('.btn-fetchAccountsModal').show();
		}
		else {
			modalMessage = "Please Select Organization Activity";
			$('#fetchAccountsMFAExpiryDiv').hide();
			$('.btn-fetchAccountsModal').hide();
		}

		var modalPopup = $("#fetchAccountsPopupModal");
		var btnModal = modalPopup.find('.modal-footer button');
		btnModal.attr('value', strOrgActvityId);
		modalPopup.find('.modal-message').text(modalMessage);

		modalPopup.find('.modal-title').text("Organization Activity");

		$("#cover-spin").hide();
		$("#fetchAccountsPopupModal").modal("show");
	});

	// On fetchAccountsPopupModal Show
	$("#fetchAccountsPopupModal").on('show.bs.modal', function(e) {
		var strOrgActvityId = $('#orgActvityId option:selected').val();
		if (strOrgActvityId && strOrgActvityId.length > 0) {
			$('#fetchAccountsMFACode').val('');

			try {
				var objMFA = getTokenExpiry(activityType);
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
		try {
			// Post Form if data is valid
			$("#cover-spin").show();

			$('#frmLandingZoneDetails').attr("action", "/auth/landingzone?fetch");
			$("#frmLandingZoneDetails")[0].submit();
		} catch (error) {
			$('.btn-fetchAccountsModal').hide();
			$('#fetchAccountsMFAExpiryDiv').hide();
			$("#fetchAccountsPopupModal").find('.modal-message').html(error);
			$("#cover-spin").hide();
			return false;
		}

		$('#fetchAccountsMFACode').val('');
	});

});


/*
$(window).bind("load", function() {
 // code here
 // alert("window loaded");
 
	var results = $('#treeview1').treeview('search', ['Root', {
		ignoreCase: true,    // case insensitive
		exactMatch: false,   // like or equals
		revealResults: true, // reveal matching nodes
	}]);

	if (results.length > 0) {
		alert(JSON.stringify(results[0]));
		$('#treeview1').treeview('selectNode', [results[0], { silent: false }]);
	}
});
*/

// Get Org Node Details
function getOrgNodeDetails(event, node) {
	$("#servicemessage").text("");

	if (!node) {
		clearNodeDetails();
		return;
	}

	//Set Selected Node Id
	$("#selectedNodeId").val(node.encNodeId);

	// Prepare Form Data
	var formData = {
		infrastructure: $("#projectId").val(),
		nodeId: node.encNodeId
	}

	//alert(JSON.stringify(node.tags[0]));

	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: "/auth/lz/nodedetails",
		async: true,
		data: JSON.stringify(formData),
		beforeSend: function(xhr) {
			xhr.setRequestHeader(header, token);
		},
		cache: false,
		timeout: 600000,
		success: function(data) {
			console.log("SUCCESS : ", data);
			populateNodeDetails(data);
		},
		error: function(e) {
			console.log("ERROR : ", e);
			clearNodeDetails();
		}
	});
};

// Clear Org Node Details
function clearNodeDetails() {
	$("#servicemessage").text("");

	$("#nodeType").val("");
	$("#nodeId").val("");
	$("#nodeName").val("");
	$("#arn").val("");
	$("#email").val("");
	$("#status").val("");
	$("#joinedMethod").val("");
	$("#joinedDateTimeString").val("");
	$("#parentId").val("");
	$("#selectedNodeId").val("");

	// Clear LZ Activities
	// clearLZNodeActivities();
};

// Populate Selected Node Details and LZ Activities
function populateNodeDetails(data) {
	var orgNode;
	var lzNodeActivities;

	if (data) {
		orgNode = data.orgNode;
		lzNodeActivities = data.lzNodeActivities;
	}

	if (orgNode) {
		$("#nodeType").val(orgNode.nodeType);
		$("#nodeId").val(orgNode.nodeId);
		$("#nodeName").val(orgNode.nodeName);
		$("#arn").val(orgNode.arn);
		$("#email").val(orgNode.email);
		$("#status").val(orgNode.status);
		$("#joinedMethod").val(orgNode.joinedMethod);

		if (orgNode.joinedDateTimeString) {
			var joinedDateTimeString = new Date(Date.parse(orgNode.joinedDateTimeString));
			$("#joinedDateTimeString").val(joinedDateTimeString);
			//$("#joinedDateTimeString").val(joinedDateTimeString.toLocaleString());
		}
		else {
			$("#joinedDateTimeString").val("");
		}

		$("#parentId").val(orgNode.parentId);

		//Populate LZ Node Activities
		if (lzNodeActivities) {
			//alert(JSON.stringify(lzNodeActivities))
			populateLZNodeActivities(lzNodeActivities);
		}
		else {
			// clearLZNodeActivities();
		}
	}
	else {
		clearNodeDetails();
	}
};

// Populate LZ Activities
function populateLZNodeActivities(lzNodeActivities) {
	var actvityDropdown = $('#nodeActvityId');

	if (lzNodeActivities) {
		actvityDropdown.empty();

		/*var option = option
			+ "<option value=''>"
			+ '--Select Activity--'
			+ "</option>";*/

		var option = "";
		for (var i = 0; i < lzNodeActivities.length; i++) {
			option = option
				+ "<option value='" + lzNodeActivities[i].keyValue + "'>"
				+ lzNodeActivities[i].keyName
				+ "</option>";
		}

		actvityDropdown.append(option);
	}
	else {
		// clearLZNodeActivities();
	}
};

// Clear LZ Activities
function clearLZNodeActivities() {
	var actvityDropdown = $('#nodeActvityId');

	var option = option
		+ "<option value=''>"
		+ '--Select OU or Account--'
		+ "</option>";

	actvityDropdown.empty();
	actvityDropdown.append(option);
};


// Get MFA Token from Session
function getTokenExpiry(strActivity) {
	var objMFA;
	var errorValue = null;

	// Prepare Form Data
	var formData = {
		infrastructure: $("#fetch").attr("value"),
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