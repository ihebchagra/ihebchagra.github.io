function search(keyword) {
	if(keyword.length<1)
		return
	keyword = keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	var results = []
	for(var i in data){
		data_fields=Object.keys(data[i])
		for(var u=0;u<data_fields.length;u++){
			var rel = getRelevance(data[i][data_fields[u]],keyword)
			if(rel==0)
				continue
			results.push({relevance:rel,entry:data[i]})
		}
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

function outputResult(results){
	document.getElementById("results").innerHTML="" 
	if(results.length == 0) {
		var notice = document.createElement("div");
		notice.id = "notice";
		notice.innerHTML = "Aucun résultat";
		document.getElementById("results").appendChild(notice); 
	} else {
		for(var i in results){
			var nom = document.createElement("h3");
			nom.id = "nom";
			nom.innerHTML = results[i]["Nom"];
			document.getElementById("results").appendChild(nom); 
			data_fields=Object.keys(data[i])
			for(var u=0;u<data_fields.length;u++){
				if(data_fields[u]=="Nom")
					continue
				if(results[i][data_fields[u]] == undefined)
					continue
				var propriete = document.createElement("div");
				propriete.id="propriete"
				propriete.innerHTML = "- <b>" + data_fields[u] + "</b> : " + results[i][data_fields[u]];
				document.getElementById("results").appendChild(propriete); 
				
			}
			var divider = document.createElement("hr");
			document.getElementById("results").appendChild(divider); 
		}
	}
}

function recherche(){
	keyword = document.getElementById("query").value
	outputResult(search(keyword))
}


var input = document.getElementById("query");
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("button").click();
  }
});
