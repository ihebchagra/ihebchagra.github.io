function setCookie(cname, cvalue, exdays) {
	const d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	let expires = "expires="+ d.toUTCString();
	if (Array.isArray(cvalue)){
		cvalue = JSON.stringify(cvalue);
	}
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
} 

function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			c = c.substring(name.length, c.length);
			try {
				array_c = JSON.parse(c)
			} catch {
				return c
			}
			if(Array.isArray(array_c)){
				return array_c
			} else {
				return c
			}
		}
	}
	return "";
} 

function generateHistory(){
	hlist = getCookie("MShistory")
	if (hlist.length == 0)
		hlist = []
	historyElement=document.getElementById('history')
	historyElement.innerHTML = ""
	for (var i=0;i<hlist.length;i++){
		if (hlist[i][1] == "all"){
			niv="Tout niveau"
		} else {
			niv = hlist[i][1]
		}
		if (hlist[i][2] == "all"){
			cer="Tout certificat"
		} else {
			cer = hlist[i][2]
		}
		var div = document.createElement("div");
		div.setAttribute("class","history")
		href="./index.html?q=" + hlist[i]
		div.innerHTML = "- <a href='" + href + "'><u>" + hlist[i] + "</u></a>"
		historyElement.appendChild(div)
	}
}

function deleteHistory(){
	setCookie("MShistory",[],30)
	generateHistory()
}


// init
generateHistory()
