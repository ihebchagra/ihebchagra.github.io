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
		var notice = document.createElement("div");
		notice.id = "notice";
		notice.innerHTML = "Aucun résultat, entrez le nom d'un DCI ou médicament et appuyez sur Recherche";
		document.getElementById("results").appendChild(notice); 
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
			if(data_fields.includes("Dosage"))
				var name= results[i]["Spécialité"] + ' ' + results[i]["Dosage"];
			else
				var name= results[i]["Spécialité"];
			var section = document.createElement("div");
			section.id = nameid;
			document.getElementById("results").appendChild(section); 
			var nom = document.createElement("h3");
			nom.id = "nom";
			nom.innerHTML = name;
			document.getElementById(nameid).appendChild(nom); 
			var inc=0
			for(var u=0;u<data_fields.length;u++){
				inc+=1
				if(data_fields[u]=='notice' || data_fields[u]=='rcp'){
					var propriete = document.createElement("div");
					propriete.id="propriete"
					if(inc>8){
						propriete.className="expandable"
						propriete.hidden=true
					}
					propriete.innerHTML = "- <b>" + data_fields[u] + "</b> : <a href='" + results[i][data_fields[u]] + "'>" + results[i][data_fields[u]] + "</a>";
					document.getElementById(nameid).appendChild(propriete); 
					continue
				}
				var propriete = document.createElement("div");
				propriete.id="propriete"
				if(inc>8){
					propriete.className="expandable"
					propriete.hidden=true
				}
				propriete.innerHTML = "- <b>" + data_fields[u] + "</b> : " + results[i][data_fields[u]];
				document.getElementById(nameid).appendChild(propriete); 
				
			}
			var afficher = document.createElement("button");
			afficher.id="afficher"
			afficher.innerHTML = "<u>Afficher Plus>></u>";
			afficher.setAttribute("onClick", "show("+ nameid +")")
			document.getElementById(nameid).appendChild(afficher); 
			
			var divider = document.createElement("hr");
			document.getElementById(nameid).appendChild(divider); 
		}
	}
}

function recherche(){
	keyword = document.getElementById("query").value
	outputResult(search(keyword))
}

function show(id){
	parent = document.getElementById(id) 
	parent.getElementsByTagName("button")[0].style.display = "none" 
	hidden = parent.getElementsByClassName("expandable")
	for(var i in hidden){
		hidden[i].hidden = false
	}
}

function showall(){
	buttons = document.getElementsByTagName("button") 
	for(var i in buttons){
		if(isNaN(Number(i)))
			continue
		buttons[i].style.display = "none";
	}
	hidden = document.getElementsByClassName("expandable")
	for(var i in hidden){
		if(isNaN(Number(i)))
			continue
		hidden[i].hidden = false
	}
}


var input = document.getElementById("query");
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("button").click();
  }
});
