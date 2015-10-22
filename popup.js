chrome.extension.onMessage.addListener(function(request, sender) {
  if (request.action == "analyzePage") {
	var result = '';
	if(request.source){
		for(var i = 0; i < request.source.length; i++){
			var item = request.source[i];
            
            result += '<li>';
            if(item.label) result += '<div class="label">' + item.label + '</div>';
            if(item.result) result +='<div class="result">' + item.result + '</div>';
            if(item.description) result += '<div class="description">' + item.description + (item.icon ? '<div class="icon ' + item.icon + '"></div>' : '') + '</div>';
            result += '</li>';
            
		}
	}
	document.getElementById('maincontent').innerHTML = result;
  }
});

function onWindowLoad() {
  chrome.tabs.executeScript(null, {
    file: "analyzer.js"
  }, function() {
    if (chrome.extension.lastError) {
      document.getElementById('maincontent').innerHTML = 'Error : <br />' + chrome.extension.lastError.message;
    }
  });
}
window.onload = onWindowLoad;