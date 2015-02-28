$(document).ready(function (){
    $("button").click(function (){
        reg();
    });

    $("#form").on('focus','input',function (){
        $("body").on('keydown',function (e){
            var e = e || event;        
            if(e.keyCode == 13){
                reg();
            }
        });
    });

    var reg = function (){

        var __name = $(".username").val(),
            __pass = $(".pass").val(),
            __email = $(".email").val(),
            __passAgain = $(".passAgain").val();

         var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
         $(".error").remove();
         $(".help-block").remove();
         if (!filter.test(__email)){
             if(!$(".error").length){
                var __x = $('<span class="help-block"><label class="error">邮箱格式不正确</label></span>');
                __x.insertBefore('.form-signin');
            }
            return false; 
         }
        if(__pass !== __passAgain){
             if(!$(".error").length){
                var __x = $('<span class="help-block"><label class="error">两次密码须一致</label></span>');
                __x.insertBefore('.form-signin');
            }
            return false;            
        }
        if(!__name || !__pass){
            if(!$(".error").length){
                var __x = $('<span class="help-block"><label class="error">用户名/Email或密码错误，请重新输入！</label></span>');
                __x.insertBefore('.form-signin');
            }
            return false;  
        }

        $.ajax({
            "type" : "POST",
            "data" : {username : __name, pass : __pass, email : __email, headImg : $(".imgface").attr("src")},
            // "url"  : "/check/reg/",
            "url"  : "http://121.199.47.141/check/reg/",
            success : function (data){
                if(data.flag === "succeed"){
                    $.cookie('yooyuName', __name, {expires: 7,path : '/'});
                    localStorage.setItem("headImage", $(".imgface").attr("src"));
                    window.location.href = "/";
                }else{
                    $(".help-block").remove();
                    var __x = $('<span class="help-block"><label class="error">'+data.info+'</label></span>');
                    __x.insertBefore('.form-signin');                    
                }
            },
            error : function (data){
                console.log(data);
                if(!$(".error").length){
                    $(".help-block").remove();
                    var __x = $('<span class="help-block"><label class="error">用户名/Email或密码错误，请重新输入！</label></span>');
                    __x.insertBefore('.form-signin');
                }
                return false; 
            },
            "dataType" : "json"
        })
    }

    $(".imgface").hover(function (){
        $(".shadow").css("display","block");
    })
    $(".form-signin").hover(function (){},function (){
        $(".shadow").css("display","none");
    })

    $(".shadow").on('click',function (){
        var __upload_box = $("<div class='upload'>\
                                <span class='glyphicon glyphicon-remove remove'></span>\
                                <input type='text' class='upload_text'>\
                                <input type='button' class='upload_input_block' value='浏览...'>\
                                <input type='file' class='upload_input_none'>\
                                <input type='button' class='upload_submit' value='上传'>\
                                <div class='min'></div>\
                                <div class='max'></div>\
                            </div>");
        $("body").append(__upload_box);
    });

    $("body").on('click','.upload_input_block',function (){
        $(".upload_input_none").click();
    });

    $('body').on('change','.upload_input_none',function (e){
        var str = $(this).val()
        $(".upload_text").val(str);
        var resultFile = $(".upload_input_none")[0].files[0];
        if(resultFile){
            var reader = new FileReader();
            reader.readAsDataURL(resultFile);
            reader.onload = function (){
                urlData = this.result
                $(".min,.max").find('img').remove().end().append($("<img class='imgfaceOfUpload' src='"+urlData+"'>"));
            }
        }
    }).on('click','.remove',function (){
        $(this).parent().remove();
    })

    $("body").on('click','.upload_submit',function (){
        $(".upload").remove();
        urlData ? $(".imgface").attr("src",urlData) : "";
    })
});