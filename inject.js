var blockLists = {
  domains: []
};

var entity = {};
entity.hoge = {
  col1: 'new data'
};

var hideDiv = function(event) {
  this.results[this.id].style.display = "none";
  console.log(this.results[this.id]);
  var domain = this.results[this.id].querySelector("a").href;
  var bls = JSON.parse(localStorage['blockLists']);
  bls.domains.push('' + domain)
  localStorage['blockLists'] = JSON.stringify(bls);
  console.log(localStorage['blockLists']);
}

var hide = function() {
  var results = document.getElementsByClassName("g pb");
  for (var i = 0; i < results.length; i++) {
    var aTag = document.createElement("a");
    aTag.textContent = "block this domain";
    aTag.style.color = "orange";
    aTag.addEventListener("click", {id: i, results: results, handleEvent: hideDiv}, false);
    results[i].appendChild(aTag);
  }
  chrome.storage.local.get(entity, function(items){
    console.log(items.hoge.col1)
  });
}


// chrome.storage.local.set(entity, function() {
//   console.log('stored');
// });

localStorage['blockLists'] = JSON.stringify(blockLists);
if (localStorage['blockLists'] == "") {
  localStorage['blockLists'] = JSON.stringify(blockLists);
}
setTimeout(hide, 1000);

chrome.storage.local.set({key: value}, function() {
  console.log('Value is set to ' + value);
});

chrome.storage.local.get(['key'], function(result) {
  console.log('Value currently is ' + result.key);
});
