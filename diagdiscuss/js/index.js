function print_results(result_list){
	results_element=document.getElementById('results')
	results_element.innerHTML = ""
	if(results.length==0){
		results_element.innerHTML = "Aucun diagnostic trouvé dans cette base de données"
		return
	}
	if(results.length>1){
		suggest = generate_suggestions(result_list)
		results_element.innerHTML = "Diagnostics trouvés dans cette base de données classés du plus probable au moins probable. Vous pouvez affiner davantage les diagnostics en spécifiant la présence/absence de ces symptômes : <i>" + suggest.join(', ') + "</i>."
	}

	var hr = document.createElement("hr");
	results_element.appendChild(hr)
	
	
	for (var i=0;i<result_list.length;i++){
		var val=result_list[i]
		id="res" + val.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\ /g,'')

		var div = document.createElement("div");
		div.setAttribute("id",id)
		div.setAttribute("class","resultDiv")
		results_element.appendChild(div)
		var resultDiv = document.getElementById(id)
		
		//title
		var div = document.createElement("div");
		div.setAttribute("id",id + "title")
		div.setAttribute("class","titleDiv")
		resultDiv.appendChild(div)
		var titleDiv = document.getElementById(id + "title")

		var span = document.createElement("span");
		span.innerText = "- " 
		titleDiv.appendChild(span)
		
		var strong = document.createElement("strong");
		strong.innerText = val 
		titleDiv.appendChild(strong)

		var a = document.createElement("a");
		a.innerText="[+]"
		a.setAttribute("onclick",'toggle_args(this,"show")')
		titleDiv.appendChild(a)
		
		//arguments
		var div = document.createElement("div");
		div.setAttribute("id",id + "args")
		div.setAttribute("class","argDiv")
		resultDiv.appendChild(div)
		var argDiv = document.getElementById(id + "args")

		arg_names=Object.keys(data[val]['arguments'])
		arg_names = arg_names.sort(function compareFn(a, b) {
			a_value=data[val]['arguments'][a] * 1
			b_value=data[val]['arguments'][b] * 1
			if (a_value<b_value)
				return 1
			if (b_value<a_value)
				return -1
			if (b_value==a_value)
				return 0
		})
		for (var j=0;j<arg_names.length;j++){
			var div = document.createElement("div");
			div.innerText = "- " + arg_names[j] + " : " + data[val]['arguments'][arg_names[j]] + "%"
			argDiv.appendChild(div)
		}

		argDiv.hidden=true

		var hr = document.createElement("hr");
		resultDiv.appendChild(hr)
	}
}

function toggle_args(element,type){
	if(type=='show'){
		element.parentNode.parentNode.childNodes[1].hidden=false
		element.innerText='[-]' 
		element.setAttribute('onclick',"toggle_args(this,'hide')") 
	} else if (type=='hide'){
		element.parentNode.parentNode.childNodes[1].hidden=true
		element.innerText='[+]' 
		element.setAttribute('onclick',"toggle_args(this,'show')") 
	}
}

function generate_suggestions(list){
	obj={}
	args = get_args()
	nargs = get_nargs()
	for(var i=0;i<list.length;i++){
		for(var j=0;j<Object.keys(data[list[i]]['arguments']).length;j++){
			arg=Object.keys(data[list[i]]['arguments'])[j]
			if ((args.includes(arg)) || (nargs.includes(arg)) || (arg.includes("Caractéristiques"))){	
				continue
			}
			value=data[list[i]]['arguments'][arg] * 1
			if (obj[arg]==undefined){
				obj[arg]=value
			} else if (value>obj[arg]){
				obj[arg]=value
			}
		}
	}
	obj_keys = Object.keys(obj)
	suggest = []
	for(var i=0;i<obj_keys.length;i++){
		if(suggest.length<5){
			suggest.push(obj_keys[i])
		}
		if(suggest.length>4){
			suggest.push(obj_keys[i])
			suggest = suggest.sort(function compareFn(a, b) {
				a_value=obj[a]
				b_value=obj[b]
				if (a_value<b_value)
					return 1
				if (b_value<a_value)
					return -1
				if (b_value==a_value)
					return 0
			})
			suggest.pop()
		}
	}
	
	return suggest
}

const pathologies = Object.keys(data)
function search(){
	args = get_args()
	if(args.length==0){
		var results_element=document.getElementById('results')
		var span = document.createElement("span");
		span.innerText = "Choisir au moins un symptôme qui est présent" 
		results_element.innerHTML = ""
		results_element.appendChild(span)
		return
	}

	nargs = get_nargs()
	age = document.querySelectorAll('.age_select')[0].value 
	onset = document.querySelectorAll('.duree_select')[0].value 
	sex = document.querySelectorAll('.sex_select')[0].value 

	initial_matches=[]
	results = []
	scores = []

	for(var i=0;i<pathologies.length;i++){
		if(data[pathologies[i]]['arguments'][args[0]]!=undefined){
			initial_matches.push(pathologies[i])
		}
	}	

	//filter out useless stuff
	for(var i=0;i<initial_matches.length;i++){
		var skipped = false

		//filter out by other args
		if(args.length>1){
			for(var j=1;j<args.length;j++){
				if(data[initial_matches[i]]['arguments'][args[j]]==undefined){
					skipped = true
					break
				}
			}
			if (skipped) {
				continue
			}
		}	

		//filter out by negative args
		if(nargs.length>0){
			for(var j=0;j<nargs.length;j++){
				if(data[initial_matches[i]]['arguments'][nargs[j]]!=undefined){
					skipped = true
					break
				}
			}
			if (skipped) {
				continue
			}
		}	

		//filter out by sex
		if( (data[initial_matches[i]]['sex']!="1") && (data[initial_matches[i]]['sex'].length==1) && (data[initial_matches[i]]['sex']!=sex) ){
			continue
		}

		//filter out by age
		if( data[initial_matches[i]]['age'][age]=="0" ){
			continue
		}

		//filter out by onset
		if( data[initial_matches[i]]['onset'][onset]=="0" ){
			continue
		}

		results.push(initial_matches[i])
	}

	
	//calculate scores using pseudo bayesian inference
	for(var i=0;i<results.length;i++){
		scores[i]=data[results[i]]['incidence'].replace(',','') / 100000
		for(var j=0;j<args.length;j++){
			scores[i]=scores[i] * data[results[i]]['arguments'][args[j]] * 0.01
		}
		scores[i] = scores[i] * (data[results[i]]['age'][age] / 20)
		scores[i] = scores[i] * (data[results[i]]['onset'][onset] / 20)
		if( (data[results[i]]['sex']!="1") && (data[results[i]]['sex'].length>1) ){
			scores[i] = scores[i] * data[results[i]]['sex'].substring(1)
		}
	}

	//sort using scores
	
	results = results.sort(function compareFn(a, b) {
		a_value=scores[results.indexOf(a)]
		b_value=scores[results.indexOf(b)]
		if (a_value<b_value)
			return 1
		if (b_value<a_value)
			return -1
		if (b_value==a_value)
			return 0
	})
	
	print_results(results)

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
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
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
autocomplete(document.getElementById("searchField"), argument_list);


function get_nargs(){
	nargs = []
	elements = document.querySelectorAll('.arglabel')
	for (var i=0;i<elements.length;i++){
		if (!elements[i].nextSibling.nextSibling.checked) {
			nargs.push(elements[i].innerText)
		}
	}
	return nargs
}

function get_args(){
	args = []
	elements = document.querySelectorAll('.arglabel')
	for (var i=0;i<elements.length;i++){
		if (elements[i].nextSibling.nextSibling.checked) {
			args.push(elements[i].innerText)
		}
	}
	return args
}

function delete_arg(element){
	element.parentNode.parentNode.removeChild(element.parentNode)
}

function add_symptome(default_state){
	args = get_args()
	nargs = get_nargs()
	val=document.getElementById('searchField').value 
	if(!argument_list.includes(val)) {
		var results_element=document.getElementById('results')
		var span = document.createElement("span");
		span.innerText = "Il faut choisir un symptôme de la list" 
		results_element.innerHTML = ""
		results_element.appendChild(span)
		return
	}
	if((args.includes(val)) || (nargs.includes(val))){
		var results_element=document.getElementById('results')
		var span = document.createElement("span");
		span.innerText = "Ce symptome est déja ajouté" 
		results_element.innerHTML = ""
		results_element.appendChild(span)
		return
	}
	var results_element=document.getElementById('results')
	results_element.innerHTML = ""
	id="arg" + val.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\ /g,'')
	arguments_element=document.getElementById('arguments')

	var div = document.createElement("div");
	div.setAttribute("id",id)
	div.setAttribute("class","argument_div")
	arguments_element.appendChild(div)
	var argumentDiv = document.getElementById(id)

	var span = document.createElement("span");
	span.innerText = "- " 
	argumentDiv.appendChild(span)

	var strong = document.createElement("strong");
	strong.setAttribute("class","arglabel")
	strong.innerText = val 
	argumentDiv.appendChild(strong)

	var span = document.createElement("span");
	span.innerText = " : " 
	argumentDiv.appendChild(span)

	var input = document.createElement("input");
	input.setAttribute("name",id)
	input.setAttribute("type","radio")
	input.checked=default_state
	input.setAttribute("class",'present')
	argumentDiv.appendChild(input)

	var label = document.createElement("label");
	label.innerText = "Présent" 
	argumentDiv.appendChild(label)

	var input = document.createElement("input");
	input.setAttribute("name",id)
	input.setAttribute("type","radio")
	input.checked=!default_state
	input.setAttribute("class",'absent')
	argumentDiv.appendChild(input)

	var label = document.createElement("label");
	label.innerText = "Absent" 
	argumentDiv.appendChild(label)

	//var input = document.createElement("input");
	//input.setAttribute("class","remove")
	//input.setAttribute("type","submit")
	//input.setAttribute("value",'Supprimer')
	//input.setAttribute("onclick",'delete_arg(this)')
	//argumentDiv.appendChild(input)

	var a = document.createElement("a");
	a.innerText = "[x]"
	a.setAttribute("onclick",'delete_arg(this)')
	argumentDiv.appendChild(a)

	document.getElementById('searchField').value=""
}



