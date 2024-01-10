/*Dashboard*/

var ou_data = '[{"icon":"icon fa-folder","text":"All Projects","nodes":[{"icon":"icon fa-file","text":"Landing Zone Projects","href":"/auth/landingzone/home"},{"icon":"icon fa-file","text":"Infrastructure Projects","href":"/auth/home"},{"icon":"icon fa-file","text":"Migration Projects","href":"/auth/migrate/home"}]},{"icon":"icon fa-folder","text":"Manage","nodes":[{"icon":"icon fa-folder","text":"Infrastructure","nodes":[{"icon":"icon fa-file","text":"Instances","href":"/auth/manageinfra/instances"},{"icon":"icon fa-file","text":"Networks","href":"/auth/manageinfra/networks"},{"icon":"icon fa-file","text":"Subnets","href":"/auth/manageinfra/subnets"},{"icon":"icon fa-file","text":"Instance Backup (AMI)","href":"/auth/manageinfra/instanceimages"}]},{"icon":"icon fa-file","text":"Cloud Accounts","href":"/auth/account_list"},{"icon":"icon fa-file","text":"Install Scripts","href":"/auth/admin/script_list"},{"icon":"icon fa-file","text":"AWS Policies","href":"/auth/landingzone/awspolicies"},{"icon":"icon fa-file","text":"User Profile","href":"/auth/userprofile"},{"icon":"icon fa-file","text":"User List","href":"/auth/userlist"},{"icon":"icon fa-file","text":"Chat","href":"/auth/chatview"}]}]';

$(document).ready(function() {
	// Dashboard Graphs
	// Organization Tree
	$(function() {
		var $tree = $('#treeview1').treeview({
			levels: 4,
			showTags: false,
			enableLinks: true,
			data: ou_data
		});

		// Load the Visualization API and the piechart package.
		google.charts.load('current', {
			'packages': ['corechart']
		});

		// Set a callback to run when the Google Visualization API is loaded.
		google.charts.setOnLoadCallback(drawChart);

		$("#btnMenus").click(function() {
			$("#divMenus").toggle();
		});
	});
});

function drawChart() {
	/////////////////////////////////////////////////////////////////////
	// Create the data table for Landing Zone Projects.
	var chartDataLZ = $.ajax({
		url: "/auth/getprojectcount/1",
		async: false,
		dataType: "json",
		beforeSend: function(xhr) {
			xhr.setRequestHeader(header, token);
		},
		cache: false,
		timeout: 600000,
		success: function(data) {
			console.log("SUCCESS : " + data);
			// alert('success');
		},
		error: function(e) {
			console.log("ERROR : " + e);
			errorValue = e.responseText;
			// alert('error' + errorValue);
			return false;
		}
	}).responseText;

	var dataLZ = new google.visualization.DataTable();
	dataLZ.addColumn('string', 'Cloud');
	dataLZ.addColumn('number', 'Projects');
	// dataLZ.addRows([['AWS', 3], ['Azure', 2], ['GCP', 1]]);

	var jsonDataLZ = JSON.parse(chartDataLZ);
	for (var i = 0; i < jsonDataLZ.length; i++) {
		dataLZ.addRow([jsonDataLZ[i].provider, jsonDataLZ[i].projects]);
	}

	// Set chart options
	var optionsLZ = {
		titleTextStyle: {
			color: 'black', // any HTML string color ('red', '#cc00cc')
			fontName: 'Times New Roman', // i.e. 'Times New Roman'
			fontSize: 18, // 12, 18 whatever you want (don't specify px)
			bold: true, // true or false
			italic: false
		},
		'title': 'Landing Zone Projects',
		'legend': 'left',
		'is3D': true,
		'width': 500,
		'height': 295,
		'pieSliceText': 'value'
	}

	// Instantiate and draw our chart, passing in some options.
	var chartLZ = new google.visualization.PieChart(document
		.getElementById('chart_lz_div'));

	function selectHandlerLZ() {
		var selectedItem = chartLZ.getSelection()[0];
		if (selectedItem) {
			var projectType = dataLZ.getValue(selectedItem.row, 0);
			var url = "/auth/landingzone/home";
			window.location.href = url;
		}
	}

	google.visualization.events.addListener(chartLZ, 'select',
		selectHandlerLZ);

	chartLZ.draw(dataLZ, optionsLZ);

	/////////////////////////////////////////////////////////////////////
	// Create the data table for Infrastructure Projects.
	var chartDataInfra = $.ajax({
		url: "/auth/getprojectcount/2",
		async: false,
		dataType: "json",
		beforeSend: function(xhr) {
			xhr.setRequestHeader(header, token);
		},
		cache: false,
		timeout: 600000,
		success: function(data) {
			console.log("SUCCESS : " + data);
			// alert('success');
		},
		error: function(e) {
			console.log("ERROR : " + e);
			errorValue = e.responseText;
			// alert('error' + errorValue);
			return false;
		}
	}).responseText;

	// Create the data table.
	var dataInfra = new google.visualization.DataTable();
	dataInfra.addColumn('string', 'Cloud');
	dataInfra.addColumn('number', 'Projects');
	// dataInfra.addRows([['AWS', 9], ['Azure', 2], ['GCP', 5], ['OCI', 7]]);

	var jsonDataInfra = JSON.parse(chartDataInfra);
	for (var i = 0; i < jsonDataInfra.length; i++) {
		dataInfra.addRow([jsonDataInfra[i].provider, jsonDataInfra[i].projects]);
	}

	// Set chart options
	var optionsInfra = {
		titleTextStyle: {
			color: 'black', // any HTML string color ('red', '#cc00cc')
			fontName: 'Times New Roman', // i.e. 'Times New Roman'
			fontSize: 18, // 12, 18 whatever you want (don't specify px)
			bold: true, // true or false
			italic: false
		},
		'title': 'Infrastructure Projects',
		'titleTextStyle.fontSize': 18,
		'legend': 'left',
		'is3D': true,
		'allowHtml': true,
		'width': 500,
		'height': 295,
		'pieSliceText': 'value'
	}

	// Instantiate and draw our chart, passing in some options.
	var chartInfra = new google.visualization.PieChart(document
		.getElementById('chart_infra_div'));

	function selectHandlerInfra() {
		var selectedItem = chartInfra.getSelection()[0];
		if (selectedItem) {
			var projectType = dataInfra.getValue(selectedItem.row, 0);
			// alert('The user selected ' + projectType);
			var url = "/auth/home";
			window.location.href = url;
		}
	}

	google.visualization.events.addListener(chartInfra, 'select',
		selectHandlerInfra);

	chartInfra.draw(dataInfra, optionsInfra);

	////////////////////////////////////////////////////////////////////
	// Create the data table for Migration Projects.
	var chartDataMigrate = $.ajax({
		url: "/auth/getprojectcount/3",
		async: false,
		dataType: "json",
		beforeSend: function(xhr) {
			xhr.setRequestHeader(header, token);
		},
		cache: false,
		timeout: 600000,
		success: function(data) {
			console.log("SUCCESS : " + data);
			// alert('success');
		},
		error: function(e) {
			console.log("ERROR : " + e);
			errorValue = e.responseText;
			// alert('error' + errorValue);
			return false;
		}
	}).responseText;

	var dataMigrate = new google.visualization.DataTable();
	dataMigrate.addColumn('string', 'Application Type');
	dataMigrate.addColumn('number', 'Projects');
	// dataMigrate.addRows([['Java', 3], ['Dot.Net', 2], ['Oracle', 1], ['MS-SQL', 2], ['RDS Postgress', 3], ['Configuration', 2], ['Archive', 4]]);

	var jsonDataMigrate = JSON.parse(chartDataMigrate);
	for (var i = 0; i < jsonDataMigrate.length; i++) {
		dataMigrate.addRow([jsonDataMigrate[i].provider, jsonDataMigrate[i].projects]);
	}

	// Set chart options
	var optionsMigrate = {
		titleTextStyle: {
			color: 'black', // any HTML string color ('red', '#cc00cc')
			fontName: 'Times New Roman', // i.e. 'Times New Roman'
			fontSize: 18, // 12, 18 whatever you want (don't specify px)
			bold: true, // true or false
			italic: false
		},
		'title': 'Migration Projects',
		'legend': 'left',
		'is3D': true,
		'width': 500,
		'height': 295,
		'pieSliceText': 'value'
	}

	// Instantiate and draw our chart, passing in some options.
	var chartMigrate = new google.visualization.PieChart(document
		.getElementById('chart_migrate_div'));

	function selectHandlerMigrate() {
		var selectedItem = chartMigrate.getSelection()[0];
		if (selectedItem) {
			var projectType = dataMigrate.getValue(selectedItem.row, 0);
			var url = "/auth/migrate/home";
			window.location.href = url;
		}
	}

	google.visualization.events.addListener(chartMigrate, 'select',
		selectHandlerMigrate);

	chartMigrate.draw(dataMigrate, optionsMigrate);

	////////////////////////////////////////////////////////////////////
	// Create the data table for Managed Accounts.
	var chartDataManage = $.ajax({
		url: "/auth/getprojectcount/4",
		async: false,
		dataType: "json",
		beforeSend: function(xhr) {
			xhr.setRequestHeader(header, token);
		},
		cache: false,
		timeout: 600000,
		success: function(data) {
			console.log("SUCCESS : " + data);
			// alert('success');
		},
		error: function(e) {
			console.log("ERROR : " + e);
			errorValue = e.responseText;
			// alert('error' + errorValue);
			return false;
		}
	}).responseText;

	var dataManage = new google.visualization.DataTable();
	dataManage.addColumn('string', 'Cloud');
	dataManage.addColumn('number', 'Accounts');
	// dataManage.addRows([['AWS', 3], ['Azure', 2], ['GCP', 1]]);

	var jsonDataManage = JSON.parse(chartDataManage);
	for (var i = 0; i < jsonDataManage.length; i++) {
		dataManage.addRow([jsonDataManage[i].provider, jsonDataManage[i].projects]);
	}

	// Set chart options
	var optionsManage = {
		titleTextStyle: {
			color: 'black', // any HTML string color ('red', '#cc00cc')
			fontName: 'Times New Roman', // i.e. 'Times New Roman'
			fontSize: 18, // 12, 18 whatever you want (don't specify px)
			bold: true, // true or false
			italic: false
		},
		'title': 'Managed Cloud Accounts',
		'legend': 'left',
		'is3D': true,
		'width': 500,
		'height': 295,
		'pieSliceText': 'value'
	}

	// Instantiate and draw our chart, passing in some options.
	var chartManage = new google.visualization.PieChart(document
		.getElementById('chart_manage_div'));

	function selectHandlerManage() {
		var selectedItem = chartManage.getSelection()[0];
		if (selectedItem) {
			var projectType = dataManage.getValue(selectedItem.row, 0);
			var url = "/auth/manageinfra/instances";
			window.location.href = url;
		}
	}

	google.visualization.events.addListener(chartManage, 'select',
		selectHandlerManage);

	chartManage.draw(dataManage, optionsManage);
};
