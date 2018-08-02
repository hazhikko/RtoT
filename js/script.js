
/**
 * Chromeのextensionボタンがクリックされたときに発火するListener
 * 
 */
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if (request == "Action") {
        var rData = acquireRedmineData();
        console.log("redmineから取得した情報");
        console.log(rData);
        var accessToken;
        var gPromise = getLocalStorage("token");
        gPromise.done(function(data){
            console.log("Task Createの実行結果");
            console.log(data);
            accessToken = data;
            return data;
        })
        .fail(function(){
            console.log("tokenの取得に失敗しました")
        });

        gPromise.then(function(){
            var cData = createTasWorldData(rData, accessToken);
            console.log("Task Createに使用する情報");
            console.log(cData);
            var cPromise = postAPI(apiUrl.taskCreate, cData);
            cPromise.done(function(data){
                console.log("Task Createの実行結果");
                console.log(data);
                return data;
            })
            .fail(function(){
                console.log("Task Createに失敗しました")
            });
            cPromise.then(function(resCreateData){
                var uData = updateTasWorldData(resCreateData, rData, accessToken);
                console.log("Task Updateに使用する情報");
                console.log(uData);
                var uPromise = postAPI(apiUrl.taskUpdate, uData);
                uPromise.done(function(resUpdateData){
                    console.log("Task Updateの実行結果");
                    console.log(resUpdateData);
                    if(resUpdateData.ok){
                        alert("登録に成功しました");
                    }
                }).fail(function(){
                    console.log("Task Updateに失敗しました")
                    alert("Errorが発生しました");
                })
            })
        })        
	}
});

/**
 * BackLogから必要な情報を収集する
 * @returns {object} bData BackLogTicketのurl,title,担当者番号,期日
 */
function acquireRedmineData() {
    var rUrl = location.href;
    var tNum = rUrl.split("/");
    tNum = tNum[tNum.length - 1];
    var subject = $(".subject").text().replace(/\r?\n/g,"");
    var title = "#" + tNum + "「" + subject + "」";
    var attributeNum;
    try {
        attributeNum = $(".assigned-to a").attr("href").split("/");
        attributeNum = attributeNum[attributeNum.length - 1];
    }
    catch (e) {
        attributeNum = "";
    }
    var dueDate;
    try {
        dueDate = $(".due-date .value").text();
        // Redmineの作りによって区切り文字が違うようなので分岐
        if(dueDate.indexOf("/") != -1){
            dueDate = dueDate.split("/");
            dueDate = dueDate[0] + "-" + dueDate[1] + "-" + dueDate[2] + "T10:00:00.000Z";
        }else if(dueDate.indexOf("-") != -1){
            dueDate = dueDate + "T10:00:00.000Z";
        }
    }
    catch (e) {
        attributeNum = "";
    }
    
    var rData = {
        "rUrl": rUrl,
        "title": title,
        "attributeNum": attributeNum,
        "dueDate": dueDate
    }
    return rData;
}

/**
 * TaskWorldのtask.create実行時に使用するデータの作成
 * @param {object} rData acquireRedmineData()で収集したredmineの情報
 * @return {object} cData task.createに渡すデータ
 */
function createTasWorldData(rData, accessToken) {
        if(!accessToken){
            alert("オプションでaccess tokenを取得してください。");
        };
        var pId = userData.pId;
        var sId = userData.sId;
        var lId;
        switch(rData.attributeNum){
            case ("3"):
                lId = userData.lId.ito;
                break;
            default:
                lId = userData.lId.default;
                break;       
        };
        var cData = {
            "access_token": accessToken,
            "space_id": sId,
            "project_id": pId,
            "list_id": lId,
            "title": rData.title
        };
        return cData;
}

/**
 * TaskWorldのtask.update実行時に使用するデータの作成
 * @param {object} resCreateData acquireRedmineData()で収集したredmineの情報
 * @param {object} rData acquireRedmineData()で収集したredmineの情報
 * @return {object} cData task.updateに渡すデータ
 */
function updateTasWorldData(resCreateData, rData, accessToken) {
    var tId = resCreateData.task.task_id;
    var sId = userData.sId;
    var uData = {
        "access_token": accessToken,
        "space_id": sId,
        "task_id": tId,
        "description": rData.rUrl
    };
    if(rData.dueDate){
        uData["due_date"] = rData.dueDate;
    };
    return uData;
}
