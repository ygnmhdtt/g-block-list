var storage = chrome.storage.local;

var blockList = {
  domains: []
};

// --------------------------------------------
// Utilities
// --------------------------------------------
var urlToDomain = function(url) {
  var parser = new URL(url);
  return parser.host
};

var getDomain = function(result) {
  var url = result.querySelector("a").href;
  return urlToDomain(url);
};


// --------------------------------------------
// Create Doms
// --------------------------------------------
var createBlockATag = function() {
  var aTag = document.createElement("a");
  aTag.id = "msg";
  aTag.textContent = "block this domain";
  aTag.style.cssText = "font-size: 12pt; color: #3BACED";
  return aTag;
};

var createUnblockATag = function() {
  var unblockATag = document.createElement("a");
  unblockATag.textContent = "Unblock this domain";
  unblockATag.style.cssText = "font-size: 12pt; color: #000000";
  return unblockATag;
}

var removeBlockATag = function(result) {
  var aTags = result.querySelectorAll("a");
  var aTagCnt = aTags.length;
  var aTag = aTags[aTagCnt - 1];
  aTag.parentNode.removeChild(aTag);
}

var createShowButton = function() {
  var btn = document.createElement('button');
  btn.style.cssText = "padding: 14px 40px;";
  btn.textContent = "Show all";
  return btn;
};


// --------------------------------------------
// Manipulate blockList
// --------------------------------------------
var block = function(domain) {
  storage.get(blockList, function(blockList){
    blockList.domains.push(domain);
    storage.set(blockList, function(){});
    // console.log(`block: ${domain}`)
    // console.log(`BlockList: ${blockList.domains}`);
  });
};

var unblock = function(domain) {
  storage.get(blockList, function(blockList){
    var deletedBlockLists = blockList.domains.filter(blockedDomain => blockedDomain !== domain);
    blockList.domains = deletedBlockLists;
    storage.set(blockList, function(){});
    // console.log(`unblock: ${domain}`)
    // console.log(`BlockList: ${blockList.domains}`);
  });
};


// --------------------------------------------
// Manipulate blocked/unblocked Doms
// --------------------------------------------
var hide = function(result) {
  result.style.display = "none";
};

var show = function(result) {
  result.style.display = "block";
}

var setStyleBlocked = function(results, id) {
  var result = results[id];
  result.style.cssText = "background-color: #BDBDBD"
  removeBlockATag(result);
  var unblockATag = createUnblockATag(result);
  unblockATag.addEventListener("click", {results: results, id: id, handleEvent: setStyleUnblockedEvent}, false);
  unblockATag.addEventListener("click", {result: result, handleEvent: unblockEvent}, false);
  result.appendChild(unblockATag);
};

var setStyleUnblocked = function(results, id) {
  var result = results[id];
  result.style.cssText = "background-color: #FFFFFF"

  var aTags = result.querySelectorAll("a");
  var aTagCnt = aTags.length;
  var aTag = aTags[aTagCnt - 1];
  aTag.parentNode.removeChild(aTag);

  var blockATag = createBlockATag();
  blockATag.addEventListener("click", {id: id, results: results, handleEvent: hideEvent}, false);
  blockATag.addEventListener("click", {id: id, results: results, handleEvent: blockEvent}, false);
  result.appendChild(blockATag);
}

// --------------------------------------------
// Events
// --------------------------------------------
var blockEvent = function(event) {
  var res = this.results;
  var blockDomain = getDomain(res[this.id]);
  block(blockDomain);
  var blockedResults = [];
  for (var i = 0; i < res.length; i++) {
    if (res[i].style.display === "none" || res[i].style.backgroundColor !== "rgb(189, 189, 189)") {
      blockedResults.push(res[i]);
    }
  }
  if (blockedResults.length === 1) {
    var btn = createShowButton();
    btn.addEventListener("click", {results: res, handleEvent: showAllEvent}, false);
    var lastResult = res[res.length - 1];
    lastResult.parentNode.insertBefore(btn, lastResult.nextSibling);
  }

};

var unblockEvent = function(event) {
  var res = this.result;
  var blockDomain = getDomain(res);
  unblock(blockDomain);
};

var hideEvent = function(event) {
  var res = this.results;
  var blockDomain = getDomain(res[this.id]);
  // console.log(`hide: ${blockDomain}`);
  for (var i = 0; i < res.length; i++) {
    if (getDomain(res[i]) == blockDomain) {
      hide(res[i]);
    }
  }
};

var showAllEvent = function(event) {
  var results = this.results;
  storage.get(blockList, (blockList) => {
    for (var i = 0; i < results.length; i++) {
      var domain = getDomain(results[i]);
      if (blockList.domains.indexOf(domain) !== -1) {
        show(results[i]);
        setStyleBlocked(results, i);
      }
    }
  });
};

var setStyleUnblockedEvent = function(event) {
  var res = this.results;
  var unblockDomain = getDomain(res[this.id]);
  // console.log(`setUnblockedStyle: ${unblockDomain}`);
  for (var i = 0; i < res.length; i++) {
    if (getDomain(res[i]) == unblockDomain) {
      setStyleUnblocked(res, i);
    }
  }
};

// --------------------------------------------
// Runner
// --------------------------------------------
var run = function() {
  var results = document.getElementsByClassName("rc");
  var showAllBtnFlg = false;

  storage.get(blockList, (blockList) => {
    for (var i = 0; i < results.length; i++) {
      var domain = getDomain(results[i]);
      // First, hide blocked domains
      if (blockList.domains.indexOf(domain) !== -1) {
        hide(results[i]);
        showAllBtnFlg = true;

      // Next, append `block this domain` label
      } else {
        var aTag = createBlockATag();
        aTag.addEventListener("click", {id: i, results: results, handleEvent: hideEvent}, false);
        aTag.addEventListener("click", {id: i, results: results, handleEvent: blockEvent}, false);
        results[i].appendChild(aTag);
      }
    }
    if (showAllBtnFlg) {
      var btn = createShowButton();
      btn.addEventListener("click", {results: results, handleEvent: showAllEvent}, false);
      var lastResult = results[results.length - 1];
      lastResult.parentNode.insertBefore(btn, lastResult.nextSibling);
    }
  });
}

// Initialize blockList if empty
storage.get(blockList, (blockList) => {
  if (blockList.domains.length == 0) {
    blockList.domains = [];
    storage.set(blockList, function() {
      // console.log('storage is empty');
    });
  }
  // console.log(`BlockList: ${blockList.domains}`);
});

setTimeout(run, 500);
