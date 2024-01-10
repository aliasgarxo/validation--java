$(document).ready(function() {

	$('#frmService').on('submit', function(event) {

		// adding rules for selects with class 'must_required' e.g. Direction
		$('select.must_required').each(function() {
			$(this).rules("add", {
				required: true
			})
		});

		// adding rules for inputs with class 'must_required_from_port' e.g. From Ports
		$('input.must_required_from_port').each(function() {
			$(this).rules("add", {
				required: true,
				min: 0,
				max: 65535
			})
		});

		// adding rules for inputs with class 'must_required_to_port' e.g. To Ports
		$('input.must_required_to_port').each(function() {
			$(this).rules("add", {
				required: true,
				min: 0,
				max: 65535
			})
		});

		// adding rules for inputs with class 'must_required_ruleValue' e.g. CIDR, Self, SG-Id, SG-Module
		$('input.must_required_ruleValue').each(function() {
			$(this).rules("add", {
				required: function(element) {
					return validateRuleValue(element);
				}
			});
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
			'sgName': {
				required: true,
				minlength: 1,
				maxlength: 255
			},
			'sgDescription': {
				required: true,
				minlength: 1,
				maxlength: 255
			},
			'vpcModuleId': {
				validateVPC: true
			},
			'awsVpcId': {
				validateVPC: true
			}
		}
	});

	function validateRuleValue(element) {
		var idx = $("input.must_required_ruleValue").index(element);
		var rt_idx = $("select.must_required_ruleType").eq(idx);

		var isBlank = false;
		if (!element.value.trim()) {
			isBlank = true;
		}

		if ($("select.must_required_ruleType").eq(idx).val() != 2 && isBlank) {
			return true;
		}
		else {
			return false;
		}
	};

	$("select.must_required_ruleType").on('change', function() {
		var rt = $("select.must_required_ruleType");
		var idx = rt.index(this);

		var rv_idx = $("input.must_required_ruleValue").eq(idx);

		if (this.value == 2) {
			//rv_idx.val('');
			rv_idx.attr("disabled", "disabled");
		}
		else {
			rv_idx.removeAttr("disabled");
		}
	}).change();


	$("select.must_required_protocol").on('change', function() {
		var protocol = $("select.must_required_protocol");
		var idx = protocol.index(this);

		var from_idx = $("input.must_required_from_port").eq(idx);
		var to_idx = $("input.must_required_to_port").eq(idx);
		
		if (this.value == 'ALL') {
			from_idx.val('0');
			from_idx.attr("disabled", "disabled");
			
			to_idx.val('0');
			to_idx.attr("disabled", "disabled");
		}
		else {
			from_idx.removeAttr("disabled");
			to_idx.removeAttr("disabled");
		}
	}).change();

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



	$("select.must_required_ruleType").on('change', function() {
		var rt = $("select.must_required_ruleType");
		var idx = rt.index(this);

		var rv_idx = $("input.must_required_ruleValue").eq(idx);

		if (this.value == 2) {
			//rv_idx.val('');
			rv_idx.attr("disabled", "disabled");
		}
		else {
			rv_idx.removeAttr("disabled");
		}
	}).change();


	$("select.must_required_protocol").on('change', function() {
		var protocol = $("select.must_required_protocol");
		var idx = protocol.index(this);

		var from_idx = $("input.must_required_from_port").eq(idx);
		var to_idx = $("input.must_required_to_port").eq(idx);
		
		if (this.value == 'ALL') {
			from_idx.val('0');
			from_idx.attr("disabled", "disabled");
			
			to_idx.val('0');
			to_idx.attr("disabled", "disabled");
		}
		else {
			from_idx.removeAttr("disabled");
			to_idx.removeAttr("disabled");
		}
	}).change();

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

		+ "<td class='text-center align-top'><select class='form-control must_required' name='lstSGRuleBean["
		+ id
		+ "].direction' id='lstSGRuleBean"
		+ id
		+ ".direction'>"
		+ "<option value='1'>Inbound</option>"
		+ "<option value='2'>Outbound</option>"
		+ "</select>"
		+ "</td>"

		+ "<td class='text-center align-top'><select class='form-control must_required_protocol' name='lstSGRuleBean["
		+ id
		+ "].protocol' id='lstSGRuleBean"
		+ id
		+ ".protocol'>"
		+ "<option value='TCP'>TCP</option>"
		+ "<option value='UDP'>UDP</option>"
		+ "<option value='ALL'>ALL</option>"
		+ "<option value='ICMP'>ICMP</option>"
		+ "</select>"
		+ "</td>"

		+ "<td class='text-center align-top'><input type='number' min='0' max='65535' step='1' class='form-control must_required_from_port' name='lstSGRuleBean["
		+ id
		+ "].fromPort' id='lstSGRuleBean"
		+ id
		+ ".fromPort' />"
		+ "</td>"

		+ "<td class='text-center align-top'><input type='number' min='0' max='65535' step='1' class='form-control must_required_to_port' name='lstSGRuleBean["
		+ id
		+ "].toPort' id='lstSGRuleBean"
		+ id
		+ ".toPort' />"
		+ "</td>"

		+ "<td class='text-center align-top'><select class='form-control must_required_ruleType' name='lstSGRuleBean["
		+ id
		+ "].ruleType' id='lstSGRuleBean"
		+ id
		+ ".ruleType'>"
		+ "<option value='1'>CIDR</option>"
		+ "<option value='2'>Self</option>"
		+ "<option value='3'>SG-Id</option>"
		+ "<option value='4'>SG-Module</option>"
		+ "</select>"
		+ "</td>"

		+ "<td class='text-center align-top'><input type='text' class='form-control must_required_ruleValue' name='lstSGRuleBean["
		+ id
		+ "].ruleValue' id='lstSGRuleBean"
		+ id
		+ ".ruleValue' />"
		+ "</td>"

		+ "<td class='text-center align-top'><input type='text' class='form-control max_length_description' name='lstSGRuleBean["
		+ id
		+ "].description' id='lstSGRuleBean"
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