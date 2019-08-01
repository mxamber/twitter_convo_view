function $(expr) {
	return document.querySelector(expr);
}

function parse() {
	var file = $("#upload").files[0];
	
	if(!file) {
		console.log("no file!");
		return;
	} else {
		console.log("file located!");
	}
	
	var reader = new FileReader();
	reader.onload = function() {
		console.log("reader reading!");
		$("#inner").innerHTML = reader.result;
		convo(reader.result);
	}
	
	reader.readAsText(file);
}

function convo(raw) {
	var wait = $("#wait");
	var top = $("#top");
	var a_send = $("#sender");
	var a_recp = $("#recipient");
	
	wait.style.display = "block";
	
	var convo = JSON.parse(raw).dmConversation;
	
	$("#inner").innerHTML = "";
	var members = convo.conversationId.split("-");
	var sender = members[members.length - 1];
	
	a_send.setAttribute("href", "https://twitter.com/intent/user?user_id=" + sender);
	a_recp.setAttribute("href", "https://twitter.com/intent/user?user_id=" + members[0]);
	
	convo.messages.reverse();
	
	var counter = 0;
	
	convo.messages.forEach(function(item) {
		var msgC = item.messageCreate;
		var msg = document.createElement("div");
		if(msgC.senderId == sender) {
			msg.setAttribute("class", "message1");
		} else {
			msg.setAttribute("class", "message2");
		}
		msg.innerHTML = msgC.text;
		
		var datestring = new Date(Date.parse(msgC.createdAt)).toLocaleString()
		var timep = document.createElement("p");
		timep.innerHTML = datestring;
		msg.appendChild(timep);
		$("#inner").appendChild(msg);
		counter++;
		if(counter >= convo.messages.length) {
			wait.style.display = "none";
		}
	});
}