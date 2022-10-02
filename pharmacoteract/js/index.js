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
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(val.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) {
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
        e.preventDefault();
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
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function addSubstance(){
	menuNumber=Object.keys(document.getElementsByClassName("substance")).length + 1
	substancesElement = document.getElementById('substances')
	const id = "substance" + menuNumber

	var div = document.createElement("div");
	div.setAttribute("id",id)
	div.setAttribute("class","substance")
	substancesElement.appendChild(div)
	var substanceDiv = document.getElementById(id)

	var label = document.createElement("label");
	label.innerHTML = "<b>Substance " + menuNumber + " : </b>"
	substanceDiv.appendChild(label)

	var div = document.createElement("div");
	div.setAttribute("class","autocomplete")
	div.setAttribute("id","autocomplete" + menuNumber)
	substanceDiv.appendChild(div)
	var autocompleteDiv = document.getElementById("autocomplete" + menuNumber)

	var input = document.createElement("input");
	input.setAttribute("type","text")
	input.setAttribute("placeholder","Toute Substance")
	input.setAttribute("id","searchField" + menuNumber)
	input.setAttribute("class","searchField")
	autocompleteDiv.appendChild(input)

	var input = document.createElement("input");
	input.setAttribute("type","button")
	input.setAttribute("id","button" + menuNumber)
	input.setAttribute("value","Ajouter")
	input.setAttribute("onclick","lockSubstance(this)")
	substanceDiv.appendChild(input)

	var input = document.getElementById("searchField" + menuNumber);
	input.addEventListener("keypress", function(event) {
	  if (event.key === "Enter") {
	    event.preventDefault();
	    document.getElementById("button" + menuNumber).click();
	  }
	});

	autocomplete(document.getElementById("searchField" + menuNumber), autocomplete_list);

}

function lockSubstance(el){
	val = el.parentElement.querySelector(".autocomplete").childNodes[0].value 
	if(autocomplete_list.includes(val)){
		console.log(val)
		el.value = "Changer"
		el.parentElement.querySelector(".autocomplete").childNodes[0].disabled=true
		el.setAttribute("onclick","resetSubstance(this)")
	} else {
		var results = document.getElementById('results')
		results.innerHTML=""
		var div = document.createElement("div");
		div.setAttribute("class","notice")
		div.innerText = "Choisir une substance de la liste et appuyez sur Ajouter."
		results.appendChild(div)
		
	}
}

function resetSubstance(el){
	el.parentElement.querySelector(".autocomplete").childNodes[0].disabled = false
	el.parentElement.querySelector(".autocomplete").childNodes[0].value = ""
	el.value = "Ajouter"
	el.setAttribute("onclick","lockSubstance(this)")
}

function verify(){
	var results = document.getElementById('results')
	results.innerHTML=""

	menus=document.getElementsByClassName("searchField")
	var substances=[]
	for(var i in Object.keys(menus)){
		if (menus[i].disabled){
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


// init
addSubstance()

window.onpopstate = function(event) {
	event.preventDefault();
	initSearch()
};
