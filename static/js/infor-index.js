$(document).ready(function (){
    var __location = window.location.hash.split("=")[1];
    $(".remind-li").filter(function (){
        var x = $(this).attr("data-url");
        return x == __location;
    }).addClass("active-remind-li");

    $(".list").filter(function (){
        var x = $(this).attr("data-url");
        return x == __location;
    }).addClass("listClick");

    $("#content").click(function (){
        $(".getResult").css("display","none");
    });
    $(".remind-li").click(function(){
        $(".remind-li").removeClass("active-remind-li");
        $(this).addClass("active-remind-li");
    });

    setTimeout(function(){
        $(".navbar-li").removeClass("active");
    },500);
    
});