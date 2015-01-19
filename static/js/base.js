$(document).ready(function (){
    var count = 0;
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?  
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    var csrftoken = getCookie('csrftoken');

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    $(".loadingModule").animate({"width":"100%"},500,function (){
       $(this).fadeOut();
    });


    $(".searchIcon").click(function (){
        $.ajax({
            type : "POST",
            url : "/kmap/search",
            data : {searchContent : $(".search").val()},
            success : function (data){

            },
            error : function (err){

            },
            dataType : "json" 
        });
    });

    $(".lateX-list-liContent").click(function (){
        $(".lateX-list-liContent").removeClass("actives");
        $(this).addClass("actives");
        var x = $(this).attr("data-name");
        $(".showTableContent").removeClass('show').css("display","none");
        $(".showTableContent").filter(function (){
            return $(this).hasClass(x);
        }).css("display","block");
    });

    $("#lateXContent img").click(function (){
        var x = $(this).attr("alt");
        $("#MathInputSearch").val($("#MathInputSearch").val() + "$" + x + "$").trigger("input").focus();
    });

    var searchLeft = Number($(".nav").css("width").replace(/px/,'')) + Number($(".navbar-header").css("width").replace(/px/,'')) + 20 ;
    $("#search").css("left",searchLeft+ "px");

    $(".sum").click(function (){
       var x = $(window).height();
       $("#search").css({"position":"absolute","zIndex":333}).animate({"left":0,"width":"100%","height":"500px"},700).css("background-color","#eee");
       $(".scaleIcon").css("visibility","visible");
       $("#lateXContent").css("left","100px").css("display","inline-block");
       $("#rightSearch").css('display',"inline-block");
       var content = $(".search").html();
        $("#MathInputSearch").val(content).on('input',function (){
             Preview.Update();
             $(".search").html($(this).val());
             count++;
             if(count % 70 == 0){
                $(this).val($(this).val() + '\r\n');
             }
        });
    });

    $(".scaleIcon,.searchIcon").click(function (){
        $("#lateXContent").css({"display":"none"});
        $("#search").animate({"left":searchLeft + "px","width":"350px","height":"50px"},700).css("background-color","#f8f8f8");
        $(".scaleIcon").css("visibility","hidden");
        $(".search").css("border","none");
       $("#rightSearch").css("display","none");
    });

    $(".singOut").click(function (){
            this.cookie = document.cookie;
            this.tempArray = this.cookie.split(/;\ +/);
            for(var i = 0; i < this.tempArray.length; i++){
                var x = this.tempArray[i].split("=");                
                if(x[0] == "csrftoken"){
                    x[1] = "";
                }
            }
    });

    $(".newList").click(function (){
        var __content = $(this).attr("data-role"),
            __urlId   = $(this).attr("data-url"),
            __x = this.getBoundingClientRect().left + document.documentElement.scrollLeft - 300 + 50,
            __y = this.getBoundingClientRect().top + document.documentElement.scrollTop + 50;
        $(".newList").removeClass("listClick");
        $(this).addClass("listClick");
        $(".titles").html(__content);
        $(".remind").html("全部"+__content).attr("href","/kmap/infor#id="+__urlId);
        $(".getResult").css({"left":__x+"px","display":"block"});
    });

    $("svg").click(function (){
        $(".newList").removeClass("listClick");
        $(".getResult").css("display","none");
    });  

    $(".know-button").click(function (){
        $(".newList").removeClass("listClick");
        $(".getResult").css("display","none");       
    });

    var __contentId = window.location.hash.split("=")[1];

    if(!__contentId){
        $(".navbar-li").first().addClass("active");
    }else{
        $(".navbar-li").filter(function (){
            var x = $(this).attr("data-id");
            return x == __contentId;
        }).addClass("active");
    }
});