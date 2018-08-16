var displayBlockList = function() {
  storage.get(blockList, function(blockList){
    document.getElementById("blockList").innerText = blockList.domains.join("\n");
  });
};

var save = function() {
  storage.get(blockList, function(blockList){
    var text = document.getElementById("blockList").value;
    var domains = text.split('\n').filter(domain => domain !== "");
    blockList.domains = domains;
    storage.set(blockList, function(){});
    console.log(`BlockList: ${blockList.domains}`);
  });
};

setTimeout(() => {
  document.getElementById("save").addEventListener("click", save);
}, 200);
displayBlockList();
