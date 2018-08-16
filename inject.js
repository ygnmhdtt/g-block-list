var hideDiv = function(event) {
	this.results[this.id].style.display = "none";
}

var hide = function() {
  var results = document.getElementsByClassName("g pb");
  for (var i = 0; i < results.length; i++) {
    var aTag = document.createElement("a");
    aTag.textContent = "hide this";
		aTag.style.color = "orange"
		aTag.addEventListener("click", {id: i, results: results, handleEvent: hideDiv}, false);
    results[i].appendChild(aTag);
  }
}

setTimeout(hide, 600);
