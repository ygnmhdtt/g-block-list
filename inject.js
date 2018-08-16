var storage = chrome.storage.local

var blockLists = {
  domains: []
};

// --------------------------------------------
// Utilities
// --------------------------------------------
var urlToDomain = function(url) {
  var parser = new URL(url);
  return parser.host
}

var getDomain = function(result) {
  var url = result.querySelector("a").href;
  return urlToDomain(url);
}

var createATag = function() {
  var aTag = document.createElement("a");
  aTag.textContent = "block this domain";
  aTag.style.cssText = "font-size: 12pt; color: #3BACED";
  return aTag;
}

var block = function(domain) {
  storage.get(blockLists, function(blockLists){
    blockLists.domains.push(domain);
    storage.set(blockLists, function(){});
    console.log(`block: ${domain}`)
    console.log(`BlockList: ${blockLists.domains}`);
  });
}

var hide = function(result) {
  result.style.display = "none";
}


// --------------------------------------------
// Events
// --------------------------------------------
var blockEvent = function(event) {
  var res = this.results;
  var blockDomain = getDomain(res[this.id]);
  block(blockDomain);
}

var hideEvent = function(event) {
  var res = this.results;
  var blockDomain = getDomain(res[this.id]);
  console.log(`hide: ${blockDomain}`);
  for (var i = 0; i < res.length; i++) {
    if (getDomain(res[i]) == blockDomain) {
      hide(res[i]);
    }
  }
}

// --------------------------------------------
// Runner
// --------------------------------------------
var run = function() {
  var results = document.getElementsByClassName("g pb");

  // First, hide blocked domains
  storage.get(blockLists, (blockLists) => {
    for (var i = 0; i < results.length; i++) {
      var domain = getDomain(results[i]);
      if (blockLists.domains.includes(domain)) {
        hide(results[i]);
      }
    }
  });

  // Next, append `block this domain` label
  for (var i = 0; i < results.length; i++) {
    var aTag = createATag();
    aTag.addEventListener("click", {id: i, results: results, handleEvent: hideEvent}, false);
    aTag.addEventListener("click", {id: i, results: results, handleEvent: blockEvent}, false);
    results[i].appendChild(aTag);
  }

}

// Initialize blockLists if empty
storage.get(blockLists, (blockLists) => {
  if (blockLists.domains.length == 0) {
    blockLists.domains = [];
    storage.set(blockLists, function() {
      console.log('storage initialized');
    });
  }
  console.log(`BlockList: ${blockLists.domains}`);
});

setTimeout(run, 500);
