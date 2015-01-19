/*
/*新手指引，查看并设置cookie
*/

var cookieEvent = {
    getCookie : function (){
        this.cookie = document.cookie;
        this.flag = false;
        this.tempArray = this.cookie.split(/;\ +/);
        for(var i = 0; i < this.tempArray.length; i++){
            var x = this.tempArray[i].split("=");
            if(x[0] == "yooyu"){
                return false;
            }
            
            if(x[0] == "csrftoken"){
                this.flag = true;
            }
        }

        if(!this.flag){
            console.log("title");
            window.location.href = "/accounts/login";
            return false;
        }

        this.setCookie();
    },

    setCookie : function (){
        //console.log('have not the cookie');
        var date=new Date(); 
        var expiresDays=10000; 
        date.setTime(date.getTime()+expiresDays*24*3600*1000); 

        var x = "yooyu=true; expires="+date.toGMTString()+"; " + document.cookie;
      
        document.cookie = x;
       
        setTimeout(function(){
            guide.init();
        },800);
    },
    init      : function (){
        this.getCookie();
    }
}

var guide = {
    cssObject   :{
                "position"      :"absolute",
                "width"         :"300px",
                "height"        :"100px",
                "margin-left"   :"-150px",
                "margin-top"    :"-50px",
                "left"          :"50%",
                "top"           :"50%",
                "background"    :"rgba(0,0,0,0.7)",
                "color"         :"#fff",
                "border-radius" :"5px",
                "-o-border-radius" :"5px",
                "-moz-border-radius" :"5px",
                "-webkit-border-radius" :"5px",
                "line-height"   :"100px",
                "text-align"    :"center",
                "font-weight"   :"bold",
                "font-size"     :"30px"
    },
    once        : function(fn){
                    return function (){
                        try{
                            fn.apply(this,arguments);
                        }catch(e){
                            console.log(e);
                        }finally{
                            fn = null;
                        }
                    };
    },
    dbclick     : function (){
        var __x = $("<div class='guide-dbclick'>双击创建新节点</div>");
            __x.css(this.cssObject);
        $("body").append(__x);
        $("svg").on('click',function (){
            setTimeout(function (){            
               __x.fadeOut('800', function() {
                   __x.remove();
               }); 
            },500);
        });

        this.chooseNode();
    },
    chooseNode : function (){
        var __x = setInterval(function (){
            var __len = $("g").length;
            if(__len == 2){
                __reminde();
                clearInterval(__x);
            }
        },100);
        var __reminde = function (){
                setTimeout(function (){
                    __attaction(0,"单击查看详细信息");
                },600);   
        };
        var __attaction = function (i,content){
            var __get = function (i){
                var __dom    = $($("g")[i]).find("rect")[0],
                __result = __dom.getAttribute("transform"),
            //result = translate(676.7889971155253,203.86155358846833)
                __translate = __result.replace(/translate\(/,"").replace(/\)/,"").replace(/\,/," "),
                __xx =     __translate.split(/\ +/)[0],
                __yy =     __translate.split(/\ +/)[1];
                return {
                    x : __xx,
                    y : __yy,
                    dom : __dom
                }
            }
            var __g1 = __get(i),
                __title = $("<div class='title'>"+ content +"</div>");
                __title.css({
                    "position" : "absolute",
                    "z-index"  : "333",
                    "width"    : "300px",
                    "height"   : "50px",
                    "line-height" : "50px",
                    "text-align" : "center",
                    "left"     : __g1.x - 130 + "px",
                    "top"      : __g1.y - 10 + "px",
                    "background" : "rgba(0,0,0,0.7)",
                    "color"     : "#fff",
                    "border-radius" :"5px",
                    "-o-border-radius" :"5px",
                    "-moz-border-radius" :"5px",
                    "-webkit-border-radius" :"5px"
                });

            $("body").append(__title);

            $(__g1.dom).on('click',function (){
                __title.remove();
                i++;
                if(i > 1){
                    guide.timeLine();
                    return false;
                }else{
                    __attaction(i,"双击该节点，建立关系");
                }
            });
        }
    },
    timeLine    : function (){
        var __mind = $("<div class='guide-title'>点击返回历史步骤</div>");
            __mind.css({
                "position" : "absolute",
                "z-index"  : "333",
                "left"     : "50px",
                "top"      : "50%",
                "border-radius" :"5px",
                "-o-border-radius" :"5px",
                "-moz-border-radius" :"5px",
                "-webkit-border-radius" :"5px",
                "width"     : "150px",
                "height"   : "30px",
                "color"     : "#fff",
                "line-height" : "30px",
                "background":"rgba(0,0,0,0.7)",
                "text-align"  : "center"
            });

        $("body").append(__mind);

        __mind.on('click',function (){
            setTimeout(function (){
                __mind.remove();
                guide.welcome();
            },500);
        });

        $("body,#timeLine").on('click',function (){
            $(".guide-title").remove();
        });
    },
    init        : function (){
        this.dbclick();
    }
}

cookieEvent.init();