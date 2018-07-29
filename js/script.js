chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if (request == "Action") {
        var rData = acquireRedmineData();
        console.log(rData);
        var cData = createTasWorldTicket(rData);
        console.log(cData);
        var cPromise = postAPI("https://asia-api.taskworld.com/v1/task.create", cData);
        cPromise.done(function(data){
            console.log("postAPI Create");
            console.log(data);
            return data;
        })
        .fail(function(){
            console.log("postAPI Error")
        });
        cPromise.then(function(data){
            console.log("postAPI Updata");
            console.log(data);
            var uData = updateTasWorldTicket(data, rData);
            console.log(uData);
            var uPromise = postAPI("https://asia-api.taskworld.com/v1/task.update", uData);
            uPromise.done(function(data){
                if(data.ret.ok){
                    alert("登録に成功しました");
                }
            }).fail(function(){
                alert("Errorが発生しました");
            })
        })
	}
});

function acquireRedmineData() {
    var rUrl = location.href;
    var tNum = rUrl.split("/");
    tNum = tNum[tNum.length - 1];
    var subject = $(".subject").text().replace(/\r?\n/g,"");
    var title = "#" + tNum + "「" + subject + "」";
    var attributeNum = $(".assigned-to a").attr("href").split("/");
    attributeNum = attributeNum[attributeNum.length - 1];
    var dueDate = $(".due-date .value").text().split("/");
    dueDate = dueDate[0] + "-" + dueDate[1] + "-" + dueDate[2] + "T10:00:00.000Z";
    var rData = {
        "rUrl": rUrl,
        "title": title,
        "attributeNum": attributeNum,
        "dueDate": dueDate
    }
    return rData;
}

function createTasWorldTicket(rData) {
        console.log("create start");
        var token = "737b94e89ce945494cb375c8a451ad7cde69845bf5b6b724c3c1ec7ffe310c2f";
        if(!token){
            alert("オプションでaccess tokenを取得してください。");
        };
        var pId = "5b5ad810b9c7c0fb58a5faeb";
        if(!pId){
            alert("オプションでaccess tokenを取得してください。");
        };
        var sId = "5b5ad7cc958142ac572ccabd";
        if(!sId){
            alert("オプションでaccess tokenを取得してください。");
        };
        var lId;
        switch(rData.attributeNum){
            case ("3"):
                lId = "5b5ad8109a98f946a7db3025";
                break;
            default:
                lId = "5b5ad8109a98f946a7db3023";
                break;       
        };
        var cData = {
            "access_token": token,
            "space_id": sId,
            "project_id": pId,
            "list_id": lId,
            "title": rData.title
        };
        console.log("create end");
        return cData;
}

function updateTasWorldTicket(data, rData) {
    console.log("update start");
    var token = "737b94e89ce945494cb375c8a451ad7cde69845bf5b6b724c3c1ec7ffe310c2f";
    if(!token){
        alert("オプションでaccess tokenを取得してください。");
    };
    var tId = data.ret.task.task_id;
    console.log(tId);
    if(!tId){
        alert("オプションでaccess tokenを取得してください。");
    };
    var sId = "5b5ad7cc958142ac572ccabd";
    if(!sId){
        alert("オプションでaccess tokenを取得してください。");
    };
    var uData = {
        "access_token": token,
        "space_id": sId,
        "task_id": tId,
        "description": rData.rUrl
    };
    if(rData.dueDate){
        uData["due_date"] = rData.dueDate;
    };
    console.log("update end");
    return uData;
}

function postAPI(url, sendData){
    var dfd = $.Deferred();
    chrome.runtime.sendMessage({method: "postAPI", url: url, sendData: sendData}, function(response){
        if(response){
            // console.log(response);
            dfd.resolve(response);
            // return response;
        }else{
            console.log("no response");
            reject();
        }
    });
    return dfd.promise();
};