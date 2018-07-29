$(document).ready(function(){
    $("#email").val(Cookies.get("email"));
    $("#password").val(Cookies.get("password"));
    $("#token").html(Cookies.get("token"));
    console.log("読み込み完了");
});

$(function(){
    $("#submit").on("click",function(){
        console.log("start");
        Cookies.set("email",$("#email").val());
        Cookies.set("password",$("#password").val());
        Cookies.set("pId",$("#pId").text());
        Cookies.set("sId",$("#sId").text());
        alert("start");
        var sentData = {
            "email": $("#email").val(),
            "password": $("#password").val()
        };
        $.post(
            "https://asia-api.taskworld.com/v1/auth",
            sentData
        ).done(function(data){
            console.log(data);
            Cookies.set("token",data.access_token);
            $("#token").html(Cookies.get("token"));
        }).fail(function(){
            console.log("失敗しました");
        }).always(function(){
            console.log("終了しました");
        });
    })
});