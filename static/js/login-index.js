$(document).ready(function (){

        /*
            ff下刷新页面上一次input值不会消失
        */
        $("input").val('');

    $("button").click(function (){

        var __name = $(".username").val(),
            __pass = $(".pass").val(),
            __check = $("input[type=checkbox]").is(":checked"),
            __that = this;
            
        if(!__name || !__pass){
            if(!$(".error").length){
                var __x = $('<span class="help-block"><label class="error">用户名/Email或密码错误，请重新输入！</label></span>');
                __x.insertBefore('.form-signin');
            }
            return false;  
        }

        login(__name,__pass,__check,__that);
    });

    $("input").on('focus',function (){
        $("body").on('keydown',function (e){
            var e = e || event;     
            if(e.keyCode == 13){  
                var __name = $(".username").val(),
                __pass = $(".pass").val(),
                __check = $("input[type=checkbox]").is(":checked"),
                __that = this;
                if(!__name || !__pass){
                    if(!$(".error").length){
                        var __x = $('<span class="help-block"><label class="error">用户名/Email或密码错误，请重新输入！</label></span>');
                        __x.insertBefore('.form-signin');
                    }
                    return false;  
                }

                login(__name,__pass,__check,__that);
            }
        })
    })

    var login = function(__name,__pass,__check,__that){
        $.ajax({
            "type" : "POST",
            "data" : {username : __name, pass : __pass},
            // "url"  : "/check/login/",
            "url"  : "http://121.199.47.141/check/login/",
            success : function (data){
                if(data.flag == "succeed"){
                    var __time = __check ? 7 : 1;
                    $.cookie('yooyuName', __name, {expires: __time,path : '/'});
                    $.cookie('yooyuNameId', data.person_id, {expires: __time,path : '/'});
                    localStorage.setItem("headImage", data.headImg);
                    window.location.href="/";
                }else{
                    $(".help-block").remove();
                    var __x = $('<span class="help-block"><label class="error">用户名/Email或密码错误，请重新输入！</label></span>');
                    __x.insertBefore('.form-signin');   
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
    }
});