$(document).ready(function() {

	$('#frmService').on('submit', function(event) {

		// adding rules for selects with class 'must_required' e.g. Direction
		$('select.must_required').each(function() {
			$(this).rules("add", {
				required: true
			})
		});

		// adding rules for inputs with class 'must_required' e.g. Direction
		$('input.must_required').each(function() {
			$(this).rules("add", {
				required: true
			})
		});
		
		// adding rules for inputs with class 'must_required_priority' e.g. Priority
		$('input.must_required_priority').each(function() {
			$(this).rules("add", {
				required: true,
				min: 100,
				max: 4096
			})
		});

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
	      	'resourceGroupId': {
	    	  valueNotEquals : "0"
		  	},
			'nsgName': {
				required: true,
				minlength: 1,
				maxlength: 255
			}
		}
	});

	// initialize the validator
	$('#frmService').validate();

});

/////////////////////////////////////////////////////////////////////
// Add New Security Group - Dynamic Row
/////////////////////////////////////////////////////////////////////
// Add product to <table>
function productAddToTable() {
	// First check if a <tbody> tag exists, add one if not
	if ($("#sgRulesTable tbody").length == 0) {
		$("#sgRulesTable").append("<tbody></tbody>");
	}

	// Append product to table
	$("#sgRulesTable tbody").append(productBuildTableRow(nextId));

	// Increment next ID to use
	nextId += 1;
}

// Update product in <table>
function productUpdateInTable(id) {
	// Find Product in <table>
	var row = $("#sgRulesTable button[data-id='" + id + "']").parents(
		"tr")[0];

	// Add changed product to table
	$(row).after(productBuildTableRow(id));

	// Remove original product
	$(row).remove();

	// Change Update Button Text
	$("#updateButton").text("Add");
}

// Build a <table> row of Product data
function productBuildTableRow(id) {
	var ret = "<tr><td class='text-left align-top'>"
		+ id
		+ "<span class='mx-2'><i class='fas fa-edit'></i></span>"
		+ "</td>"

		+ "<td class='text-center align-top'><input class='form-control must_required' name='lstNSGRuleBean["
		+ id
		+ "].ruleName' id='lstNSGRuleBean"
		+ id
		+ ".ruleName' />"
		+ "</td>"

		+ "<td class='text-center align-top'><input type='number' min='100' max='4096' step='100' class='form-control must_required_priority' name='lstNSGRuleBean["
		+ id
		+ "].priority' id='lstNSGRuleBean"
		+ id
		+ ".priority' />"
		+ "</td>"
		
		+ "<td class='text-center align-top'><select class='form-control must_required' name='lstNSGRuleBean["
		+ id
		+ "].direction' id='lstNSGRuleBean"
		+ id
		+ ".direction'>"
		+ "<option value='1'>Inbound</option>"
		+ "<option value='2'>Outbound</option>"
		+ "</select>"
		+ "</td>"
		
		+ "<td class='text-center align-top'><select class='form-control must_required' name='lstNSGRuleBean["
		+ id
		+ "].access' id='lstNSGRuleBean"
		+ id
		+ ".access'>"
		+ "<option value='0'>Deny</option>"
		+ "<option value='1'>Allow</option>"
		+ "</select>"
		+ "</td>"
		
		+ "<td class='text-center align-top'><select class='form-control must_required' name='lstNSGRuleBean["
		+ id
		+ "].protocol' id='lstNSGRuleBean"
		+ id
		+ ".protocol'>"
		+ "<option value='ALL'>ALL</option>"
		+ "<option value='TCP'>TCP</option>"
		+ "<option value='UDP'>UDP</option>"
		+ "<option value='ICMP'>ICMP</option>"
		+ "</select>"
		+ "</td>"
		
		+ "<td class='text-center align-top'><input type='text' class='form-control must_required' name='lstNSGRuleBean["
		+ id
		+ "].sourceAddress' id='lstNSGRuleBean"
		+ id
		+ ".sourceAddress' />"
		+ "</td>"
		
		+ "<td class='text-center align-top'><input type='text' class='form-control' name='lstNSGRuleBean["
		+ id
		+ "].sourceAppId' id='lstNSGRuleBean"
		+ id
		+ ".sourceAppId' />"
		+ "</td>"
		
		+ "<td class='text-center align-top'><input type='text' class='form-control must_required' name='lstNSGRuleBean["
		+ id
		+ "].sourcePort' id='lstNSGRuleBean"
		+ id
		+ ".sourcePort' />"
		+ "</td>"

		+ "<td class='text-center align-top'><input type='text' class='form-control must_required' name='lstNSGRuleBean["
		+ id
		+ "].destinationAddress' id='lstNSGRuleBean"
		+ id
		+ ".destinationAddress' />"
		+ "</td>"
		
		+ "<td class='text-center align-top'><input type='text' class='form-control' name='lstNSGRuleBean["
		+ id
		+ "].destinationAppId' id='lstNSGRuleBean"
		+ id
		+ ".destinationAppId' />"
		+ "</td>"
				
		+ "<td class='text-center align-top'><input type='text' class='form-control must_required' name='lstNSGRuleBean["
		+ id
		+ "].destinationPort' id='lstNSGRuleBean"
		+ id
		+ ".destinationPort' />"
		+ "</td>"

		+ "<td class='text-center align-top'><input type='text' class='form-control max_length_description' name='lstNSGRuleBean["
		+ id
		+ "].description' id='lstNSGRuleBean"
		+ id
		+ ".description' />"
		+ "</td>"

		+ "<td class='text-center align-top'><button type='button' name='btnDelete["
		+ id
		+ "]' id='btnDelete'"
		+ id
		+ " onclick='productDelete(this);' class='btn btn-default' data-id='"
		+ id + "'><i class='fas fa-trash-alt'></i></button>"
		+ "</td>" + "</tr>"

	return ret;
}

// Delete product from <table>
function productDelete(ctl) {
	$(ctl).closest("tr").remove();
}