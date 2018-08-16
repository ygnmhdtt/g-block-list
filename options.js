var displayBlockList = function() {
  storage.get(blockLists, function(blockLists){
    document.getElementById("blockList").innerText = blockLists.domains.join("\n");
  });
};

var save = function() {
  storage.get(blockLists, function(blockLists){
    var text = document.getElementById("blockList").value;
    var domains = text.split('\n').filter(domain => domain !== "");
    blockLists.domains = domains;
    storage.set(blockLists, function(){});
    console.log(`BlockList: ${blockLists.domains}`);
  });
};

setTimeout(() => {
  document.getElementById("save").addEventListener("click", save);
}, 200);
displayBlockList();
