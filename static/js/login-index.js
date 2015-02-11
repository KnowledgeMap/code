$(document).ready(function (){
        //Django+Python中ajax的安全性
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

    function sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    $("button").click(function (){
        var __name = $(".username").val(),
            __pass = $(".pass").val(),
            __check = $("input[type=checkbox]").is(":checked");
        if(!__name || !__pass){
            if(!$(".error").length){
                var __x = $('<span class="help-block"><label class="error">用户名/Email或密码错误，请重新输入！</label></span>');
                __x.insertBefore('.form-signin');
            }
            return false;  
        }

        $.ajax({
            "type" : "POST",
            "data" : {username : __name, pass : __pass},
            "url"  : "/check/login/",
            // "url"  : "http://121.199.47.141/check/login/",
            success : function (data){
                if(data.flag == "succeed"){
                    var __time = __check ? 7 : 1;
                    $.cookie('yooyuName', __name, {expires: __time,path : '/'});
                    $.cookie('yooyuNameId', data.person_id, {expires: __time,path : '/'});
                    window.location.href="/";
                }
            },
            error : function (data){
                console.log(data);
                if(!$(".error").length){
                    var __x = $('<span class="help-block"><label class="error">用户名/Email或密码错误，请重新输入！</label></span>');
                    __x.insertBefore('.form-signin');
                }
                return false; 
            },
            "dataType" : "json"
        })
    });
});