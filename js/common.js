/**
 * LocalStorageの登録
 * @param {string} key 登録key
 * @param {string} data 登録情報
 * @return {promise} dfd.promise() 
 */
function setLocalStorage(key, data){
    var dfd = $.Deferred();
    chrome.runtime.sendMessage({method: "setLocalStorage", key: key, data: data}, function(response){
        if(response){
            dfd.resolve(response);
        }else{
            console.log("LocalStorageの登録に失敗しました");
            reject();
        }
    });
    return dfd.promise();
}

/**
 * LocalStorageの取得
 * @param {string} key 取得key
 * @return {promise} dfd.promise() 
 */
function getLocalStorage(key){
    var dfd = $.Deferred();
    chrome.runtime.sendMessage({method: "getLocalStorage", key: key}, function(response){
        if(response){
            dfd.resolve(response);
        }else{
            console.log("LocalStorageの取得に失敗しました");
            reject();
        }
    });
    return dfd.promise();
}