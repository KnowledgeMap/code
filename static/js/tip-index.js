var svg_width = $("#kmap-overview").width(),
    svg_height = $("#kmap-overview").height(),
    scaleX = svg_width,
    scaleY = svg_height,
    posX = 0,
    posY = 0,
    scale = 1,
    flag = false,
    string = '<li data-url="{url}"><span class="title">{name}</span><span>{brief}</span></li>',
    svgEvent = {
        "temp" : []
    },
    higShowVar = [];

$("svg").attr('width',svg_width+"px").attr('height',svg_height+"px");

document.getElementById("svg").setAttribute('viewBox','0,0,' + scaleX+"," + scaleY);

var strFormatObj = function (){
    if((arguments.length <= 0) || (typeof arguments[0] != "string"))
        return null;
    var value = arguments[0],result="";
    for(var i in arguments[1]){
        for(var key in arguments[1][i]){
            var reg = new RegExp('\\{'+ key +'\\}','m');
            value = value.replace(reg, arguments[1][i][key])
        }
        result += value;
        value = arguments[0];
    }
    return result;
};

var color = d3.scale.category20();//设置20种颜色类别

var svg = d3.select("svg");

$(".add").bind('click',function (){
    posX += 40,
    posY += 40;
    xxx = scaleX - posX * 2,
    yyy = scaleY - posY * 2;
    if(xxx < 0 || yyy < 0){
        alert("已到达最大缩放比例!");
        return false;
    }
    $(".scale").html('缩放比例 X ' + (scaleX / xxx).toFixed(1));
    setTimeout(function(){$(".scale").html('')},1500);
    document.getElementById("svg").setAttribute('viewBox',posX+','+posY+','+xxx+','+yyy+'');
});

$(".min").bind('click',function (){
    posX -= 40,
    posY -= 40;
    xxx = scaleX - posX * 2,
    yyy = scaleY - posY * 2;
    $(".scale").html('缩放比例 / ' + (scaleX / xxx).toFixed(1));
    setTimeout(function(){$(".scale").html('')},1500);
    document.getElementById("svg").setAttribute('viewBox',posX+','+posY+','+xxx+','+yyy+'');
});

$(".openlist").click(function (){
    if(!flag){
        $("#kmap-overview").animate({"left":"20%"},200);
        $("#list").animate({"width":"20%"},200);
        $("#list > ul > li").css("borderBottom","1px solid #000");
    }else{
        $("#kmap-overview").animate({"left":"0%"},200);
        $("#list").animate({"width":"0%"},200);
        $("#list > ul > li").css("borderBottom","none");    
    }
    flag = !flag;
});

$("svg").on('click',function (e){
    var dom = $(e.target).parent(),
        rect = dom.find('rect'),
        inner = rect.attr("group");

    if(e.target.tagName == "svg"){
        var x = $('g').find('rect');
        for(var i = 0; i < x.length; i++){
            $(x[i]).attr('class','rect');
        }
        svgEvent.temp = [];
        $(".path").css("stroke","green");
        changeMarker($(".path"));
        return;
    }
    if(rect.attr('class').indexOf("clickedG") < 0) {    
        rect.attr('class',rect.attr('class')+" clickedG");
        svgEvent.temp.push(Number(inner));
    }else{
        rect.attr('class','rect');
        $(".path").css("stroke","green");
        changeMarker($(".path"));
        for(var i = 0; i < svgEvent.temp.length; i++){
            if(svgEvent.temp[i] == Number(inner)){
                svgEvent.temp.splice(i, 1);
            }
        }
    }

    //高亮显示选定的边
    higShow(svgEvent.temp);
});

function higShow(arr){
    if(arr.length <= 1)
        return;
    if(higShowVar.length <= 0)
        return;
    var re = arr.sort();

    $(".path").filter(function (){
        var flag = false;
        for(var i = 0; i < re.length; i++){
            if(re[i] == $(this).attr("source"))
                flag = true;
        }
        return flag;
    }).filter(function (){
        var flag = false;
        for(var i = 0; i < re.length; i++){
            if(re[i] == $(this).attr("target")){
                flag = true;
            }
        }
        return flag;
    }).filter(function (){
        if(!$(this).attr("refer")){
            changeMarkerCompare(this);
            return true;
        }else{
            if(($(this).attr("offset") != "both") && $(this).attr("marker-start") && $(this).attr("marker-end")){
                
                for(var i = 0; i < re.length; i++){
                    if(re[i] == $(this).attr("refer")){
                        changeMarkerCompare(this);
                        return true;
                    }
                }

                changeMarkerCompareSingle(this);
                return true;
            }
            else{
                var flag = false;
                for(var i = 0; i < re.length; i++){
                    if(re[i] == $(this).attr("refer")){
                        flag = true;
                        changeMarkerCompare(this);
                    }
                }
                return flag;
            } 
        }
    }).css("stroke","#f00");
}

function changeMarker(dom){
        var x = dom;
        for(var i = 0; i < x.length; i++){
            if($(x[i]).attr("marker-start")){
                $(x[i]).attr("marker-start","url(#start)");
            }
            if($(x[i]).attr("marker-end")){
                $(x[i]).attr("marker-end","url(#end)");
            }
        }
}
function changeMarkerCompare(path){
    if($(path).attr("marker-end")){
        $(path).attr("marker-end","url(#end-red)");
    }
    if($(path).attr("marker-start")){
        $(path).attr("marker-start","url(#start-red)");
    }       
}

function changeMarkerCompareSingle(path){
    var x = $(path).attr("offset");
    switch(x){
        case "end"      : $(path).attr("marker-start","url(#start-red)");break;
        case "start"    : $(path).attr("marker-end","url(#end-red)");break;
    }
}

function loading(links,nodes){
    var group = 0;
   // d3.json(data, function(svgEvent,error) {
        var newLink = [];
        var links = links,
            nodes = nodes;
        for(var i = 0; i < links.length; i++){
            var tempdata = links[i].path.split("_");
                tempdata[1] = Number(tempdata[1]),
                tempdata[2] = Number(tempdata[2]);
            if(tempdata[3]) tempdata[3] = Number(tempdata[3]);
            switch(Number(tempdata[0])){
                case 1011 : newLink.push(new Object({source : tempdata[1], target : tempdata[2], refer : "", two : 0})) ; break;
                case 1001 : newLink.push(new Object({source : tempdata[1], target : tempdata[2], refer : "", two : 1})) ; break;
                case 11101111 : newLink.push(new Object({source : tempdata[1], target : tempdata[3], refer : tempdata[2], two : 0, offset : "end"})); newLink.push(new Object({source : tempdata[2], target : tempdata[3], refer : tempdata[1], two : 0, offset : "end"})) ; newLink.push(new Object({source : tempdata[1], target : tempdata[2], display : "none"})) ; break;
                case 11001011 : newLink.push(new Object({source : tempdata[1], target : tempdata[2], refer : tempdata[3], two : 0, offset : "end"})); newLink.push(new Object({source : tempdata[3], target : tempdata[2], refer : tempdata[1], two : 1, offset : "end"})) ; newLink.push(new Object({source : tempdata[1], target : tempdata[3], display : "none"})) ; break;
                case 11100001 : newLink.push(new Object({source : tempdata[1], target : tempdata[3], refer : tempdata[2], two : 1, offset : "end"})); newLink.push(new Object({source : tempdata[2], target : tempdata[3], refer : tempdata[1], two : 1, offset : "end"})) ; newLink.push(new Object({source : tempdata[1], target : tempdata[2], display : "none"})) ; break;
                case 11101011 : newLink.push(new Object({source : tempdata[1], target : tempdata[2], refer : tempdata[3], two : 0, offset : "both"})); newLink.push(new Object({source : tempdata[1], target : tempdata[3], refer : tempdata[2], two : 0, offset : "both"})) ; newLink.push(new Object({source : tempdata[2], target : tempdata[3], refer : tempdata[1], two : 1, offset : "both"})); break;
                case 11101001 : newLink.push(new Object({source : tempdata[1], target : tempdata[3], refer : tempdata[2], two : 1, offset : "both"}));   newLink.push(new Object({source : tempdata[1], target : tempdata[2], refer : tempdata[3], two : 1, offset : "both"})) ;   newLink.push(new Object({source : tempdata[2], target : tempdata[3], refer : tempdata[1], two : 1, offset : "both"})); break;
            }
        }

        higShowVar = newLink;

        for(var i = 0; i < nodes.length; i++){
            nodes[i].group = group++;
        }

        force = d3.layout.force()
                    .nodes(d3.values(nodes))
                    .links(newLink)
                    .size([svg_width, svg_height])
                    .linkDistance( 150 )
                    .charge(-650)
                    .on("tick", tick)
                    .start();

        var path = svg.selectAll(".path")
            .data(newLink)
            .enter().append("path")
            .attr("class", function (d){return d.display ? "none" : "path";})
            .attr("marker-end",function (d){return d.display ? "" : "url(#end)";})
            .attr("marker-start",function (d){if(d.two > 0) return "url(#start)";})
            
        var nodes = svg.selectAll('g')
                        .data(force.nodes())
                        .enter()
                        .append('g')
                        .attr("name",function (d){return d.name})
                        .call(force.drag);

        var rect = nodes.append('rect')
                        .attr('class','rect')
                        .attr('width',30)
                        .attr('height',30)
                        .attr('rx',30)
                        .attr("group",function (d){return d.group});

        var text = nodes.append("text")
                        .attr('class', 'text')
                        .attr('width' , 30)
                        .attr('height' , 30)
                        .text(function (d){return "A"});
        svg.append("defs")
                            .append("marker")
                            .attr("id", "end")
                            .attr("viewBox", "0 -5 10 10")
                            .attr("refX", 11)
                            .attr("refY", 0)
                            .attr("markerWidth", 6)
                            .attr("markerHeight", 6)
                            .attr("orient", "auto")
                            .append("path")
                            .attr("d", "M0,-3L7,0L0,3")
                            .attr("fill","green");
        svg.append("defs")
                            .append("marker")
                            .attr("id", "end-red")
                            .attr("viewBox", "0 -5 10 10")
                            .attr("refX", 11)
                            .attr("refY", 0)
                            .attr("markerWidth", 6)
                            .attr("markerHeight", 6)
                            .attr("orient", "auto")
                            .append("path")
                            .attr("d", "M0,-3L7,0L0,3")
                            .attr("fill","#f00");
        svg.append("defs")
                            .append("marker")
                            .attr("id", "start")
                            .attr("viewBox", "-7 -5 10 10")
                            .attr("refX", -11)
                            .attr("refY", 0)
                            .attr("markerWidth", 6)
                            .attr("markerHeight", 6)
                            .attr("orient", "auto")
                            .append("path")
                            .attr("d", "M0,-3L-7,0L0,3")
                            .attr("fill","green");
        svg.append("defs")
                            .append("marker")
                            .attr("id", "start-red")
                            .attr("viewBox", "-7 -5 10 10")
                            .attr("refX", -11)
                            .attr("refY", 0)
                            .attr("markerWidth", 6)
                            .attr("markerHeight", 6)
                            .attr("orient", "auto")
                            .append("path")
                            .attr("d", "M0,-3L-7,0L0,3")
                            .attr("fill","#f00");

        $("svg").on("mouseover",'g',function (){
            var x = this.getBoundingClientRect().left + document.documentElement.scrollLeft,
                y = this.getBoundingClientRect().top + document.documentElement.scrollTop - 50,
                div = document.createElement("div"),
                winW = window.innerWidth,
                winH = window.innerHeight,
                content = $(this).attr("name");
                content = content.replace(/\$/img,'')
            MathJax.Hub.Queue(function(){
                var math = MathJax.Hub.getAllJax("MathDiv")[0];
                MathJax.Hub.Queue(["Text", math, content]);
            });

            $(".floatDiv")[0].style.display = "block";
            $(".floatDiv")[0].style.left = x - 233 +"px";
            $(".floatDiv")[0].style.bottom = winH - 40 - y + "px";
        }).on("mouseout","g",function (){
            $(".floatDiv")[0].style.display = "none";
        });

    function tick() {
        path.attr("d", linkArc);          
        path.attr("source",function (d){return d.source.index});
        path.attr("target",function (d){return d.target.index});
        path.attr("refer", function (d){return d.refer ? d.refer.index : "";});
        path.attr("id" , function (d){return d.id});
        path.attr("eig", function (d){return d.eig});
        path.attr("offset",function (d){return d.offset});
        rect.attr("transform", transform);
        text.attr("transform", transformText);
    }

    function linkArc(d){
        if(d.display){
            return "M " + d.source.x + "," + d.source.y + " L " + d.target.x + "," + d.target.y;
        }
        if(d.refer != ""){
            resultObj = centerCirl( d.source.x, d.source.y, d.target.x, d.target.y, d.refer.x, d.refer.y, d.offset, 4);
            if(!isNaN(resultObj.ab_x)){
                if(d.offset == "end")
                    finall = "M " + d.source.x + "," + d.source.y + " L " + resultObj.ax + "," + resultObj.ay + " C "+ resultObj.ba_x+","+resultObj.ba_y + "  " + resultObj.ab_x + ","+resultObj.ab_y + "  " +resultObj.bx + ","+resultObj.by+" L " + resultObj.asx+"," + resultObj.asy;  
                if(d.offset == "start")
                    finall = "M " + resultObj.asx + "," + resultObj.asy + " L " + resultObj.ax + "," + resultObj.ay + " C "+ resultObj.ab_x+","+resultObj.ab_y + "  " + resultObj.ba_x + ","+resultObj.ba_y + "  " +resultObj.bx + ","+resultObj.by+" L " + d.target.x+"," + d.target.y;  
                if(d.offset == "both"){
                    finall = "M " + resultObj.asx + "," + resultObj.asy + " L " + resultObj.ax + "," + resultObj.ay + " C "+ resultObj.ab_x+","+resultObj.ab_y + "  " + resultObj.ba_x + ","+resultObj.ba_y + "  " +resultObj.bx + ","+resultObj.by+" L " + resultObj.adx+"," + resultObj.ady;  
                }
                return finall;
            }           
        }
        return "M " + d.source.x + "," + d.source.y + " L " + d.target.x + "," + d.target.y; 
    }

    function centerCirl(x1,y1,x2,y2,x3,y3,offset,d){
        var a = Math.sqrt(Math.pow((x2 - x3),2) + Math.pow((y2 - y3),2)),
            b = Math.sqrt(Math.pow((x1 - x3),2) + Math.pow((y1 - y3),2)),
            c = Math.sqrt(Math.pow((x1 - x2),2) + Math.pow((y1 - y2),2)),
            p = (a + b + c) / 2,
            S = Math.sqrt(p * (p - a) * (p - b) * (p - c)),
            r = ( 2 * S ) / (a + b + c) / 1.5,
            x0 = ( a * x1 + b * x2 + c * x3 ) / (a + b + c),
            y0 = ( a * y1 + b * y2 + c * y3 ) / (a + b + c),
            a_t_x = x0 + ( (x1 - x0) / Math.abs(x1 - x0) ) * (r / Math.sqrt( 1 + Math.pow((y0 - y1) / (x0 - x1),2))),
            a_t_y = y0 + ( (y1 - y0) / Math.abs(y1 - y0) ) * (r / Math.sqrt( 1 + Math.pow((x0 - x1) / (y0 - y1),2))),
            b_t_x = x0 + ( (x2 - x0) / Math.abs(x2 - x0) ) * (r / Math.sqrt( 1 + Math.pow((y0 - y2) / (x0 - x2),2))),
            b_t_y = y0 + ( (y2 - y0) / Math.abs(y2 - y0) ) * (r / Math.sqrt( 1 + Math.pow((x0 - x2) / (y0 - y2),2))),
            Sz = Szfun(x1,y1,x0,y0,x2,y2),
            varile_x = x2,
            varile_y = y2,
            varile_a_x = a_t_x,
            varile_a_y = a_t_y;
        if(offset == "end"){
            varile_x = x2,
            varile_y = y2,
            varile_a_x = a_t_x,
            varile_a_y = a_t_y;
            A_b_x = varile_x + ( Sz * (y0 - varile_y) * d ) / (2 * Math.abs(y0 - varile_y) * Math.sqrt(1 + Math.pow(( (varile_x - x0) / (varile_y - y0)),2)));
            A_b_y = varile_y - ( Sz * (x0 - varile_x) * d ) / (2 * Math.abs(x0 - varile_x) * Math.sqrt(1 + Math.pow(( (varile_y - y0) / (varile_x - x0)),2)));          
        }else if(offset == "start"){
            varile_x = x1,
            varile_y = y1,
            varile_a_x = b_t_x,
            varile_a_y = b_t_y; 
            A_b_x = varile_x - ( Sz * (y0 - varile_y) * d ) / (2 * Math.abs(y0 - varile_y) * Math.sqrt(1 + Math.pow(( (varile_x - x0) / (varile_y - y0)),2)));  
            A_b_y = varile_y + ( Sz * (x0 - varile_x) * d ) / (2 * Math.abs(x0 - varile_x) * Math.sqrt(1 + Math.pow(( (varile_y - y0) / (varile_x - x0)),2)));      
        }else{
            A_b_x = x1 - ( Sz * (y0 - y1) * d ) / (2 * Math.abs(y0 - y1) * Math.sqrt(1 + Math.pow(( (x1 - x0) / (y1 - y0)),2))),
            A_b_y = y1 + ( Sz * (x0 - x1) * d ) / (2 * Math.abs(x0 - x1) * Math.sqrt(1 + Math.pow(( (y1 - y0) / (x1 - x0)),2))),
            B_a_x = x2 + ( Sz * (y0 - y2) * d ) / (2 * Math.abs(y0 - y2) * Math.sqrt(1 + Math.pow(( (x2 - x0) / (y2 - y0)),2))),
            B_a_y = y2 - ( Sz * (x0 - x2) * d ) / (2 * Math.abs(x0 - x2) * Math.sqrt(1 + Math.pow(( (y2 - y0) / (x2 - x0)),2)));
        }

            m = (varile_y - y0) / (varile_x - x0),
            n_b = m * (x0 - A_b_x) + A_b_y - y0,
            A_b_x_t = ( (-m) * n_b + (varile_x - x0)/Math.abs(varile_x - x0) * Math.sqrt(Math.pow((m * r),2) - Math.pow(n_b,2) + Math.pow(r,2)) ) / (Math.pow(m,2) + 1) + x0,
            A_b_y_t = m * ((-m) * n_b +  (varile_x - x0)/Math.abs(varile_x - x0) * Math.sqrt(Math.pow((m * r),2) - Math.pow(n_b,2) + Math.pow(r,2)) ) / (Math.pow(m,2) + 1) + n_b + y0,
    
            sigema = 2 * Math.asin(Math.sqrt( Math.pow((A_b_x_t - varile_a_x), 2) + Math.pow((A_b_y_t - varile_a_y), 2) ) / (2 * r)),
            l = 4 * r *  ( 2* Math.sin(sigema / 2) - Math.sin(sigema)) / (3 * (1 - Math.cos(sigema)));

        if(offset == "end"){
            k_ab_x = A_b_x_t - ( (x2 - x0) / Math.abs(x2 - x0) ) * (l / Math.sqrt( 1 + Math.pow((y0 - y2) / (x0 - x2),2))),
            k_ab_y = A_b_y_t - ( (y2 - y0) / Math.abs(y2 - y0) ) * (l / Math.sqrt( 1 + Math.pow((x0 - x2) / (y0 - y2),2))),
            k_ba_x = a_t_x - ( (x1 - x0) / Math.abs(x1 - x0) ) * (l / Math.sqrt( 1 + Math.pow((y0 - y1) / (x0 - x1),2))),
            k_ba_y = a_t_y - ( (y1 - y0) / Math.abs(y1 - y0) ) * (l / Math.sqrt( 1 + Math.pow((x0 - x1) / (y0 - y1),2)));
            return {
                asx : A_b_x,
                asy : A_b_y,
                ax  : a_t_x,
                ay  : a_t_y,
                bx  : A_b_x_t,
                by  : A_b_y_t,
                ab_x : k_ab_x,
                ab_y : k_ab_y,
                ba_x : k_ba_x,
                ba_y : k_ba_y
            }
        }else if(offset == "start"){
            k_ab_x = A_b_x_t - ( (x1 - x0) / Math.abs(x1 - x0) ) * (l / Math.sqrt( 1 + Math.pow((y0 - y1) / (x0 - x1),2))),
            k_ab_y = A_b_y_t - ( (y1 - y0) / Math.abs(y1 - y0) ) * (l / Math.sqrt( 1 + Math.pow((x0 - x1) / (y0 - y1),2))),
            k_ba_x = b_t_x - ( (x2 - x0) / Math.abs(x2 - x0) ) * (l / Math.sqrt( 1 + Math.pow((y0 - y2) / (x0 - x2),2))),
            k_ba_y = b_t_y - ( (y2 - y0) / Math.abs(y2 - y0) ) * (l / Math.sqrt( 1 + Math.pow((x0 - x2) / (y0 - y2),2)));
            return {
                asx : A_b_x,
                asy : A_b_y,
                ax  : A_b_x_t,
                ay  : A_b_y_t,
                bx  : b_t_x,
                by  : b_t_y,
                ab_x : k_ab_x,
                ab_y : k_ab_y,
                ba_x : k_ba_x,
                ba_y : k_ba_y
            }
        }else if(offset == "both"){
            m1 = (y1 - y0) / (x1 - x0),
            n_b1 = m1 * (x0 - A_b_x) + A_b_y - y0,
            A_b_x_t = ( (-m1) * n_b1 + (x1 - x0)/Math.abs(x1 - x0) * Math.sqrt(Math.pow((m1 * r),2) - Math.pow(n_b1,2) + Math.pow(r,2)) ) / (Math.pow(m1,2) + 1) + x0,
            A_b_y_t = m1 * ((-m1) * n_b1 +  (x1 - x0)/Math.abs(x1 - x0) * Math.sqrt(Math.pow((m1 * r),2) - Math.pow(n_b1,2) + Math.pow(r,2)) ) / (Math.pow(m1,2) + 1) + n_b1 + y0,
    
            sigema = 2 * Math.asin(Math.sqrt( Math.pow((A_b_x_t - b_t_x), 2) + Math.pow((A_b_y_t - b_t_y), 2) ) / (2 * r)),
            l = 4 * r *  ( 2* Math.sin(sigema / 2) - Math.sin(sigema)) / (3 * (1 - Math.cos(sigema))),  

            m2 = (y2 - y0) / (x2 - x0),
            n_b2 = m2 * (x0 - B_a_x) + B_a_y - y0,
            A_b_x_t1 = ( (-m2) * n_b2 + (x2 - x0)/Math.abs(x2 - x0) * Math.sqrt(Math.pow((m2 * r),2) - Math.pow(n_b2,2) + Math.pow(r,2)) ) / (Math.pow(m2,2) + 1) + x0,
            A_b_y_t1 = m2 * ((-m2) * n_b2 +  (x2 - x0)/Math.abs(x2 - x0) * Math.sqrt(Math.pow((m2 * r),2) - Math.pow(n_b2,2) + Math.pow(r,2)) ) / (Math.pow(m2,2) + 1) + n_b2 + y0,

            k_ab_x = A_b_x_t - ( (x1 - x0) / Math.abs(x1 - x0) ) * (l / Math.sqrt( 1 + Math.pow((y0 - y1) / (x0 - x1),2))),
            k_ab_y = A_b_y_t - ( (y1 - y0) / Math.abs(y1 - y0) ) * (l / Math.sqrt( 1 + Math.pow((x0 - x1) / (y0 - y1),2))),
            k_ba_x = A_b_x_t1 - ( (x2 - x0) / Math.abs(x2 - x0) ) * (l / Math.sqrt( 1 + Math.pow((y0 - y2) / (x0 - x2),2))),
            k_ba_y = A_b_y_t1 - ( (y2 - y0) / Math.abs(y2 - y0) ) * (l / Math.sqrt( 1 + Math.pow((x0 - x2) / (y0 - y2),2)));

            return {
                asx : A_b_x,
                asy : A_b_y,
                adx : B_a_x,
                ady : B_a_y,
                ax  : A_b_x_t,
                ay  : A_b_y_t,
                bx  : A_b_x_t1,
                by  : A_b_y_t1,
                ab_x : k_ab_x,
                ab_y : k_ab_y,
                ba_x : k_ba_x,
                ba_y : k_ba_y
            }           
        }

    }
    function transform(d) {
        return "translate(" + (d.x - 15) + "," + (d.y - 15) + ")";
    }
    function transformText(d){
        return "translate(" + (d.x - 3) + "," + ( d.y + 3) + ")";
    }
    function Szfun(x1,y1,x2,y2,x3,y3){
        var result = ( x2 * (y3 - y1) + x1 * (y2 - y3) + x3 * (y1 - y2) ) / Math.abs(( x2 * (y3 - y1) + x1 * (y2 - y3) + x3 * (y1 - y2) ));
        return Number(result);
    }
}
//);
//}
$(document).ready(function (){

    $("#opea").on('click','.getFri',function (){
        if($(this).hasClass('getSearch')){
            $(".searchFri, .searchFriend").remove();
            $(this).removeClass('getSearch');
        }else{
            var __search = $("<input type='text' placeholder='好友名称' class='searchFri'/><span class='glyphicon glyphicon-search searchFriend'></span>");
            $(this).addClass('getSearch');
            $("#opea").append(__search);
        }
    });

    var __map_id = window.location.hash.split("=")[1];

    $.ajax({
        type : "POST",
        data : {map_id : __map_id},
        url  : "http://121.199.47.141/check/get_one_map/",
        success : function (data){
            //console.log(data);
            if(data.flag == "succeed"){
                var __infor = data.info[0],
                    __userid = $.cookie("yooyuNameId");
                if(!(__userid == __infor.person_id)){
                    var __content = $('<h4>'+__infor.map_name+'</h4><img class="head" src="/static/img/myface.jpg" width="168" height="168"><p>'+__infor.username+'</p><p><span class="thin talk">发送消息</span><span class="thin addFouce" data-id="10">+加关注</span></p><p class="last"><button class="order">申请加入仓库</button></p>');
                    $("#opea").append(__content);
                }else{
                    var __content = $('<h4>'+__infor.map_name+'</h4><img class="head" src="/static/img/myface.jpg" width="168" height="168"><p>'+__infor.username+'</p><p class="editLib"><button class="editThis">编辑仓库</button><button class="getFri">邀请好友</button></p>');
                    $("#opea").append(__content);     
                }

                loading(JSON.parse(__infor.links),JSON.parse(__infor.nodes));

                $("#opea").on('click','.editThis',function (){
                    window.location.href = '/kmap/edit/#mapid='+__infor.map_id;
                });

                $("#opea").on('click','.addFouce',function (){
                    var that = this;
                    $.ajax({
                        type : "POST",
                        data : {attention_user : __infor.person_id},
                        url  : "http://121.199.47.141/check/pay_attention/",
                        success : function (data){
                            if(data.flag == "succeed"){
                                $(that).html("以关注");
                            }
                        },
                        error : function (data){
                            console.log(data);
                        },
                        dataType : "json"
                    });
                });

                $("#opea").on('click','.talk',function (){
                    var that = this;
                    if(!$(this).hasClass('submit')){
                        var __xs = $('<span class="glyphicon glyphicon-remove removeSpan"></span><textarea class="commim" placeholder="输入消息"></textarea>');
                        __xs.insertBefore('.last');
                        $(this).html('发送').addClass('submit');
                        $(".removeSpan").on('click',function (){
                            $(that).removeClass('submit').html('发送消息');  
                            $(".commim,.removeSpan").remove();             
                        })
                    }else{
                        var __x = $(".commim").val();
                        $.ajax({
                            type : "POST",
                            data : {rec_user : __infor.person_id, content : __x},
                            url : 'http://121.199.47.141/check/send_message/',
                            success : function (data){
                                //console.log(data);
                                    if(data.flag == "succeed"){
                                        $(".commim,.removeSpan").remove();
                                        $(that).removeClass('submit').html('发送成功');
                                    }else{
                                         $(that).html('发送失败,请重试');
                                    }
                            },
                            error : function (data){
                                console.log(data);
                            },
                            dataType : "json"
                        });
                    }
                });

                $("#opea").on('click','.order',function (){
                    var __that = this;
                    $.ajax({
                        type : "POST",
                        data : {map_id : __map_id},
                        url : "http://121.199.47.141/check/join_map/",
                        success : function (data){
                            //console.log(data);
                            if(data.flag = "succeed"){
                                $(__that).html("申请成功 等待审核");
                            }
                        },
                        error : function (data){
                            console.log(data);
                        },
                        dataType : "json"
                    })
                });
            }
        },
        error : function (data){
            console.log(data);
        },
        dataType : "json"
    })
    
});
