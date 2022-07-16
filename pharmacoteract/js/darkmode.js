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


function setDarkTheme(state){
	if (state == "true"){
		setCookie("dark","true",30)
		element = document.getElementById("darkMode")
		if (element!=null){
			element.setAttribute("onclick","setDarkTheme('false')")
			element.innerHTML = "<u>Light Mode</u>"
		}
		var styles = `
			html {
				background-color: #2f2724;
				color: white;
			}
			h1 {
				color: #e8cce7;
			}
			`
		var styleSheet = document.createElement("style")
		styleSheet.innerText = styles
		document.head.appendChild(styleSheet)
	} else {
		setCookie("dark","false",30)
		element = document.getElementById("darkMode")
		if (element!=null){
			element.setAttribute("onclick","setDarkTheme('true')")
			element.innerHTML = "<u>Dark Mode</u>"
		}
		var styles = `
			html {
				background-color: #ffefdb;
				color: black;
			}
			h1 {
				color: #4f184e;
			}
			`

		var styleSheet = document.createElement("style")
		styleSheet.innerText = styles
		document.head.appendChild(styleSheet)
	}
}

// init


darkTheme = getCookie("dark") || "false"
setDarkTheme(darkTheme)

