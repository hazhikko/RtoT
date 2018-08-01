$(document).ready(function(){
    $("#email").val(Cookies.get("email"));
    $("#password").val(Cookies.get("password"));
    $("#token").html(Cookies.get("token"));
    console.log("読み込み完了");
});

$(function(){
    $("#submit").on("click",function(){
        Cookies.set("email",$("#email").val());
        Cookies.set("password",$("#password").val());
        var sentData = {
            "email": $("#email").val(),
            "password": $("#password").val()
        };
        $.post(
            apiUrl.auth,
            sentData
        ).done(function(data){
            console.log("Task Createの実行結果");
            console.log(data);
            Cookies.set("token",data.access_token);
            var promise = setLocalStorage("token", data.access_token);
            promise.done(function(data){
                if(data){
                    alert("認証情報の取得に成功しました");
                    console.log(data);
                    $("#token").html(Cookies.get("token"));
                    return data;
                }
            })
            .fail(function(){
                console.log("Task Createに失敗しました")
            });
            
        }).fail(function(){
            console.log("認証情報の取得に失敗しました");
        }).always(function(){
            console.log("認証情報の取得を終了しました");
        });
    })
});