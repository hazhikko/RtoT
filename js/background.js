(function() {
    chrome.runtime.onInstalled.addListener(function() {
        // Replace all rules ...
        chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
            // With a new rule ...
            chrome.declarativeContent.onPageChanged.addRules([
                {
                // That fires when a page's URL contains a 'g' ...
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { urlContains: redmineDomain },
                    })
                ],
                // And shows the extension's page action.
                actions: [ new chrome.declarativeContent.ShowPageAction() ]
                }
            ]);
        });
    });

    chrome.pageAction.onClicked.addListener(function(tab) {
        chrome.tabs.sendMessage(tab.id, "Action");
    });

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        console.log("background start");
        console.log(request.method);
        var ret;
        switch(request.method){
            case "setLocalStorage":
                localStorage.setItem(request.key, request.data);
                console.log(localStorage.getItem(request.key));
                sendResponse(true);
                return true;
                break;
            case "getLocalStorage":
                console.log(localStorage.getItem(request.key));
                sendResponse(localStorage.getItem(request.key));
                return true;
                break;
            case "postAPI":
                var xhr = new XMLHttpRequest();
                xhr.timeout=3000;
                xhr.open("POST", request.url);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.responseType = "json";
                xhr.onreadystatechange = function() {
                    switch (xhr.readyState){
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                            ret = xhr.response;
                            if(ret !== null){
                                console.log(ret);
                                sendResponse(ret);
                            }
                            break;
                    };
                };
                xhr.send(JSON.stringify(request.sendData));

                break;
            default:
            
                break;
        }
        console.log("background end");
        return true;        
    });
}).call(this);