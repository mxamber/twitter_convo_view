const errortext = "ERROR: invalid file"

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
		contents(reader.result);
	}
	
	reader.readAsText(file);
}


function contents(raw) {
	if(raw.startsWith("window.YTD.direct_message.part0") == false) {
		console.log("dialogue");
		dialogue(raw);
		return;
	}
	raw = "{" + raw + "}";
	raw = raw.replace("window.YTD.direct_message.part0 =", '"content" :');
	var file = JSON.parse(raw);
	if(typeof(file.content[0].dmConversation) != "object") {
		console.log(errortext);
		return;
	} else {
		console.log("FILE valid, processing...");
	}
}


function dialogue(raw) {
	var wait = $("#wait");
	var top = $("#top");
	var a_send = $("#sender");
	var a_recp = $("#recipient");
	
	wait.style.display = "block";
	
	if(raw.includes("dmConversation") == false || raw.includes("conversationId") == false) {
		console.log(errortext);
		return;
	}
	
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
		
		if(msgC.senderId == "notif") {
			msg.setAttribute("class", "notif");
		} else if(msgC.senderId == sender) {
			msg.setAttribute("class", "message1");
		} else {
			msg.setAttribute("class", "message2");
		}
		
		var url_regexp = new RegExp('https{0,1}\:\/\/[^ ]*');
		msgC.text = msgC.text.replace(url_regexp, '<a href="$&" target="_blank">$&</a>');
		
		
		msg.innerHTML = msgC.text;
		
		if(msgC.senderId != "notif") {
			var datestring = new Date(Date.parse(msgC.createdAt)).toLocaleString()
			var timep = document.createElement("p");
			timep.innerHTML = datestring;
			msg.appendChild(timep);
		}
		
		$("#inner").appendChild(msg);
		counter++;
		if(counter >= convo.messages.length) {
			wait.style.display = "none";
		}
	});
}