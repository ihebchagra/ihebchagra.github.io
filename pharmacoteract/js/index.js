function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function makeMenu(){
	menuNumber=Object.keys(document.getElementsByClassName("substance")).length + 1
	substancesElement = document.getElementById('substances')
	const id = "substance" + menuNumber

	var div = document.createElement("div");
	div.setAttribute("id",id)
	substancesElement.appendChild(div)
	var substanceDiv = document.getElementById(id)

	var label = document.createElement("label");
	label.setAttribute("for",id)
	label.innerHTML = "<b>Substance " + menuNumber + " : </b>"
	substanceDiv.appendChild(label)
	var select = document.createElement("select");
	select.setAttribute("name",id)
	select.setAttribute("class","substance")
	var option = document.createElement("option");
	option.setAttribute("value","all")
	option.innerHTML = "Toute Substance"
	select.appendChild(option)
	for(var i in data){
		var option = document.createElement("option");
		dci= data[i]["substance"]
		option.setAttribute("value",dci)
		option.innerHTML = toTitleCase(dci)
		select.appendChild(option)
	}
	substanceDiv.appendChild(select)
}
makeMenu()
makeMenu()

function verify(){
	var results = document.getElementById('results')
	results.innerHTML=""

	menus=document.getElementsByClassName("substance")
	var substances=[]
	for(var i in Object.keys(menus)){
		if (menus[i].value != "all"){
			substances.push(menus[i].value)
		}
	}
	if(substances.length == 0){
		var div = document.createElement("div");
		div.setAttribute("class","notice")
		div.innerText = "Il faut choisir au moins une substance"
		results.appendChild(div)
	} else if (substances.length == 1){
		for(var i in data){
			if(data[i]["substance"] != substances[0]){
				continue
			} else {
				var div = document.createElement("div");
				div.setAttribute("class","notice")
				div.innerText = "Les Intéractions médicamenteuses de " + toTitleCase(substances[0]) + " sont :"
				results.appendChild(div)

				for(var j in data[i]["interactions"]){

					effet=data[i]["interactions"][j]["effet"]
					indication=data[i]["interactions"][j]["indication"]
					if((effet.length==0) && (indication.length==0))
						continue

					var br = document.createElement("br");
					results.appendChild(br)

					var div = document.createElement("div");
					div.setAttribute("class","interaction")
					div.innerHTML = "<b>"+toTitleCase(data[i]["interactions"][j]["substance"])+"</b>"
					results.appendChild(div)

					var div = document.createElement("div");
					div.setAttribute("class","effet")
					div.innerHTML = "<b>Effet : </b>" + data[i]["interactions"][j]["effet"]
					results.appendChild(div)

					var div = document.createElement("div");
					div.setAttribute("class","indication")
					div.innerHTML = "<b>Indication : </b>" + data[i]["interactions"][j]["indication"]
					results.appendChild(div)

				}
				break
			}
		}
	} else {
		matches=[]
		obj={}
		dataset=[]
		for(var i in data){
			if(substances.includes(data[i]["substance"])){
				dataset.push(data[i])
			} 
		}
		for(var i in dataset){
			n = 0
			for(var j in substances){
				if(dataset[i]['substance']==substances[j]){
					n+=1
				}
			}
			const index = substances.indexOf(dataset[i]['substance'])
			substances.splice(index,n)
			for(var j in dataset[i]){
				for(var u in dataset[i]['interactions']){
					for(var k in substances){
						if(dataset[i]['interactions'][u]['substance'].includes(substances[k])){
							obj['interaction']=[dataset[i]['substance'],substances[k]].sort().join(' + ')
							obj['effet']=dataset[i]['interactions'][u]['effet']
							obj['indication']=dataset[i]['interactions'][u]['indication']
							matches.push(obj)
							obj={}
						}
					}
				}
			}
			substances.push(dataset[i]['substance'])
		}
		const uniqueInteractions = [];
		const unique = matches.filter(element => {
			const isDuplicate = uniqueInteractions.includes(element['interaction']);
			if (!isDuplicate) {
				uniqueInteractions.push(element['interaction']);
				return true;
			}
			return false;
		});
		if(matches.length>0){
			var div = document.createElement("div");
			div.setAttribute("class","notice")
			div.innerText = "Les Intéractions médicamenteuses détectées, dans cette base de données, entre ces substances sont :"
			results.appendChild(div)

			for(var i in unique){
				effet=unique[i]["effet"]
				effet=unique[i]["indication"]
				if((effet.length==0) && (indication.length==0))
					continue

				var br = document.createElement("br");
				results.appendChild(br)

				var div = document.createElement("div");
				div.setAttribute("class","interaction")
				div.innerHTML = "<b>"+toTitleCase(unique[i]["interaction"])+"</b>"
				results.appendChild(div)

				var div = document.createElement("div");
				div.setAttribute("class","effet")
				div.innerHTML = "<b>Effet : </b>" + unique[i]["effet"]
				results.appendChild(div)

				var div = document.createElement("div");
				div.setAttribute("class","indication")
				div.innerHTML = "<b>Indication : </b>" + unique[i]["indication"]
				results.appendChild(div)
				
			}
		} else {
			var div = document.createElement("div");
			div.setAttribute("class","notice")
			div.innerText = "Aucune intéraction médicamenteuse détectée dans cette base de données"
			results.appendChild(div)
		}

	}
}

