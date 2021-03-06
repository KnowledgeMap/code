/*
*
*/
var higShowVar = [],nodesArr = [],linksArr = [],BUFFER = {data : [],nodes : []};

//建立对象存放变量
	var svgEvent = svgEvent || {
		group : 0,
		nodes : [],
		links : [],
		temp : [],
		alertElement : '<div class="alert alert-warning alert-dismissible" role="alert">\
							  <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>\
							  <strong>{title}:</strong>{content}\
						</div>',
		allLinksData : [],
        id : 0,
        count : 0,
        timeIndex : 0,
        flag : false
	};

//点击增加节点按钮向svg中添加节点
	svgEvent.append = function (dom) {

		var e = e || window.event || arguments.callee.caller.arguments[0];
        var points = { x : e.pageX, y : e.pageY - 50};
		$("g,.path,.floatDiv").remove();
		svgEvent.nodes.push(new Object({"name" : dom, "group" : svgEvent.group}));
		svgEvent.group++;
		svgEvent.temp = [];
		svgEvent.loading({data : svgEvent.allLinksData,point : points});
        if(svgEvent.flag){
            $(".time").filter(function (){
                var xx = $(this).find(".timeSpan").attr("data-index");
                return xx > svgEvent.timeIndex;
            }).animate({"height" : "0px"},200,function (){
                $(this).remove();
            });
            svgEvent.flag = false;
        }
        svgEvent.addTimeLine();
        var x = svgEvent.nodes;
        var m = JSON.stringify(x);
        var l = eval(m);
        nodesArr.push(l);
        linksArr.push(svgEvent.allLinksData);
	}

	$("svg").on('click',function (e){
		var e = e || window.event || arguments.callee.caller.arguments[0];
		if(e.target.tagName == "svg"){
			var x = $('g').find('rect');
			for(var i = 0; i < x.length; i++){
				$(x[i]).attr('class','rect');
			}
			svgEvent.temp = [];
			$(".path").css("stroke","green");
			changeMarker($(".path"));
		}
        if(e.target.tagName == "rect" || e.target.tagName == "text"){
			var tempVar;
			if(e.target.tagName != "g")
				tempVar = $(e.target).parent();
			svgEvent.clickG(tempVar);
		}

        $("#contextmenu").css("display","none");
	});

	$("svg").on('dblclick',function (e){
		var e = e || window.event || arguments.callee.caller.arguments[0],
            force = force;
        force ? force.stop() : "";
		if(e.target.tagName == "svg"){
			svgEvent.append("双击节点进行编辑");
		}		
	   if(e.target.tagName == "rect" || e.target.tagName == "text"){
			tempVar = $(e.target).parent();
			svgEvent.dbclickG(tempVar);
		}
	});

//stringFromat 工具函数
	svgEvent.strFormatObj = function (){
			if((arguments.length <= 0) || (typeof arguments[0] != "string"))
				return null;
			var value = arguments[0],result="";
			for(var i in arguments[1]){
				var reg = new RegExp('\\{'+ i +'\\}','m');
				value = value.replace(reg, arguments[1][i]);			
			}
			return value;
	};

//waring 警告函数
	svgEvent.warming = function (titles,contents){
		$("#drawBord").append(svgEvent.strFormatObj(svgEvent.alertElement,{title:titles,content:contents}));
		$(".alert").fadeIn(300);
		svgEvent.temp = [];
		$("rect").attr("class","rect");		
	}

//点击g之后添加黑色边框以标志选中
	svgEvent.clickG = function (dom){
		var rect = dom.find('rect'),
			inner = rect.attr("group");
		if(rect.attr('class').indexOf("clickedG") < 0) {	
			rect.attr('class',rect.attr('class')+" clickedG");
			svgEvent.temp.push(Number(inner));
			detail(rect,dom);
		}else{
			rect.attr('class','rect');
			$(".path").css("stroke","green");
			changeMarker($(".path"));
			for(var i = 0; i < svgEvent.temp.length; i++){
				if(svgEvent.temp[i] == Number(inner)){
					svgEvent.temp.splice(i, 1);
				}
			}
			$(".floatDiv").remove();
		}

        //高亮显示选定的边
		higShow(svgEvent.temp);
	}

    function saveContent(){

            $("#MathInput").trigger("keydown");

            setTimeout(function(){
                var MathPreview = $("#MathPreview").find("script").text(),
                    MathBuffer = $("#MathBuffer").find("script").text(),
                    value = "",
                    num = $("#cover").attr("data-index"),
                    inputData = $("#MathInput").val();

                MathPreview.length > MathBuffer.length ? value = $("#MathPreview").html() : value = $("#MathBuffer").html();

                if(MathPreview.length == MathBuffer.length){
                    value = $("#MathBuffer").html();
                }

                node[num]["name"] = value;

                node[num]["LaTeX"] = inputData;

                $("#cover").css("display","none");

                $("#MathInput").val('');

                svgEvent.loading({data : svgEvent.allLinksData});
            },100)
    }

    $("body").on('keydown','#MathInput',function (e){
        var e = e || window.event || arguments.callee.caller.arguments[0];
        if(e.ctrlKey && e.keyCode == 13){
            saveContent();
        }
    });

//双击节点之后表示选择结束，该节点为最终目标节点
	svgEvent.dbclickG = function (dom){

		var inner = dom.find('rect').attr("group"),data = svgEvent.allLinksData,temp = svgEvent.temp,newData;

		if(svgEvent.temp.length < 1 ){
			svgEvent.temp = [];
			showTheEdit(Number(inner));
			return false;
		}

		if(svgEvent.temp.length >= 3){
			svgEvent.warming("警告","目前不支持多节点关系");
			return false;
		}

		switch(temp.length){
			case 1 : newData = "1011_" + temp[0] + "_" + inner; break;
			case 2 : newData = "11101111_" + temp[0] + "_" + temp[1] + "_" + inner; break;
		}

		var x = newData.split("_");
		if(x.length == 4){
			if(x[1] == x[2] || x[1] == x[3] || x[2] == x[3]){
				var result = $.unique(x).reverse();
				result[0] = "1011";
				newData = result.join("_");
			}
		}

		var tempSplit = newData.split("_");
		if(tempSplit[1] == tempSplit[2]){
			svgEvent.temp = [];
			var x = $('g').find('rect');
			for(var i = 0; i < x.length; i++){
				$(x[i]).attr('class','rect');
			}
			showTheEdit(Number(tempSplit[1]));
			return false;
		}

		function showTheEdit(num){
			node = svgEvent.nodes;

			$("#cover").css("display","block");

            $("#cover").attr("data-index",num);

            $("#MathInput").val('');

			if(node[num].name != "双击节点进行编辑"){
				$("#MathInput").val(node[num].name);
                $("#MathInput").trigger("keydown");               
            }

			$("#MathInput").trigger("keydown");

            bindClick();

            $("body").on('keydown',function (e){
                var e = e || event;
                e.keyCode == 27 ? $("#cover").css("display","none") : "";
            });
		}

        function bindClick(){
            $("#cover").on('click','button',function (){
                
                saveContent();
                    
            });
        }

		$.ajax({
			url : "/kmap/result/",
			data : { "old" : JSON.stringify(data), "newLinks" : newData},
			type : "POST",
			success : function (datas){
				svgEvent.allLinksData = datas;
				svgEvent.loading({data : datas});
				svgEvent.temp = [];
                svgEvent.addTimeLine();
                nodesArr.push(svgEvent.nodes);
                linksArr.push(svgEvent.allLinksData);
			},
			error : function (err){
				console.log(err);
			},
			dataType : "json"
		}); 
	}

    $("#contextmenu").on('click','li',function (e){

        if($(this).attr("data-index") == 0){

            var x = $(".clickedG"),path = $(".path"),arrNode = [],arrPath = [];
            for(var i = 0; i < x.length; i++){
                arrNode.push($(x[i]).attr("group"));
            }
            for(var i = 0; i < path.length; i++){
                if($(path[i]).css("stroke") == "rgb(255, 0, 0)"){
                    arrPath.push($(path[i]).attr("eig"));
                }
            }

            //删除节点的所有关系

            for(var i = 0; i < svgEvent.allLinksData.length; i++){
                var x = svgEvent.allLinksData[i]["path"];
                    m = x.split("_");
                for(var j = 0; j < arrNode.length; j++){
                    if(arrNode[j] == m[1] || arrNode[j] == m[2] || arrNode[j] == m[3]){
                        svgEvent.allLinksData.splice(i--,1);
                    }
                }
            }

            //删除关系

            arr = $.unique(arrPath);

            for(var i = 0; i < arr.length; i++){
                svgEvent.allLinksData.splice(Number(arr[i]),1);
                for(var j = 0; j < arr.length; j++){
                    arr[j] -= 1;
                }
            }

            //删除节点

            var tag = arrNode.join(",").split(",");

            for(var i = 0; i < arrNode.length; i++){
                //删除节点
                svgEvent.nodes.splice(arrNode[i], 1);

                for(var j = 0; j < arrNode.length; j++){
                    arrNode[j] = Number(arrNode[j]) - 1;
                }
                //改变links中的id
                for(var k = 0; k < svgEvent.allLinksData.length; k++){
                    var x = svgEvent.allLinksData[k]["path"].split("_");
                    for(var m = 1; m < x.length; m++){
                        if(Number(x[m]) > Number(arrNode[i])){
                            x[m] = String(Number(x[m]) - 1);
                        }
                    }
                    svgEvent.allLinksData[k]["path"] = x.join("_");
                } 

                for(var j = 0; j < svgEvent.nodes.length; j++){
                    var x = svgEvent.nodes[j]["group"];
                    if(x > Number(tag[i])){
                        svgEvent.nodes[j]["group"] = x - 1;
                    }
                }    
            
            }

            for(var i = 0; i < svgEvent.nodes.length; i++){
                svgEvent.nodes[i]["group"] = i;
            }
            svgEvent.group = i;
            
            //停止节点之间的影响

            force.stop();

            svgEvent.loading({data : svgEvent.allLinksData});

            svgEvent.temp = [];
        }
        $("#contextmenu").css("display","none");
    });

    svgEvent.addTimeLine = function (nodes,links){
        if($(".time").length > 4){
            $($(".time")[0]).animate({"height" : "0px"},200);
            setTimeout(function (){
                $($(".time")[0]).remove();
            },210);
        }
        $(".timeSpan").addClass("small")
        var x = $("<div class='time'><div class='timeSpan' data-index = '" + svgEvent.count + "'></div></div>");
        svgEvent.count++;
        $("#timeLine").append(x);
        x.animate({"height":"60px"},500);
    }

    $("#timeLine").on('mouseenter','.timeSpan',function (e){

        var e = e || event,
            x = e.pageX,
            y = e.pageY;
        addTimeDetail(x,y,$(this));

    }).on("mouseleave",'.timeSpan',function (){

        $(".showTimeLineDetail").remove();

    }).on('click','.timeSpan',function (){

        force.stop();

        var x = $(this).attr("data-index");

        $(".timeSpan").addClass('small');

        $(this).removeClass('small');

        if(x < 0){

            $("g,.path,.floatDiv").remove();

            svgEvent.loading({data : BUFFER.data, allnode : BUFFER.nodes});

            svgEvent.allLinksData = BUFFER.data;

            svgEvent.nodes = BUFFER.nodes;

            svgEvent.group = 0;

            for(var i = 0; i < svgEvent.nodes.length; i++){
                svgEvent.group++;
            }


            $(".time").filter(function (){
                var xx = $(this).find("div").attr('class');
                return xx.indexOf("restart") > 0 ? false : true;
            }).animate({"height" : "0px"},300,function (){
                $(this).remove();
            });
        }else{     
            var o = nodesArr[x],arr = [];
            for(var i = 0; i < o.length; i++){
                var names = o[i]["name"],groups = o[i]["group"],xx = o[i]["x"],yy = o[i]["y"];
                arr.push(new Object({name : names, group : groups, x : xx, y : yy}));
            }            
            svgEvent.nodes = arr;
            svgEvent.allLinksData = linksArr[x];
            svgEvent.group = svgEvent.nodes.length;
            svgEvent.timeIndex = x;
            svgEvent.flag = true;
            svgEvent.loading({data : linksArr[x], allnode : svgEvent.nodes});  
        }

    });

    function addTimeDetail(xx,y,dom){
        var x = $("<div class='showTimeLineDetail'></div>");
            x.css("left",xx + 10 + "px");
            x.css("top",y - 17 + "px");
            x.html("返回上一步");
        $("body").append(x);
    }

    $("body").on('keydown',function (e){
        var e = e || event;
        if((e.ctrlKey && e.keyCode == 90) || (e.metaKey && e.keyCode == 90)){

            if($(".time").length == 1) return false;

            nodesArr.pop();

            var o = nodesArr[nodesArr.length - 1],arr = [];
            for(var i = 0; i < o.length; i++){
                var names = o[i]["name"],groups = o[i]["group"],xx = o[i]["x"],yy = o[i]["y"];
                arr.push(new Object({name : names, group : groups, x : xx, y : yy}));
            }    

            linksArr.pop();
            svgEvent.nodes = arr;
            svgEvent.allLinksData = linksArr[linksArr.length - 1];
            svgEvent.group = svgEvent.nodes.length;
            svgEvent.loading({data : linksArr[linksArr.length - 1], allnode : svgEvent.nodes});  

            $(".time").last().animate({"height" : "0px"},500,function (){
                $(".time").last().remove();
                $(".time").last().find(".timeSpan").removeClass("small");
            });
        }
    });

	svgEvent.loading = function (obj){

        //console.log(obj);

		$("g,.path,.floatDiv").remove();

		var links= obj.data,newLink = [],result,tempOffset=[],nodes = obj.allnode || svgEvent.nodes;

		for(var i = 0; i < links.length; i++){
			var tempdata = links[i].path.split("_");
			switch(Number(tempdata[0])){
				case 1011 : newLink[i] = new Object({source : Number(tempdata[1]), target : Number(tempdata[2]), refer : "", two : 0, id : svgEvent.id, eig : i}) ; break;
				case 1001 : newLink[i] = new Object({source : Number(tempdata[1]), target : Number(tempdata[2]), refer : "", two : 1, id : svgEvent.id, eig : i}) ; break;
				case 11101111 : newLink[i] = new Array(); newLink[i][0] = new Object({source : Number(tempdata[1]), target : Number(tempdata[3]), refer : Number(tempdata[2]), two : 0, offset : "end", id : svgEvent.id, eig : i}); newLink[i][1] = new Object({source : Number(tempdata[2]), target : Number(tempdata[3]), refer : Number(tempdata[1]), two : 0, offset : "end", id : svgEvent.id, eig : i}) ; newLink[i][2] = new Object({source :Number(tempdata[1]), target : Number(tempdata[2]), display : "none"}) ; break;
				case 11001011 : newLink[i] = new Array(); newLink[i][0] = new Object({source : Number(tempdata[1]), target : Number(tempdata[2]), refer : Number(tempdata[3]), two : 0, offset : "end", id : svgEvent.id, eig : i}); newLink[i][1] = new Object({source : Number(tempdata[3]), target : Number(tempdata[2]), refer : Number(tempdata[1]), two : 1, offset : "end", id : svgEvent.id, eig : i}) ;  newLink[i][2] = new Object({source : Number(tempdata[1]), target : Number(tempdata[3]), display : "none"}) ; break;
				case 11100001 : newLink[i] = new Array(); newLink[i][0] = new Object({source : Number(tempdata[1]), target : Number(tempdata[3]), refer : Number(tempdata[2]), two : 1, offset : "end", id : svgEvent.id, eig : i});  newLink[i][1] = new Object({source : Number(tempdata[2]), target : Number(tempdata[3]), refer : Number(tempdata[1]), two : 1, offset : "end", id : svgEvent.id, eig : i}) ;  newLink[i][2] = new Object({source : Number(tempdata[1]), target : Number(tempdata[2]), display : "none"}) ; break;
				case 11101011 : newLink[i] = new Array(); newLink[i][0] = new Object({source : Number(tempdata[1]), target : Number(tempdata[2]), refer : Number(tempdata[3]), two : 0, offset : "both", id : svgEvent.id, eig : i});  newLink[i][1] = new Object({source : Number(tempdata[1]), target : Number(tempdata[3]), refer : Number(tempdata[2]), two : 0, offset : "both", id : svgEvent.id, eig : i}) ;  newLink[i][2] = new Object({source : Number(tempdata[2]), target : Number(tempdata[3]), refer : Number(tempdata[1]), two : 1, offset : "both", id : svgEvent.id, eig : i}); break;
				case 11101001 : newLink[i] = new Array(); newLink[i][0] = new Object({source : Number(tempdata[1]), target : Number(tempdata[3]), refer : Number(tempdata[2]), two : 1, offset : "both", id : svgEvent.id, eig : i});    newLink[i][1] = new Object({source : Number(tempdata[1]), target : Number(tempdata[2]), refer : Number(tempdata[3]), two : 1, offset : "both", id : svgEvent.id, eig : i}) ;   newLink[i][2] = new Object({source : Number(tempdata[2]), target : Number(tempdata[3]), refer : Number(tempdata[1]), two : 1, offset : "both", id : svgEvent.id, eig : i}); break;
			}
            svgEvent.id++;
		}

        result = Decoupling(newLink);

		higShowVar = result;
		
		force = d3.layout.force()
					.nodes(nodes)
				    .links(result)
				    .size([svg_width, svg_height])
				    .linkDistance(150)
				    .charge(-1000)
				    .on("tick", tick)
				    .start(obj.point);

		var path = svg.selectAll(".path")
		    .data(result)
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
						.attr('group',function (data){return data.group});

		var text = nodes.append("text")
						.attr('class', 'text')
						.attr('width' , 30)
						.attr('height' , 30)
						.text(function (d){return d.group});

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
			if($(this).find('rect').attr('class').indexOf('clickedG') > 0){
				detail($(this));
			}
		}).on("mouseout","g",function (){
			$(".floatDiv").remove();
		});

        //并列数组
        function Decoupling(data){
            var x = [];
            for(var i = 0; i < data.length; i++){
                if(!data[i].length) x.push(data[i]);
                if(data[i].length > 1){
                    for(var j = 0; j < data[i].length; j++){
                        x.push(data[i][j]);
                    }
                }
            }
            return x;
        }

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
					bx 	: A_b_x_t,
					by 	: A_b_y_t,
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
					bx 	: b_t_x,
					by 	: b_t_y,
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
					bx 	: A_b_x_t1,
					by 	: A_b_y_t1,
					ab_x : k_ab_x,
					ab_y : k_ab_y,
					ba_x : k_ba_x,
					ba_y : k_ba_y
				}			
			}

		}
		function transform(d) {
            if(isNaN(d.x)){
                d.x = Math.random() * $(window).width();
                d.y = Math.random() * $(window).height();
            }
		    return "translate(" + (d.x - 15) + "," + (d.y - 15) + ")";
		}
		function transformText(d){            
            if(isNaN(d.x)){
                d.x = Math.random() * $(window).width();
                d.y = Math.random() * $(window).height();
            }
            return "translate(" + (d.x - 13) + "," + (d.y + 6) + ")";
		}
		function Szfun(x1,y1,x2,y2,x3,y3){
			var result = ( x2 * (y3 - y1) + x1 * (y2 - y3) + x3 * (y1 - y2) ) / Math.abs(( x2 * (y3 - y1) + x1 * (y2 - y3) + x3 * (y1 - y2) ));
			return Number(result);
		}
	}

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

	function detail(context){
		var data = arguments[1] ?  context.attr('transform'): context.find("rect").attr("transform"),
			x = Number(data.substring(10,data.length - 1).split(",")[0]),
			y = Number(data.substring(10,data.length - 1).split(",")[1]),
			div = document.createElement("div"),
			winW = window.innerWidth,
			winH = window.innerHeight,
			content = arguments[1] ? $(arguments[1]).attr('name') : context.attr("name");
		div.className = "floatDiv";			
		div.innerHTML = content;
		div.style.left = x - 231 +"px";
		div.style.bottom = winH - 40 - y + "px";
		$("body").append(div);	
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

$(document).ready(function (){

		var count = 0;

        $(".searchSpan").css("visibility","hidden");

		svg_width = $(".drawBord").width(),
		svg_height = $(".drawBord").height();
			
		color = d3.scale.category20();//设置20种颜色类别

		svg = d3.select("body")
				.select("svg");

		$(".white").click(function (){

			$("#cover").css('display','none');
			$(".input").val('');
			$("#editable-math").html('');

		});

		$("td").click(function (){

			var val = $(this).attr("alt");

			$("#MathInput").val($("#MathInput").val() + "$"+val+"$");

			$("#MathInput").focus();

			$("#MathInput").trigger("keydown");

		});

        $("svg").on("click",'.path',function (){

            if($(this).attr("refer")){

                var id = $(this).attr("id");
                $(".path").filter(function (d){

                    return $(this).attr("id") == id;

                }).css("stroke","#f00");

            }else{

               $(this).css("stroke") == "rgb(0, 128, 0)" ? $(this).css("stroke", "#f00") : $(this).css("stroke","green"); 

            }

        });

		$("#MathInput").on('keydown',function (){

			 Previewa.Update();
             
		});
        
        $("svg").on('contextmenu',function (e){
            var e = e || event,
                x = e.pageX,
                y = e.pageY;
            $("#contextmenu").css({"left" : x, "top" : y, "display" : "block"});
            return false;
        });

        $(".lateX-list-li").click(function (){

            $(".lateX-list-li").removeClass("actives");

            $(this).addClass("actives");

            var x = $(this).attr("data-name");

            $(".showTable").removeClass('show').css("display","none");

            $(".showTable").filter(function (){

                return $(this).hasClass(x);

            }).css("display","block");

        });

        $("#lateX img").click(function (){

            var x = $(this).attr("alt");
            $("#MathInput").val($("#MathInput").val() + "$" + x + "$");
            $("#MathInput").trigger("keydown").focus();

        });

        $("body").on('click','.submit_title_tip',commitDataToSQL);
        $("body").on('click','.rever_title_tip',function (){
            $(".title_tip").remove();
        })

        function commitDataToSQL(){
            var __title = $(".title").val(),
                __tip   = $(".tip").val(),
                __gName   = [],
                __g = $("g"),
                __hash = window.location.hash.split("=")[1];

            if(!__title || !__tip){
                if(!$(".title_tip_content").hasClass('has')){
                    $(".title_tip_content").append("请输入仓库内容").addClass('has');
                }
                return false;
            }

            for(var i = 0; i < __g.length; i++){
                __gName.push(__g[i].getAttribute("name"));
                __g[i].setAttribute("name","");
            }

            $("path").each(function (){
                $(this).attr("fill", $(this).css('fill')).attr("stroke", $(this).css('stroke')).attr("stroke-width", $(this).css('stroke-width'));
            });
            $("rect").each(function (){
                $(this).attr("fill",$(this).css("fill"));
            })

            var __svg_width = $("svg").css("width").replace("px",""),
                __svg_height = $("svg").css("height").replace("px","");

            var html = d3.select("svg")
                .attr("version", 1.1)
                .attr("xmlns", "http://www.w3.org/2000/svg")
                .attr('width',__svg_width)
                .attr('height',__svg_height)
                .node().parentNode.innerHTML;

            //console.log(html);

            var __imgsrc = 'data:image/svg+xml;base64,'+ btoa(html);

            for(var i = 0; i < __g.length; i++){
                __g[i].setAttribute("name",__gName[i]);
            }
    
            if(!__hash){        
                $.ajax({
                    type : "POST",
                    data : { "title" : __title, "tip" : __tip, "nodes" : JSON.stringify(svgEvent.nodes), "links" : JSON.stringify(svgEvent.allLinksData), "image" : __imgsrc},
                    dataType : "json",
                    // url : '/check/save_map/',
                    url : 'http://121.199.47.141/check/save_map/',
                    success : function (data){
                        console.log(data);
                        if(data.flag == "succeed"){
                            setTimeout(function (){
                                $(".title_tip").fadeOut('3000', function() {
                                    $(this).remove(); 
                                });
                            },500);
                        }
                    },
                    error : function (data){
                        console.log(data);
                    }
                });
            }else{
                $.ajax({
                    type : "POST",
                    data : { map_id : __hash, "title" : __title, "tip" : __tip, "nodes" : JSON.stringify(svgEvent.nodes), "links" : JSON.stringify(svgEvent.allLinksData), "image" : __imgsrc},
                    dataType : "json",
                    // url : '/check/update_map/',
                    url : 'http://121.199.47.141/check/update_map/',
                    success : function (data){
                        console.log(data);
                        if(data.flag == "succeed"){
                            setTimeout(function (){
                                $(".title_tip").fadeOut('3000', function() {
                                    $(this).remove(); 
                                });
                            },500);
                        }
                    },
                    error : function (data){
                        console.log(data);
                    }
                });
            }
        }

        var set = setTimeout(function(){

            $("#timeLine").animate({"left" : "20px"},500);

        },500);

        var scaleX = svg_width,
            scaleY = svg_height,
            posX = 0,
            posY = 0;

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

        var __mapid = window.location.hash.split("=")[1];

        __mapid ? rendermap(__mapid) : comm();

        function rendermap(__mapid){
            $.ajax({
                type : "POST",
                data : {map_id : __mapid},
                // url  : "/check/get_one_map/",
                url  : "http://121.199.47.141/check/get_one_map/",
                success : function (data){
                    //console.log(data);
                    if(data.flag == "succeed"){

                        var __obj = {};

                        __obj.data = JSON.parse(data.info[0].links);
                        BUFFER.data = JSON.parse(data.info[0].links);

                        svgEvent.nodes = JSON.parse(data.info[0].nodes);
                        BUFFER.nodes = JSON.parse(data.info[0].nodes);

                        for(var i = 0; i < svgEvent.nodes.length; i++){
                            svgEvent.group++;
                        }

                        svgEvent.loading(__obj);

                        svgEvent.allLinksData = __obj.data;

                        var __title = data.info[0].map_name ? data.info[0].map_name : '',
                            __tip   = data.info[0].map_describe ? data.info[0].map_describe : '';
                        comm(__title, __tip);
                    }
                },
                error : function (data){
                    console.log(data);
                },
                dataType : "json"
            });
        }

        function comm(title,tip){


            $(".commitData").click(function (){
                var __title = title || "",
                    __tip = tip || "",
                    __title_tip = $("<div class='title_tip'><div class='title_tip_content'><h1 class='header'>仓库信息</h1><input type='text' class='title' placeholder='仓库名称' value='"+__title+"'/><textarea type='text' class='tip' placeholder='仓库描述'>"+__tip+"</textarea><button class='submit_title_tip'>保存</button><button class='rever_title_tip'>返回</button></div></div>");
                $("body").append(__title_tip);
            });

        }

});