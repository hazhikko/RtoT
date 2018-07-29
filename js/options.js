$(document).ready(function(){
    $("#email").val(Cookies.get("email"));
    $("#password").val(Cookies.get("password"));
    $("#token").html(userData.token);
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
            console.log(data);
            Cookies.set("token",data.access_token);
            $("#token").html(Cookies.get("token"));
        }).fail(function(){
            console.log("認証情報の取得に失敗しました");
        }).always(function(){
            console.log("認証情報の取得を終了しました");
        });
    })
});