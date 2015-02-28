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
        // url  : "/check/get_one_map/",
        url  : "http://121.199.47.141/check/get_one_map/",
        success : function (data){
            if(data.flag == "succeed"){
                var __infor = data.info[0],
                    __userid = $.cookie("yooyuNameId");
                if(!(__userid == __infor.person_id)){
                    var __content = $('<h4>'+__infor.map_name+'</h4><img class="head" src="data:image/jpeg;base64,/9j/4QDdRXhpZgAASUkqAAgAAAAIABIBAwABAAAAAQAAABoBBQABAAAAbgAAABsBBQABAAAAdgAAACgBAwABAAAAAgAAADEBAgAVAAAAfgAAADIBAgAUAAAAkwAAABMCAwABAAAAAQAAAGmHBAABAAAApwAAAAAAAABgAAAAAQAAAGAAAAABAAAAQUNEIFN5c3RlbXMgyv3C67PJz/EAMjAxMzowNzowNyAxMDozNzowNAADAJCSAgAEAAAANjc4AAKgBAABAAAAqAAAAAOgBAABAAAAqAAAAAAAAAAAAAAA/8AAEQgAqACoAwEhAAIRAQMRAf/bAIQAAgEBAQEBAgEBAQICAgIDBQMDAgIDBgQEAwUHBgcHBwYHBggJCwkICAoIBgcKDQoKCwwMDQwHCQ4PDgwPCwwMDAEDAwMEAwQIBAQIEgwKDBISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhIS/8QArQAAAQIHAQAAAAAAAAAAAAAACQcIAAIDBAUGCgEQAAECBQIDBQQGBQcKBwEAAAIDBAAFBgcSAQgTIjIJEUJSYhQhcoIVMTNBkqIKIyRDshYXUWFjwtIYJSY0U4ORo7HwNXFzgZOh0eIBAAIDAQEBAAAAAAAAAAAAAAQFAgMGAQAHEQACAgICAQIGAQQDAQAAAAAAAQIDBBEFEiEiMQYTIzIzQRRCcbHwFVFSYf/aAAwDAQACEQMRAD8ATHZO4Begpm111+ycD/DBCdpIpqSMQhZyHjIY0xvxIXEU/v0/6xKoGJeaB4l8S1WRy079NIo8P1x473JXGugjrrqPf3xh5/PpRT7M5nP5q1Ytk+bVZ0oKQ4/NrE4Q7SKrJiE3S7SfZrbvVRpNbut3zlP628nSJcvywPrtRd71N7w6akNI2Zt3USzaUrEqq+mCQoCt5cR6oY4+FtoFtyloZhIqOuJKqjRnqlGOCFMhIh4mnNBTto/bFW0tDbGV23uFYurmhswxJ0jgYl+GDbOO7IXq7yOetX2umya5T9KVHcNannK3KCdQNySyLy5dMOapCpJDV8tCd0rN2swbKcwrMVhVEvmGFd2D0CYZKZn2i3EEdAP8MZqXgemg5awGkWv2MqzSDATjIIDzf1RYjxeop8v1xcpjoJRceKg8v1RNn/VHiOznx2Oa/wCjU8R8qoFBDdoh6atOAfTEc/8AOwvF/Eheh6YgumBl7F5bLHp0f3sY1m4Vy6FtLSTmuri1I1lcrajkbh0WIl6R83yxZTU7bOqITkq0MH3BdsLWtQunEg230gLBhkSQVNOByJT1Aj/iho1yLkXRu1MFX92rnTafKKFkSLhck0h/3Y8sajEwOolyMnsa41by2WiQMGCKeXLygOUTEqZHn98NoVKAA5tnmOhCIYd+kVBXWblpwTL8USUSJMRNXzcmr9sKwF1CpzRtlt70XlsuqD+zN0ptJFk+YG6avEQ1+JEuUoqux1bDROuXWWwguybtn6Yqt4ytdu2Sb09N1C4SFTIjixdF9wnj0EUEOkjyXzWXt5rKXqa7Z0AqorIqaKJqAXSWhDGTzcR0vY0rsTWjOM+4gHQIv0Q5u7vgSL8aL96L1H7orB90TPFSIjxA56tiuve2nrU/EQFBDtnqhEmXefN/5x3kVrIYVhvdSHDE34Yj36+GJSDRQT58cR5figN+wSJ7uLvzRO3C17+5dbPC1TbjggzR+0eKl0gA+aBGbkd0d2t01Wa1Pc9/wZciqRMKdRL9mZh4ch8ReoofcVjqT7inNuehNV3Rrdf1xJqXf9np3RplHqKNdiT3R7p3ffpHpRZ1SR5ERJMiQPL9UVE1MP3hR1Jx8HUtlclGyzX2NyImmXLiXNDpNgvaW3C2c1A2ois1nVQ26eL/AK9ioXEeSfLxo+YfRAObQrq9l1dmmGTs7c6gLyUCwuRbSqms3k8wDipPmpZJ6ekvKXh5vLG3o5l9/N/DGSsh0kNKn3L9qGXXFfAf6I4TPYiPEDni2MrEDqdoh5ALT8UEQ2ereD0jHeQ/MFYn4hySwa46aRjZ1MmEjlTmdTWYJtmTNIllnChcqYj1F8MCxXfSCJ+EwTm+7ctNdxVfnUIGolT7VU28hlpKc3CHESXL1EWOPp+KG4viIVjQx7tU+XXGNthU/LqSMzkz7T2W4p5d+HMUZST0PVU8/wBQlShacvMoOMHRBjPsbFVY67gcLpol+KMklYdBEv2+pUw8wjE2tnt6Jv5kqeT786u/MMS/zL0wR8EKzHPy8QI7FedFb99kutkZP7wRrBPUvUQlFFawj/uzbVA3PH7oktJnX48mOd2drJqeLZmm408yKkWrek52zmaLCcJLNBULFNbw5eEYi14O76scl2dm7qqdnVaOnrVNw5pVwuKVQ0yRkQpgRY+1JD4VB5iLGDV0RVNO1vTDKr6RnKL+VTJIXDV43LIVAIeUvi/wxmOWodbTGmHLZsSPVFWE4WRER48c7Gxlx/pBOm3f+4EvzDBD9nJ/tmHE6v8A+Y7yX5gjE/EOgc8ig93v0GGi9qNeaYyil5LYKnH4t3dUGSsyUFTEkWQ45D8xRLj6+96R7Ks6wbGD3IkjWTOU5o1ZqO3JCLNkxTHlbj5v4Y0QpDKpQOjmtpqOjouYmbfryjbJ60jOL1PZO1ryTSdIvoSmUdD/ANs47iKPHF2KyWHBGZinp4RRHHGJRIli4rqrHBc8+cZekosnU5m7wiJzNXB6+pQo6pEpxLV3MvYGpvnzxQUU9CI1OJ08sa/R88WquZzCpgWUFumZN0E+bmx6i5oodv1C5U+jZm1nyjVuPBFZZRYgSBNv7zyLpjIMJ3NGyqyLdZ40cNTJJVq4yTXRIfCQl4og7tWHVSpR2ZNpcuspepyz9Q9P7Ysozspvk5WWBrU8tTXb5ZcQR5h9UFyl4BunZikUpNqVnZHVUm1TLVQOEv4eX+uHqdj/ALnFre3GdbP6znH+a5sJPaccOlC/Vn1GgPp8sAclBXUqRdjT6yCUsCyT0/hi4jIjciIjx45y9jzrQa9mDcDx4jXmgi20IgRngB6Ys5RfWLsL8Q6h1wyLINeYeb8vNAht+N2l7h32rCs2z33JTdrT0uUEuUdEy54I4hdr9lPIS+loTa7V105Q+KnpCY6uhEc1i6kyLqxhKFpkayxLLOiM1C5iULmKNY2JEibRXEedTlyxHKKgn3/vO+JLwjxUTHVfXXuLu0iHyzOWpiTwyDLpHqJQvKI+aKLLlVFyCa63ax0Gxns2avvzUUtr+9dMPGchJUFZdS6mmKsw6cTcF4UvTDf76UvL6NvtW1Nypsi3aM524SBFvriKYiXSPlH0wlxMh3XtjLKo+VSkULTSbSeXgo+Tglmak5b64jplliWWP5Yf/vm7N7+delxvZbGRewVVwuKPs/MlNhHwK+UvV1RVn3fLvgwjj6VOiaBzuE3TNwvL5ozUavGp6pOWbj7VEx6hIYsVlDTLkPl6ofY1itr8CO+Hy5l5T1Wv5D7Qig4U9ndAQGmJfmhQKNvtNZaNPTuTzJRGd0+8B41dCX6zISyEfmxKO3PdbIQWpJnQJtdvbI9xViqavNIXSZozhmJqimX2aw/aj8qnfChxkLVqbGcPYmTHIvripw/XFZYc2+ypwmldVUP9o3IYI5tGVzqHROLuRW7i7C/EOMupVyVE23qOrVlPdLZes4xL0hAGrkXhdTmeSJsmjkmbxeYmRfvDLpIvhgriF19QPyC/RgnM1czJ2T54oRqqFnqRRhNXqy9fgyBQiBFrmQj6iGNI2K2tErOY61ZU5vmz0U5VKy4XEEu4Vj+L04xljr6lEX5MEZj7WqI5aizDMfhiLnpHuiJJbcJrOpmMkp5o4yUMUtZo6bkLNqRF1KqdI4wUrs/eygoAk2V3ZrP5fW0yWSE059xNFZez/wDSEder/DGezslvcB9g46TCL01bqlLTU68dy9JMlkW5qqPFB5iEQ/u++Oda6c+/lRc6p6nBTPSYTd0uJf70hy/LHuIa7tnuTnuKRtmytvSLncy0rmvKlZyynqLbnMXrh0pjzlygI+Ii9IwYe0HaA7Z62tQh9F0/Wz2Xs08VnQ0254Q4kXTyj+KBuRXe3ZdgxddQOvtVae2i1Y/U3JbcLhJhMk1xCoadmTdRiuokRfagmqI5GPlHqGGaLraGkKwa+4unHSG3F2brFfIw1IxjacoOyUFPT3oliQxey56mmaSiB4noXLDGT2mB61phhf0de7b6qbF1nat+5z+gZsLpBPLpSV6sR+IYI3qGHujMZS1a0HQ9idAeYj74qwOdOabaTqTG8DMD1w4wEPywSTaetjUyYB9UEcqvrIJ49+lig9pNVi1E7Ja+niOuJlLSQHHzGQjALJ73DOpSmOvuTFUR/wCEF8UtQYNyHmSMkLghPDX4o1GeO36E8mUvkjnN9MsG6Q+JMfEX5odTekApG4t6Xp2X06k0f8MWLUclCULBPLxEXmhymxDsvrwbyyTn0pphxSVvk1cVZ0olwFZoPlRyHLEvNAmbkKEQnFq2wwVi+ze232ht1pbT+biVzCXKBg4auEdFBcZDzcXLqKFVs/YW0u3elv5DWZodnT0p4pLaS+X5cITLyiWpYxmZy7s0MF0WjTN/d2m1jtnle3EXeiiq1lKqSBF4lTHER/NrHOurMHDaUk9eHnr1Y+JQy5sfiyhrgfTgKcv1TSCgdjv2VdDaSRruH3A0MnNp3MDF6DWaad6TcceQeH0l8w+WCioIg1aaMGIJopCOIoo6YiI+kemFl1nzLGxhXHrHQnO4raZt83QUc6om+Fq5TOWzgCTFws3Hjolj1CoOJZfNAF99ez2a7Gb+zCyH0k4dybH22TPC6lGpERCPqIemDuOt1JQAs2O47G+NO5rUUyBHlBQUi5fF1c0ZNgtpxhw+uNDF7FHswm/6N3NCb3muHJgMsHEtRMhy8QmXNBfQDLoUy0jOZf5GGQ+0rCOMewKSOamxLomt+JJy+5QYIxtZW4NUBp6uWC+YWrkX8f8AazNdr2vorsQqhrxCHjLtg/5owFadKGVRMz18KSpD+GCuMXpZRm/ci+9oPXTX7vNGNp2XoDWb+fLpcV2sYN2yI8yhZeER80NLXqvYHWthGdpvZq0rZ2g5bu07QiXLay9ZVL+Tlr24kbqbOCL9UKo+Ii8kEmtFId/1YSYXjqlbe20kJaD9G026SUcvGqPgFVMOUCx8Iwkufzw6ElUivVlx92m290dYX0pCT1ZQqY4Op1RYGLyV/wBqq2LqDzY+WFgpSr6brummVY0fULV/K5gkK7d83LJNQC8Q/wCGAra/lrYdVd8x6B0/pEG46W03bCmNvcvmog5nTgZi9acTIuCHRkPqIhhvHZSdlncLcdXzHcRfilXEoomSqivK5bMNNQUmi3nIe/lT5fFF0LNVeCEodrUFXvjf22e1Kl5bTrannU4n00/Z5JR8hSyeTA+XpHwpjkORl6YTiW7kO0/WLR5M+zEatmGv1iNXoe1Y+YU+nIfLFddPhs7db1FStPulo+6NXPbV1DTcypKt5elxVaRqDQU3KgeI0sftU/UMMt/SHLElUthqe3BSOWio6pF77O6UEOluqQ+IfKXN80doj8u1SIzfzK9gZyIBqZ5omfu4SX96LxmagmCkaWt7EsvcJh+jfpkruIrlbPlGUBy9/rgyCEIMv72GVexUiIFJHMvad6bW9EgW6tR5YJHthUxq4P6MoL5jxbEv4/7GZ3thww2Kzwx1xyetOofXAVJ2edTMw092gpK+/wCWCeNe46KM3xLZfojxFiAvqxggfYH7HaDvJdqf7mblNBmTej10kJXKXGmQe1EPMqQ+LHlxygrNl1qKsWO5BOKNohC7W/ia1ZWAi7Z23kiIyliWmSSLtfrXx82IjzQ4ypqup6iKXf1hWFRNZVJ5agTh0+dHimiAjzERQtq8ovyXpmKtZda1N/KDb3BtNV0rqSnZiBgEwl5ZpOh6SEvT5oaxYtlUO2rtA642oNl/9BqmlA1dTjMsRTYq5YOUksekMsSEfDzRXkLtAnjv6gp1wtkG2C7t42d97o2jYz2fy9v7O3dTISVTTEf7MtcfywqDOXtZezTYNkk0UUQxBFHTEExEeURHpxgNeIjPp52JBs/t43rq4tZ7sK3aE7n0wmS0mlBOucZaxSLHBL+jIssiHm5RhbqwuRb23/sCNeVtK5F9LOBZMvpJfRL2pYukBEuoihhVH0CnIl6tCbbz9uDS7VDjXdOu9ZXXVGZzOQVI2L9e1VEciQ1PxJHp3jiXePT7o0OvKdZ7wdhcxlVVS4Sc1RTJ5oj9mLgQL82Q98VTXV7L6PUmc3LRqbWop0DkSFZuv7KYl5gyGMg11THDvUxh7R4SYrsj6wrf6NXRLhZ7c245IlwtRRYJLd3UWREQwWhrzFCbKe7dhNS0ipEQISOYWgXRoXSkznxCqMEx22qJhVjZX6iUxLGC+b8WxCOP+xmf7YhrOn2xGas6dZ+0v3Eyl6CKJFykZq4jl6eaBy9ov2fMq2OBateYXJKd1PUTJZWeM8hFNiZDkACn1cw5cxeWIYVnSWjmVDtHY3xFYzLk1xL+HKC9/o3b1BzaWv5VyisjNEiL1CQFj/36oZZq3UC4b3IfHa6oJVR29epqPnC3BVqySN3suy0/1rhZCqIeYh8vphaq7o2l7iUXM6Eq5sTiVTpqbR23EupI+oR6v6oBx/KL8mPZmvWFsJbfbTayX2ctZK1pbI5SJEkiSmRCRFkRZQilwmKNWdp7SjpiI50jRro3RDy4+0mOAEP5uaI2rUCOO/qC9YIdxf0RGOWugB78uXHzeH+9AL8eBxvxsT3YjPJfMbTzKTommTqT1C9avE8uZEuIRZYxsG4TahY/c88phxeOQrTBWkZoE3lnDV4XBWHmyLzD0wwql6RJbHdhuVcvGkuoucPXOKSCTBZU9e7LEdAL8sIRtLWTT2l09NXglpoowcOBIuURAiMubL0xC3ygrG8JnN5X2rBa6NYzKVaj7K6nzs25eYOKWJRqEmqtWaVK8YIJF7G3QI+Nj4hLm/LjDTvqtMDsj6joq7FDbo8sDsRptWfsCbzarCOeOkVOpPil+qH/AOMR/FDv0gTBPThwoue5k4LSPYiKTxy80y59juBKlv7Uf4oJftpNQ6nbFop7sBLSGHMR3YmXcf8Aaxwm6CSs6ktvImLxBNRLSfS9XhraZCRAoRB+YRgaPaZ7eJvTlDp3xr52o8q2dVQ4cPXjhUiJFuREKTcffiIgIj+KFuM9Wph7huuSGbA6xLPiDpBM/wBGzuI1l93riWtWX5nzBu/SEi6iAsSxh1lrdQmxvyhQ77Wk0uhIG76mZx9DVVJVReySoBDI2aw+Ev7IvqIY0112jEisvLvobd7bWfUvNWo4LTSUslJhLXWPjAgEiES6sS80Kqp9BtdjOXksG/atWluowVp3Z/biprg1GWIIMdZaqzZomX1GquYiIpjj+WNt2y2MrK3ZTu5d5qlQndfVioLiaPGoYoMwHoapD4RCO3W9kU1UOLFbJMBHP/pFMvfyd5ebl6oDD/2N6qF0/wBmu5Se3vOmnz+3VwG4BO1JSHFORvgy/aCSHmJIx6iGF1le5Db9OpPrPpdeumdGh8+SkzSAu71CWuQl4scYZUzSjoWX0Oc9iBbiNzTndNMHG1TaXNkZknMOWpq+R52MnaeMEix51SEekco1ntI7t01st7P2fSym1lE1tJWNPSZNQhIyMuTIvVj3l80QX1LETjB1VvZzv1VNnLCWp08x/XP3HKPL5i5jKFi7MvalUO8TeBKrIU9LS1lUrVSeTeZD9km0Asjy+LlH8UM7fTEW73I6cKflMsk8tayOVNxQbM0hQSRHpERHEYyQjiPXCefmQSyIiIkTlrlSh6VUzX0U+zVH+KCZ7aHimk6lyunSSKX8MMOVltJlnHv3Qqnae17MbXbH57ceQPCbv5OuyetSHxKgqJCPzQ07tVLrUZWWy+nakOdt9VKoJrNmWWX7R0kqIl5hIiH8ML6I6mmMXPqpIG9Pmrh9LVQaKEKgiJjr6vL+aHMdkDuKTs3vXoquVnns7CbKnJHol4cx5fzQ9yF9ITY35Q+E8uNLZU/Bgop3mWI48xCI+EiitLqxZzZyTBfn0+4VdMhU9UZvZuYYylVs2un0GAs+GzYIoCXKSaICIl+GMxroI6R1LshPalFnnfy8P7o8iJX+yRUECE+Nj3F7tchyyHyl6fTCJ3R2c7PK8qgKvrjbzS7+aI8xOlGmgkXqLHES+aJxnrwEUVqbM1Ti9t7ZyUaeomn5XJJej7wYy1EUgy6ekfi6oD52+u96R3dvMyshRcz9sklCh+0KNyH9smB+D1Yjy/NBeJ5sRHlKflUsYLSkhWQzn0+4Zv3BdIljwR6hH+GDu/o+e2GkbNbNUbvoStP+UFeOlXjp8WmRkiJYpB8PMXLDLM9MDM1R3If+mGOJ9/VFaE/uEsiIjxE5Z2Jppz1HX1j/ABQSva24BRSTrd/7oPvg/l16UT479ovu3BrbWSbM5TRYmOv8ops3Ah8wBkRf3YG2/wB18kLZPU+067tMi/RamUwo2fJjxF5W4yHJAyL90XNEMSvtWj2TPrISOWzBVRgi8MO4iASIS6soy1rqEutNKkn1b2pp9xMEaVlwzx+mz5jbgBfa6D6cfDDO38TQJV96Og/Yje2iN7G1Gkr7U08Tcm4ag1fEj3ZIuA5TEvm80LpLaPBHXT9UQ6j0j5Yzc/DNnRlfR0bRKWPs6IpmPvGL6IoBt8y2RERwg4kqg5a9P/3Gu1FKOOB5I+4xxyj2thGLPrISS+ltbgza2U7Z2iNmjUjhoaDJaYZcBMyHqL4YDPvv7L+mtkm3+T17fK7ClT3XqqfCaQsSIUEQ6lSES6uoeYoNxPEivlbFOrQ1x05TZtlnPSAiREPzYx0qdnNSqNI7IrZU8DfDRORoq4+ohyKD8z7TOUC4d3NoHhitCsvZERHiJyyJlp9LoqH4VBgjm0tzxWsjWBTqQEiKGPL/AGJneO+5oTzt5K1TM7cW5BbLgpLPVU8unpEYGRcZ0a6H0aeJcTLIflGL8JapTKsn1SPKLdaPKdQM8tSTyCFt2S7wj2T7sKeujM5QUwpt81Vls+l+PEFw0PrEh8Xmgm37GU1feg1nZv7S6CsvcipL77Trrt5jZe6DUZklTOWSctfF18IvDl4hh5OOglkHzfFGbtWmaGixa0XCfMOEeqDj0e7+qK0We/kppmeI568uPUPNE6PDU/r/APfljhxSPUiyiRwKKnIeo/DEo+SeuvksJg4kcvYO5lMnibVBukSqrhTpTARyIvwxzldrNvbbbzt65zSmHRKUlSonLZRj0rY8pr/MQ/lg/Bh2kL86z9Dc6yeu06fXBnrioRiI/D1FHUVsvnjWoNqNtZ2zAdEnFPNCxH4OaCcz/oX0IVQdMlB7oqQtLWRER4icr2qehzTHXX6+aCG7O3GUgp1ypqXdoloPLDTl/wAaPcc9TY1ntcLqfzhbyJrKmZiaFNskWA4l4yHiHDKqyfJrTUw4nKmUX4q1TooyHuxlzbtxp7Cuw7+7gq5DFauuVSWuQH35kGXl/wC8Yul42yn38Dseyf7VK4vZ/wBdo0jO2M0qK2U6VwfyNqPFUlpF+/R9WXUMdCNn7xW6v5bmW3QtXVTeayeZJcVF0mXT5hLxCQly4lzQjyVuWzQ00uqPY2oO4Q7kzjXrsXJkdpbczi4tSAso0k7U3BItdMlVsfAHqIsYE1otXljPmLG+O5Z5/OpfS4E4k0vmGgqy2iabdKIJS9uXRxlA5jMh6h90bRs9urWdrd0kz2gT6sJhUksmkpKoZS8my/FdycBLEkFVC5jT5hxKOhllahXsdzofd+87uXIvTGNqKfSOmpS5qGoZwiwYMw4q7x0XDTRDxERF4Ykl7AslvegNHbIdtk2ulJZjtX2lz9ROSLZIzmsGZlk6x/cI49I+YvhgWlJAS9TqKkH2Yc3v5emHeJX42Isue5aRsD3jTidhJ+N9i1Mz+LGOljso6gWqjs/bYzVYx11GUgl8OPL/AHYjmx8EafccYgWSg++KsKS1kREeOHK+3/8AHfcXu7tYfhtNqRtI7ey2dvVEwQYoEahKF4RGHHKQ+mivAepMHfdWvXFyrjVPchzllOJi4cjl4RyxH8ojCQTAvanai3UOeWRRbjrVeiqfmxl3SDgmtSEzWHEXAEWJF4vCWMbHUsmKe6sGQnhqo4ACUHwgRY5DErH6GwqqjdsEO3pO0gSmZ0vQFracR4kpeIzeaPFCxJNEMRIi+Ii6YIdKLTV/Z2rlbubWa2Glps81Fw/p1bQik0yLHmI0fAReYfNGZvu2bLLxlH0IXqw3aPUpVNRDazcVSa1v6rT5R9uyKXTD1Iuen5S80ODqSn6euRRjqnpkYvJbMkMFCb5GPN5SGOQl2FNkOjGt1Z2XFZz6bKLNd+dzJazWIuExakiIoj4QEhDyjCmbTdh9rdq80m9bSupagq6qp9oKD2rKock5dKIj0pD4QH5YmQlNzfQ2PcFu5sBtqk6kzuxcJmwW5uFLUldFXTjXyin1ZdMCv7QzdNfHfjIndHM6ofUZSf2iFPtVcieCP1E45ci6en4o8pew543j/wCRvYLGuJPOaVqR1T0+akk5anhw+kcfDj6fF80ULd5qazFwYYhxer4Y0OJL6ZkuQp/iZE4yMxQ7rSbzGazTv96xEAfCIx0RdhJUx1B2dVItDPLWXKuG/wDzIpzX9PYHV7jyE+4NfdFeFJeyIiPHDleZqf557ihfqwuQdvdlsyfM18HT4fYEfiPlh5yK3Wv7lGHLq2M8nmmkrkqgAsI4CI8Tw5RsO2bZ1dPctPQ/k2z9hkiZ5LTx1piknp6fMUC5Nqx69D3hOMfI3odVezs67N2s25TCY0hK3jyoZOAv9ZwsqRGtj1cvfiI+mGfOnCbFrpODxMG5iqRY+ESyKB+Pud8WmOPinC/4++Gv9/yP87LRYLqOqyCsEu4Koaov5ct9ZLNEiEfd8KmUEABDkwT8Pd3enlx/hxhXlpdmW49jyIrZbT2Q05UTDWXVFKGrtExxxdJCpj8xdMachauuKCdjO9td8J5Rq6ZZHLyInzFT4kTyxH4YGhLqydtCkjfJHu23w09ITlU+t3RtTPxLFKbN3SjRP4jTxKNbqusd6t0GerOs9wMtpVgoBCrL6NZjxcfLxz5vmGLpW7BK8b1DLd3Vip3Qt9JpdSkpQ6nrCQ08k4mz6cPFF3XOePFAjy5o0W3txJbc+V6ziVLiWoq44pmRZFlj1fDHV6q2aHhrflT+UYbeFtVkNZzWhXjpf6JdzJJZqrMB0EucQIwE/wAMMo0ljih6VmSMzdJ8ZNVYCUT6S1yxGGfG2tw6iL4uw+t+l+ye1hJIH7NxORQcsvKXig9P6ORUib3ZK/kfH7yls+WD4RLmgzJkpxMjOp0PT9whv6sh0PTzRVhYdZERHiJywIJYTPRTT68sYzW4ut2523pO3ntOAIrnMHQj3cuOIgJfMUaHPW61/cow47m0bbtQ2ETK/jlrcW7KS0tpZM80ZWPKrMPKReVPp/FD96VpCmqJp9GmKVlCLBg36GrXTERjKZuQ7Xo+1/DfErCoV3+/5JqokjWo6deyR4GabxA0iHzZDjAjHcj1YTCfUO+1IVJY8WZGJdWORYl+GCuKmpyaQp+OqPpwtY9rYrKZxTOzug9zlJNnTlzbt+4ls3atdOZ4xI+f5gEs/wAUEIoyq5HW9Ns6wpSaovpXMg4rd43U4iag+koDy632ZnMKxSgtGSUHTX9Z98Tfadyhe8h80Ca2xhNNI80EE+gR/wCEQoPEPPie/HqKPaOxYiu7501Z0WtSskaJup9cAkpG3b937oS5zL0iP8UNjs5tLp2xG5ysLUU7xhkLFBpMUBU06SMCyEfTllBNb1Wy/jV2zIMyHaQgrKttjirJdii9lL1E2qnTiRFhj+EoahtEsNL7/Xuay2rZULuVSrJ4/FTT9WR5ZY/iygvHtVVErAzmsf8Al8vTS/2OG3Ddm1RlVEVb2NEZDOE8iOVqczV0OXh8hfDDsP0dB1UdvGNzrAXClTiWztm8CaJy9YtCIkiEhIwHxDl3dMRpyXOAu+I+DVC/lL2/3/6FDbdxDp/R1D8MXMWmFZERHis5YmhppzAlXK+CaeWRFCzbR9mz+81dFfu6ySg083IfouTl1Osebin6emGvL3KuHUf/AAlxjy8pWf7/AJHyNGSLBuDZs3TTTART0FMcRER8Og+WKw9MZCx7PtdS6R6Hi/KP1+rGB5bwrNhTlXTm4sqbpiDebk3mXD0xxzHJIy+YsYLwp9LUZ34ox3fjSih0X6OxdKlZxUFxdlVfmiaMy1+lZcmsWnUQkKv5coWe7u3u7XZdVRMri0A0eVdYecOvaHkragRPKPMz51RHxIc3N5YYZMO0tnzPFs+UurFiomsqVuFS7OtqPqFrMpU+AVUHjUsk1BIfTry/N5Yygjyj/T9RF6oUWLqPKpqxHh6+7ujG1bVtO0NSz2rKqmSbFhL0iVXdKdKYjzfi8sdr8vZ2ckoGvbKNt1xtztyf8sa9EgUktPE3JrSlOudS45NubNwY+EjxHl6o1Tc3SstkG+6sW8qSwRKUS8NBy6dBEh//AGCWusWT4OffOiNA7U6uG0pt3JqDWc93tzgXSo5D0B0/mKNr7PG0jigbHI1VOGaiMyqRcnq4qdQh4B+H/FEpvrjpGkqj8/mXP/yhwSaf77vjDTiW1vTNYyy+FmJp7DWtOczXX93MEek26vmEhgCqXQfZ2N/KonWwie0fc5Ru7CzzK5tMcNo57ybzKUEWRy1wJYmkfzQqQloUN09o+HZtLpudb/pPYiJARy/2htsV3LzyS25uRTRcH7Q8Eeokh6h+aCVSmWMJDL0ZMybppoN0hSBMRxEQHpjvMzc59T6b8CRVWPKwvB04g88QYYwiZ9B1v1EhDl0fX4YQq4tGSmfX2nFtKnSL6KuBJDECUHlF0l4otq+5C/kIqyCixq23dGubA7qFZdIaneUtVUldDhNmIgS4pD1kIlykJJkJYlB0pft/vRXFt2azDelUjxGbMwMlphK2qqbgDDLE08eksobSs7eT5DlU/LukhtKvZsbutqdTTS6O2+uZPVlPuMl5jbXg+x+1FjzG0LvIRVIcix5RLEY26wt05DuCkbhzScumDSbS8yQf03Ng4Ewl6o+E0i6viGBLK9lmPd0ejdSpmdtZe5nEyZ+xsWaROF3zwuEkikI5EREXSMNcp6Y3V3r3kRndN7a6oqW1NJuMmAkQNGNUPg6VVVD1H9mH5so5TDwTyrevgeG1pHtIrsE1WnVf0faqUCWhfR8hR+knwh5eIf6sR+HzQ2K4krmMs3OVu0nNfvKlfMSbtVZo+SBNRQsMseTlxGJ2LcGMPh7xnRB4703rrcdu4f2+kZ5yyjGYHMXQ8yaJZDy/ERd0Pyt9LxltFShsA92ibJIeH5eXpiq17rSNjxMd5lk3+2ZsAw0iZMsfv6i6YD1s0spd/KK1g7tf5K27KR14muTelq+WGTTpESxTTXIf1Lj4shxygoGICXE++GlL3Xs+OfFdCpy3Jf1E0RF5lT//2Q==" width="168" height="168"><p><a href="/kmap/infor/?persion='+__infor.person_id+'&name='+__infor.username+'#id=0'+'">'+__infor.username+'</a></p><p><span class="thin talk">发送消息</span><span class="thin addFouce" data-id="10">+加关注</span></p><p class="last"><button class="order">申请加入仓库</button></p>');
                    $("#opea").append(__content);
                }else{
                    map_name = __infor.map_name;
                    var __content = $('<h4>'+__infor.map_name+'</h4><img class="head" src="data:image/jpeg;base64,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" width="168" height="168"><p><a href="/kmap/infor/?persion='+__infor.person_id+'&name='+__infor.username+'#id=0'+'">'+__infor.username+'</a></p><p class="editLib"><button class="editThis">编辑仓库</button><button class="getFri">邀请好友</button></p>');
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
                        // url  : "/check/pay_attention/",
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
                            // url : '/check/send_message/',
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
                        // url : "/check/join_map/",
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

    var getFriend = function (){
        var __username = $(".searchFri").val();
        $.ajax({
            type : "POST",
            data : {username : __username},
            // url  : "/check/search_user/",
            url  : "http://121.199.47.141/check/search_user/",
            success : function (data){
                if(data.flag == "succeed"){
                    var infor = data.info,
                        html = '<div class="searchResult"><ul class="searchResultUl">';
                    $(".searchResult").remove();
                    for(var i = 0; i < infor.length; i++){
                        html += '<li class="searchResultLi" data-id = "'+infor[i].person_id+'"><a href="/kmap/infor/?persion='+infor[i].person_id+'&amp;name='+infor[i].username+'#id=0">'+infor[i].username+'</a><span data-id = "'+infor[i].person_id+'" class="invite">邀请</span></li>'
                    }
                    html += '</ul></div>';
                    $("#opea").append($(html));
                }
            },
            error : function (data){
                console.log(data);
            },
            dataType : "json"
        })
    }

    var func = function (){
        $("body").on('keydown',function (e){
            var e = e || event;
            if(e.keyCode == 13)
                getFriend();
        })
    }

    $("#opea").on('click','.searchFriend',getFriend);
    $("#opea").on('focus','input',func);

    $("#opea").on('click','span.invite',function (){
        var __id = $(this).attr("data-id"),
            con = "用户" + $.cookie("yooyuName") + "邀请您加入仓库 "+ map_name +" ",
            that = this;
        $.ajax({
            type : "POST",
            data : {rec_user : __id, content : con},
            // url : '/check/send_message/',
            url : 'http://121.199.47.141/check/send_message/',
            success : function (data){
                //console.log(data);
                    if(data.flag == "succeed"){
                        $(that).html("以邀");
                    }
            },
            error : function (data){
                console.log(data);
            },
            dataType : "json"
        });
    })
});
