function search(keyword) {
	if(keyword.length<1)
		return []
	keyword = keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
	var results = []
	for(var i in data){
		//data_fields=Object.keys(data[i])
		data_fields=['DCI','Spécialité']
		for(var u=0;u<data_fields.length;u++){
			if(! Object.keys(data[i]).includes(data_fields[u])){
				continue
			}
			var rel = getRelevance(data[i][data_fields[u]],keyword)
			if(rel==0)
				continue
			results.push({relevance:rel,entry:data[i]})
		}
		if(results.length>200)
			break
	}
	results.sort(compareRelevance)
	for(i=0;i<results.length;i++){
		results[i] = results[i].entry
	}
	
	return results
}

function setCookie(cname, cvalue, exdays) {
	const d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	let expires = "expires="+ d.toUTCString();
	if (Array.isArray(cvalue)){
		cvalue = JSON.stringify(cvalue);
		cvalue = cvalue.replaceAll("%","%25")
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


function getRelevance(value,keyword){
	value = value.toLowerCase()
	keyword = keyword.toLowerCase()
	
	var index = value.indexOf(keyword) 
	var word_index = value.indexOf(' '+keyword) 
	
	if(index==0) 
		return 3 
	else if(word_index!=-1) 
		return 2 
	else if(index!=-1) 
		return 1 
	else
		return 0 
}

function compareRelevance(a, b) {
  return b.relevance - a.relevance
}




function hashCode(string){
    var hash = 0;
    for (var i = 0; i < string.length; i++) {
        var code = string.charCodeAt(i);
        hash = ((hash<<5)-hash)+code;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}




function outputResult(results){
	document.getElementById("results").innerHTML="" 
	if(results.length == 0) {
		var info = document.createElement("div");
		info.id = "info";
		info.innerHTML = "Aucun résultat, entrez le nom d'un DCI ou médicament et appuyez sur Recherche.";
		document.getElementById("results").appendChild(info); 
	} else {
		for(var i in results){
			data_fields=Object.keys(results[i])
			resultstring=""
			for(var u=0;u<data_fields.length;u++){
				resultstring+=results[i][data_fields[u]]
			}
			var nameid= hashCode(resultstring);
			if(document.getElementById(nameid) != null)
				continue

			var name = results[i]["Spécialité"]
			if(data_fields.includes("Dosage"))
				name+= ' ' + results[i]["Dosage"];
			if(data_fields.includes("Forme"))
				name+= ' ' + results[i]["Forme"];
			if(data_fields.includes("Présentation"))
				name+= ' ' + results[i]["Présentation"];
			var section = document.createElement("div");
			section.id = nameid;
			document.getElementById("results").appendChild(section); 
			sectionEl = document.getElementById(nameid)

			var header = document.createElement("div");
			header.id = "header-" + nameid;
			document.getElementById(nameid).appendChild(header); 
			headerEl = document.getElementById("header-" + nameid)

			var nom = document.createElement("span");
			nom.innerHTML = "<b>" + name + "</b>";
			headerEl.appendChild(nom); 

			var show = document.createElement("a");
			show.className = "show";
			show.innerHTML = "<u>[Afficher]</u>";
			show.setAttribute("onclick","toggle("+ nameid +")");
			headerEl.appendChild(show); 

			var datas = document.createElement("div");
			datas.hidden=true
			datas.className="data"
			datas.id = "data-" + nameid;
			sectionEl.appendChild(datas); 
			dataEl = document.getElementById("data-" + nameid)

			for(var u=0;u<data_fields.length;u++){
				var propriete = document.createElement("div");
				propriete.className = "propriete"
				if(data_fields[u]=='notice' || data_fields[u]=='rcp'){
					propriete.innerHTML = "- <b>" + data_fields[u] + "</b> : <a href='" + results[i][data_fields[u]] + "'>" + results[i][data_fields[u]] + "</a>";
				} else {
					propriete.innerHTML = "- <b>" + data_fields[u] + "</b> : " + results[i][data_fields[u]];
				}
				dataEl.appendChild(propriete); 
			}
			
			var divider = document.createElement("hr");
			document.getElementById(nameid).appendChild(divider); 
		}
	}
}

function recherche(){
	keyword = document.getElementById("query").value
	outputResult(search(keyword))
}

function toggle(id){
	showButton = document.getElementById("header-" + id).querySelector("a") 
	dataEl = document.getElementById("data-" + id)
	currentlyHidden = dataEl.hidden
	
	if (currentlyHidden) {
		showButton.innerHTML = "<u>[Réduire]</u>"
		dataEl.hidden=false
	} else {
		showButton.innerHTML = "<u>[Afficher]</u>"
		dataEl.hidden=true
	}

}

function toggleall(action){
	buttons = document.getElementsByClassName("show") 
	datas = document.getElementsByClassName("data")
	if (action=="show"){
		document.getElementById("showall").value = "Réduire"
		document.getElementById("showall").setAttribute("onclick","toggleall('hide')")
		for (var i=0; i<buttons.length; i++){
			buttons[i].innerHTML="<u>[Réduire]</u>"
		}
		for (var i=0; i<datas.length; i++){
			datas[i].hidden=false
		}
	} else {
		document.getElementById("showall").value = "Afficher"
		document.getElementById("showall").setAttribute("onclick","toggleall('show')")
		for (var i=0; i<buttons.length; i++){
			buttons[i].innerHTML="<u>[Afficher]</u>"
		}
		for (var i=0; i<datas.length; i++){
			datas[i].hidden=true
		}
	}
}


function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
	  inc=0
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
		if (inc>9)
			break
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(val.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) {
		  inc+=1
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
		  str_index=arr[i].toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').indexOf(val.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
          b.innerHTML = arr[i].substr(0,str_index);
          b.innerHTML += "<strong>" + arr[i].substr(str_index, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(str_index + val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += '<input type="hidden" value="' + arr[i] + '">';
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        //e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}
autocomplete(document.getElementById("query"), autocomplete_list);




function initSearch(){
	url = new URL(window.location.href)
	uquery = url.searchParams.get("q");
	if (uquery!=null){
		document.title = uquery + ' - Medicasearch';
		document.getElementById("query").value = uquery
		recherche()
	}
}



function buttonPress(){
	//history management
	hlist = getCookie("MShistory")
	if (hlist.length == 0)
		hlist = []

	query = document.getElementById("query").value
	
	hlist.unshift(query)
	if (hlist.length>50)
		hlist.pop()
	setCookie("MShistory",hlist,30)

	url = new URL(window.location.href)
	document.title = query + ' - Medicasearch';
	uquery = url.searchParams.get("q");
	url.searchParams.set("q",query)
	if (uquery==null){
		history.replaceState(null, query + ' - Medicasearch', url.href);
	} else {
		history.pushState(null, query + ' - Medicasearch', url.href);
	}

	recherche()

	shown = document.getElementById("showall").value
	if (shown=="Réduire"){
		toggleall("show")
	}
}



var input = document.getElementById("query");
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("button").click();
  }
});

window.onpopstate = function(event) {
	event.preventDefault();
	initSearch()
};


//init
initSearch()


