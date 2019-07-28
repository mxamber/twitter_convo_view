function convo() {
	var raw = "";
	document.getElementById("inner").innerHTML = "";
	
	
	raw = document.getElementById("input").value;
	var convo = JSON.parse(raw).dmConversation;
	var members = convo.conversationId.split("-");
	
	convo.messages.reverse();
	
	convo.messages.forEach(function(item) {
		var msgC = item.messageCreate;
		var msg = document.createElement("div");
		if(msgC.senderId == members[1]) {
			msg.setAttribute("class", "message1");
		} else {
			msg.setAttribute("class", "message2");
		}
		msg.innerHTML = msgC.text;
		document.getElementById("inner").appendChild(msg);
	});
}