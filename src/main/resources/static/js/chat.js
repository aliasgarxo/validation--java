
var stompClient = null;

function setConnected(connected) {

	// document.getElementById('connect').disabled = connected;
	// document.getElementById('disconnect').disabled = !connected;
	document.getElementById('conversationDiv').style.visibility = connected ? 'visible' : 'hidden';
	document.getElementById('tfresponse').value = '';
	document.getElementById("text").focus();
}

function connect() {
	// First Disconnect (if not already done)
	disconnect();

	// Connect
	var socket = new SockJS('/chat');
	stompClient = Stomp.over(socket);

	stompClient.connect({}, function(frame) {
		setConnected(true);
		console.log('Connected: ' + frame);
		stompClient.subscribe('/topic/chat_messages', function(messageOutput) {
			showMessageOutput(JSON.parse(messageOutput.body));
		});
	});

	// Get the input field
	var input = document.getElementById("text");

	// Execute a function when the user releases a key on the keyboard
	input.addEventListener("keyup", function(event) {
		// Number 13 is the "Enter" key on the keyboard
		// if (event.keyCode === 13) {
		if (event.key === 'Enter') {
			// Cancel the default action, if needed
			event.preventDefault();
			// Trigger the button element with a click
			document.getElementById("sendMessage").click();
		}
	});
}

function disconnect() {
	// alert('disconnect');
	if (stompClient != null) {
		stompClient.disconnect();
	}

	setConnected(false);
	console.log("Disconnected");
}

function sendMessage() {
	var from = document.getElementById('from').value;
	var text = document.getElementById('text').value;
	if (text.length > 0) {
		stompClient.send("/app/chat", {}, JSON.stringify({ 'from': from, 'text': text }));
	}

	document.getElementById('text').value = "";
	document.getElementById("text").focus();
}

function showMessageOutput(messageOutput) {
	// var msg = messageOutput.from + ": " + messageOutput.text + " (" + messageOutput.time + ")";
	var msg = messageOutput.from + " (" + messageOutput.time + ") : " + messageOutput.text;
	var tfTextArea = $('#tfresponse');

	if (tfTextArea.val().trim().length > 0) {
		tfTextArea.val(tfTextArea.val() + '\n' + msg);
	}
	else {
		tfTextArea.val(msg);
	}

	tfTextArea.scrollTop(tfTextArea[0].scrollHeight);

}

