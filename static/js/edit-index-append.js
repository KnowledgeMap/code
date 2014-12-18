var buttonEvent = (function (button) {

<<<<<<< HEAD
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
		allData : [],
		id : 0
	};

//点击增加节点按钮向svg中添加节点
	svgEvent.append = function (dom) {
		$('g,line').remove();
		svgEvent.nodes.push(new Object({"name" : dom, "group" : svgEvent.group}));
		svgEvent.group++;
		svgEvent.temp = [];
		svgEvent.loading();
	}

	$("svg").on('click','g',function (){
		svgEvent.clickG($(this));
	});

	$("svg").on('dblclick','g',function (){
		svgEvent.dbclickG($(this));
	});

	$("svg").on("mouseover",'g',function (){
		var x = Number($(this).find("rect").attr("x")),
			y = Number($(this).find("rect").attr("y")),
			content = $(this).find("rect").attr("title"),
			winW = window.innerWidth,
			winH = window.innerHeight,
			div = document.createElement("div");
		div.className = "floatDiv";			
		div.innerHTML = content;
		div.style.left = winW * 0.17 + x - 50 +"px";
		div.style.bottom = winH - 30 - y + "px";
		$("body").append(div);
	}).on("mouseleave","g",function (){
		$(".floatDiv").remove();
	});

//字符串去处空格
svgEvent.trims = function (string){
		string = string.replace(/\ /g,'');
	return string;
}

svgEvent.trimHead = function (string){
	string = string.replace(/^\ /,'');
	return string;
}

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
			if(svgEvent.temp.length >= 3){
				svgEvent.warming("警告","目前只支持最高三元算子的运算");
				return false;
			}else{	
				rect.attr('class',rect.attr('class')+" clickedG");
				svgEvent.temp.push(new Object({ source : Number(inner)}));
			}
		}else{
			rect.attr('class','rect');	
		}
	}

//双击节点之后表示选择结束，该节点为最终目标节点
	svgEvent.dbclickG = function (dom){
		///////////////////////////////////////////////////////////////////
		//2 : 1011
		//3 : 1001
		//4 : 11101111
		//5 : 11101011
		/////////////////////////////////////////////////////////////////
		var inner = dom.find('rect').attr("group");
		//判断是节点还是算子
		if(!inner){
			svgEvent.warming("警告","算子不能和节点直接相连");
			return;
		}else{
			$(".alert").remove();
		}

		if(svgEvent.temp.length <= 1 ){
			svgEvent.warming("警告","请选择足够多的节点以建立关系");
			return false;
		}
		//双击之后要执行的操作
		svgEvent.temp.pop();
		svgEvent.temp.push(new Object({source : Number(inner)}));
		if(svgEvent.check(svgEvent.tempToalldata())){
			svgEvent.warming("警告","该关系已存在");
			return false;
		}
		svgEvent.allData.push(new Object({id : svgEvent.id++, operate : svgEvent.temp.length == 2 ? "/static/svg/1011.svg" : "/static/svg/11101111.svg", nodes : svgEvent.tempToalldata(), operateId : 2, length : svgEvent.temp.length}));
		svgEvent.findrelation(svgEvent.allData);
		svgEvent.makeLinks(svgEvent.allData);
		svgEvent.loading();
		svgEvent.temp = [];
	}

	svgEvent.findrelation = function (data){
		//false 为不是互补关系  true为互补关系
		var bool = true;
		for(var i = 0; i < data.length; i++){
			if(!data[i].nodes.length){
				data.splice(i--, 1);
			}
		}

		for(var i = 0; i < data.length - 1; i++){
			for(var j = i + 1; j < data.length; j++){
				var temp = svgEvent.eqTwo(data[i],data[j]);
				if(temp.length){
					svgEvent.allData.push(new Object({id : svgEvent.id++, operate : "/static/svg/1011.svg", nodes : {"source_0" : temp[0], "source_1" : temp[1]}, operateId : 2, length : 2}));				
				}else if(!temp){
					data[i].operate = "/static/svg/1001.svg";
					data[i].operateId = 3;
					data.splice(j--, 1);
				}
				svgEvent.eqTwoAndThree(data[i], data[j], i, j);	
				svgEvent.eqBothThree(data[i], data[j], i, j);
			}
		}
	}

	svgEvent.eqBothThree = function (objA, objB, i, j){
		var node1 = objA.nodes, node2 = objB.nodes;
		if(node1.length == node2.length){
			if(node1.length == 3){
				if(node1["source_0"] == node2["source_2"] || ((node1["source_0"] == 0)&&(node2["source_2"] == 0))){
					if(node1["source_1"] == node2["source_0"] || (node1["source_1"] == 0 && node2["source_0"] == 0)){
						if(node1["source_2"] == node2["source_1"] || (node1["source_2"] == 0 && node2["source_1"] == 0)){
							objA.operate = "/static/svg/11101011.svg";
							objA.operateId = 5;
							objA.nodes = new Object({source_0 : node1["source_1"], source_1 : node1["source_0"], source_2 : node1["source_2"], length : 3});
							svgEvent.allData.splice(j-- , 1);
						}
					}
					if(node1["source_1"] == node2["source_1"] || (node1["source_1"] == 0 && node2["source_1"] == 0)){
						if(node1["source_2"] == node2["source_0"] || (node1["source_2"] == 0 && node2["source_0"] == 0)){
							objA.operate = "/static/svg/11101011.svg";
							objA.operateId = 5;
							objA.nodes = new Object({source_0 : node1["source_1"], source_1 : node1["source_0"], source_2 : node1["source_2"], length : 3});
							svgEvent.allData.splice(j-- , 1);							
						}
					}
				}
				if(node1["source_1"] == node2["source_2"] || (node1["source_1"] == 0 && node2["source_2"] == 0)){
					if(node1["source_0"] == node2["source_1"] || (node1["source_0"] == 0 && node2["source_1"] == 0)){
						if(node1["source_2"] == node2["source_0"] || node1["source_2"] == 0 || node2["source_0"] == 0){
							objA.operate = "/static/svg/11101011.svg";
							objA.operateId = 5;
							objA.nodes = new Object({source_0 : node1["source_0"], source_1 : node1["source_1"], source_2 : node1["source_2"], length : 3});
							svgEvent.allData.splice(j-- , 1);														
						}
					}
					if(node1["source_0"] == node2["source_0"] || (node2["source_0"] == 0 && node1["source_0"] == 0)){
						if(node1["source_2"] == node2["source_1"] || (node1["source_2"] == 0 || node2["source_1"] == 0)){
							objA.operate = "/static/svg/11101011.svg";
							objA.operateId = 5;
							objA.nodes = new Object({source_0 : node1["source_0"], source_1 : node1["source_1"], source_2 : node1["source_2"], length : 3});
							svgEvent.allData.splice(j-- , 1);							
						}
					}
				}
			}
		}
	}

	svgEvent.eqTwoAndThree = function (obja, objb, i, j){
		if(obja.length != objb.length){
			obja.length > objb.length ? svgEvent.compare(obja, objb, i, j) : svgEvent.compare(objb, obja, i, j);
		}
	}

	svgEvent.compare = function (data1, data2, i, j){
		//data1包含data2
		//////////////////////////////////////////////
		var node1= data1.nodes, node2 = data2.nodes;
		if( (node1["source_0"] == node2["source_0"] || (node1["source_0"] == 0 && node2["source_0"] == 0)) && (node1["source_1"] == node2["source_1"] || (node1["source_1"] == 0 && node2["source_1"] == 0)) ){
			if(data2.operateId == 3){
				data1.nodes = new Object({source_0 : node1["source_0"], source_1 : node1["source_2"], length : 2});
				svgEvent.allData.push(new Object({id : svgEvent.id++, operate : "/static/svg/1011.svg", nodes : {source_0 : node1["source_1"], source_1 : node1["source_2"], length : 2}, length : 2, operateId : 2}));
			}else{
				data1.nodes = new Object({source_0 : node2["source_0"], source_1 : node1["source_2"], length : 2});
			}
			data1.operate = "/static/svg/1011.svg";
			data1.length = 2;
		}
		if( (node1["source_0"] == node2["source_1"] || (node1["source_0"] == 0 && node2["source_1"] == 0)) && (node1["source_1"] == node2["source_0"] || (node1["source_1"] == 0 && node2["source_0"] == 0)) ){
			if(data1.operateId == 5){
				data2.operateId = 3;
				data2.operate = "/svg/1001.svg";
			}else{
				data1.nodes = new Object({source_0 : node1["source_1"], source_1 : node1["source_2"], length : 2});
				data2.nodes = new Object({source_0 : node1["source_1"], source_1 : node1["source_0"], length : 2});
				data1.operate = "/static/svg/1011.svg";
				data2.operate = "/static/svg/1011.svg";
				data1.length = 2;
				data2.length = 2;
			}
		}
		///////////////////////////////////////////////
		if(node1["source_2"] == node2["source_0"]){
			if(data2.operateId == 3){
				if( (node1["source_0"] == node2["source_1"]) || (node1["source_1"] == node2["source_1"]) ){
					svgEvent.allData.pop();
				}else{
					svgEvent.splice(i, 1);
				}
			}else{
				data2.operate = "/static/svg/1001.svg";
				data2.operateId = 3;
				data1.operate = "/static/svg/1011.svg";
				data1.length = 2;
				if(node1["source_0"] == node2["source_1"]){
					data1.nodes = new Object({source_0 : node1["source_1"], source_1 : node1["source_2"]});
				}
				if(node1["source_1"] == node2["source_1"]){
					data1.nodes = new Object({source_0 : node1["source_0"], source_1 : node1["source_2"]});
				}
			}
		}
		//////////////////////////////////////////////
		if(node1["source_2"] == node2["source_1"]){
			if( (node1["source_0"] == node2["source_0"]) || (node1["source_1"] == node2["source_0"]) ){
				if(data2.operateId == 3){
					svgEvent.allData.pop();
				}else{
					svgEvent.allData.splice(i, 1);
				}
			}
		}
		//////////////////////////////////////////////
	}

	svgEvent.eqTwo = function (obja, objb){
		//有互补的为false  没有互补的为true
		var bool = true,objA = obja.nodes, objB = objb.nodes;
		if(objA.length == objB.length){
			if(objA.length == 2){
				if(objA["source_0"] == objB["source_1"]){
					if(objA["source_1"] == objB["source_0"]){
						bool = false;
					}else{
						if(obja.operateId == 3){
							bool = false;
							svgEvent.allData.push(new Object({id : svgEvent.id++, operate : "/static/svg/1011.svg", nodes : {"source_0" : objB["source_0"], "source_1" : objA["source_1"]}, length : 2, operateId : 2}));
						}else{
							bool = new Array( objA["source_1"],objB["source_0"] );
						}
					}
				}
				if(objA["source_0"] != objB["source_1"]){
					if(objA["source_1"] == objB["source_0"]){
						if( (obja.operateId == 2) && (objb.operateId == 2) ){
							bool = new Array( objB["source_1"], objA["source_0"] );
						}
					}
				}
				if(objA["source_0"] == objB["source_0"]){
					if(obja.operateId == 3){
						bool = new Array( objA["source_1"], objB["source_1"] );
					}
					if(objb.operateId == 3){
						bool = new Array( objB["source_1"], objA["source_1"] );
					}
				}
			}
		}
		return bool;
	}

	svgEvent.makeLinks = function (data){

		for(var i = 0; i < svgEvent.nodes.length; i++){
			if(svgEvent.nodes[i].src){
				svgEvent.nodes.splice(i--, 1);			
			}
		}

		svgEvent.group = svgEvent.nodes.length;
		svgEvent.links = [];

		for(var i = 0 ; i < data.length; i++){
			svgEvent.nodes.push(new Object({src : data[i].operate, name : "i am a node"}));
			for(var j =  0; j < data[i].length - 1; j++){
				svgEvent.links.push(new Object({source : data[i].nodes["source_" + j], target : svgEvent.nodes.length - 1}));
			}
			svgEvent.links.push(new Object({source : svgEvent.nodes.length - 1, target : data[i].nodes["source_" + j]}));
		}
	}

	svgEvent.tempToalldata = function (){
		var node = {};
		for(var i = 0; i < svgEvent.temp.length; i++){
			node["source_"+i] = svgEvent.temp[i].source;
		}
		node.length = i;
		return node;
	}

	svgEvent.check = function (data){
		for(var i = 0; i < svgEvent.allData.length; i++){
			var nodes = svgEvent.allData[i].nodes;
			if( (data["source_0"] == nodes["source_0"] || (data["source_0"] == 0 && nodes["source_0"] == 0)) && (data["source_1"] == nodes["source_1"] || (data["source_1"] == 0 && nodes["source_1"] == 0) ) ){
				if(nodes["source_2"] == 0 || nodes["source_2"]){
					if(data["source_2"] == nodes["source_2"]){
						return true;
					}else{
						return false;
					}
				}else{
					return true;
				}
			}
		}
	}

	svgEvent.loading = function (){

		$("g,line").remove();

		force
			.nodes(svgEvent.nodes)
			.links(svgEvent.links)
			.start();

		var edges = svg.selectAll('line.edge')
						.data(svgEvent.links)
						.enter()
						.append('line')
						.attr('class','edge');

		var nodes = svg.selectAll('g')
						.data(svgEvent.nodes)
						.enter()
						.append('g')
						.attr('source',function (data){return data.source})
						.attr('target',function (data){return data.target})
						.call(force.drag);

		var w = 40,
			h = 70;

		var rect = nodes.append('rect')
						.attr('class','rect')
						.attr('width',function (data){var width = (data.group == 0 || data.group) ? 30 : 15; return width;})
						.attr('height',function (data){var height = (data.group == 0 || data.group)  ? 30 : 15; return height;})
						.attr('rx',function (data){var rx = (data.group == 0 || data.group)  ? 30 : 15; return rx;})
						.attr('group',function (data){return data.group})
						.attr('fill',function (data){ return color(data.group)})
						.attr("title",function (d){var content = (d.group == 0 || d.group)  ? d.name : ""; return content;});

		var image = nodes.append("image")
						.attr('xlink:href' , function(data){ var logo = data.group ? "" : data.src; return logo})
						.attr('class', 'text')
						.attr('x' , function (data){ var x = data.group ? "" : -16; return x})
						.attr('y' , function (data){var y = data.group ? "" : -16; return y})
						.attr('width',function (data){var width = data.group ? "" : 15; return width})
						.attr('height',function (data){var height = data.group ? "" : 15; return height});
		
		var text = nodes.append("text")						
						.attr('transform' , 'translate(17, 50)')
						.text(function (d){var content = d.src ? "" : "KEY"; return content;});


		force.on("tick", function() {

			$(".floatDiv").remove();

			edges	.attr("x1", function(data) { return data.source.x+w/2; })
					.attr("y1", function(data) { return data.source.y+h/2; })
					.attr("x2", function(data) { return data.target.x+w/2; })
					.attr("y2", function(data) { return data.target.y+h/2; });

			rect	.attr("x", function(data) { return data.x+16; })
					.attr("y", function(data) { return data.y+30; });
			
			text	.attr("x", function(data) { return data.x; })
					.attr("y", function(data) { return data.y; });

			image   .attr("x", function (data){ return data.x+16; })
					.attr("y", function (data){ return data.y+Number(30); });
		});

	}

	button.action = function (){

		var value = $("#editable-math").html();
		svgEvent.append(value);
		$(".input").val('');
		$("#editable-math").children().remove();

	};

	return button;
})(window.buttonEvent || {})

$(document).ready(function (){
		svg_width = $(".drawBord").width(),
		svg_height = $(".drawBord").height();
			
		color = d3.scale.category20();//设置20种颜色类别

		force = d3.layout.force()//设置基于物理模拟的位置链接
							.size([svg_width, svg_height])
							.charge(-300)//获取或设置节点间的电荷数（电荷数决定节点时排斥还是吸引）
							.gravity(0.08)//设置节点间的引力强度
							.linkDistance(10)
							.linkStrength(0.6);//连接强度

		svg = d3.select("body")
					.select("svg");
		$(".submit").click(buttonEvent.action);
		$("td").click(function (){
			var val = $(this).attr("alt");
			$("#latex-source").val($("#latex-source").val() + val);
		});
		$("td").css("backgroundImage","url(/static/img/math.png)");
		var left = 0, top = 0,flag = true;
		for(var i = 0; i < $("td").length; i++){
			if(i % 12 == 0 && i != 0){
				if(flag){
					top -= 45;
					flag = false;
				}else{
					top -= 25;
				}
				left = 0;
			}
			$("td:eq("+i+")").css("background","url(/static/img/math.png) "+left+"px "+top+"px");
			left -= 30;
		}
});
=======
    //建立对象存放变量
    var svgEvent = svgEvent || {
        group: 0,
        nodes: [],
        links: [],
        temp: [],
        alertElement: '<div class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong>{title}:</strong>{content}</div>',
        allData : [],
        id : 0
    };

    //点击增加节点按钮向svg中添加节点
    svgEvent.append = function (dom) {
        $('g,line').remove();
        svgEvent.nodes.push(new Object({"name" : dom.val(), "group" : svgEvent.group}));
        svgEvent.group++;
        svgEvent.temp = [];
        svgEvent.loading();
    }

    $("svg").on('click','g',function (){
        svgEvent.clickG($(this));
    });

    $("svg").on('dblclick','g',function (){
        svgEvent.dbclickG($(this));
    });

    //字符串去处空格
    svgEvent.trims = function (string){
        string = string.replace(/\ /g,'');
        return string;
    }

    svgEvent.trimHead = function (string){
        string = string.replace(/^\ /,'');
        return string;
    }

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
            if(svgEvent.temp.length >= 3){
                svgEvent.warming("警告", "目前只支持最高三元算子的运算");
                return false;
            }else{
                rect.attr('class',rect.attr('class')+" clickedG");
                svgEvent.temp.push(new Object({ source : Number(inner)}));
            }
        }else{
            rect.attr('class','rect');
        }
    }

//双击节点之后表示选择结束，该节点为最终目标节点
    svgEvent.dbclickG = function (dom) {
        ///////////////////////////////////////////////////////////////////
        //2 : 1011
        //3 : 1001
        //4 : 11101111
        //5 : 11101011
        /////////////////////////////////////////////////////////////////
        var inner = dom.find('rect').attr("group");
        //判断是节点还是算子
        if(!inner){
            svgEvent.warming("警告","算子不能和节点直接相连");
            return;
        }else{
            $(".alert").remove();
        }

        if(svgEvent.temp.length <= 1 ){
            svgEvent.warming("警告","请选择足够多的节点以建立关系");
            return false;
        }
        //双击之后要执行的操作
        svgEvent.temp.pop();
        svgEvent.temp.push(new Object({source : Number(inner)}));
        if(svgEvent.check(svgEvent.tempToalldata())){
            svgEvent.warming("警告","该关系已存在");
            return false;
        }
        svgEvent.allData.push(new Object({
            id : svgEvent.id++,
            operate : svgEvent.temp.length == 2 ? "/static/img/1011.png" : "/static/img/11101111.png",
            nodes : svgEvent.tempToalldata(),
            operateId : 2,
            length : svgEvent.temp.length}));
        svgEvent.findrelation(svgEvent.allData);
        svgEvent.makeLinks(svgEvent.allData);
        svgEvent.loading();
        svgEvent.temp = [];
    }

    svgEvent.findrelation = function (data){
        //false 为不是互补关系  true为互补关系
        var bool = true;
        for(var i = 0; i < data.length; i++){
            if(!data[i].nodes.length){
                data.splice(i--, 1);
            }
        }

        for(var i = 0; i < data.length - 1; i++){
            for(var j = i + 1; j < data.length; j++){
                var temp = svgEvent.eqTwo(data[i],data[j]);
                if(temp.length){
                    svgEvent.allData.push(new Object({
                        id: svgEvent.id++,
                        operate: "/static/img/1011.png",
                        nodes: {"source_0": temp[0], "source_1": temp[1]},
                        operateId: 2,
                        length: 2}));
                }else if(!temp){
                    data[i].operate = "/static/img/1001.png";
                    data[i].operateId = 3;
                    data.splice(j--, 1);
                }
                svgEvent.eqTwoAndThree(data[i], data[j], i, j);
                svgEvent.eqBothThree(data[i], data[j], i, j);
            }
        }
    }

    svgEvent.eqBothThree = function (objA, objB, i, j){
        var node1 = objA.nodes, node2 = objB.nodes;
        if(node1.length == node2.length){
            if(node1.length == 3){
                if(node1["source_0"] == node2["source_2"] || ((node1["source_0"] == 0)&&(node2["source_2"] == 0))){
                    if(node1["source_1"] == node2["source_0"] || (node1["source_1"] == 0 && node2["source_0"] == 0)){
                        if(node1["source_2"] == node2["source_1"] || (node1["source_2"] == 0 && node2["source_1"] == 0)){
                            objA.operate = "/static/img/11101011.png";
                            objA.operateId = 5;
                            objA.nodes = new Object({
                                source_0: node1["source_1"],
                                source_1: node1["source_0"],
                                source_2: node1["source_2"],
                                length: 3});
                            svgEvent.allData.splice(j-- , 1);
                        }
                    }
                    if(node1["source_1"] == node2["source_1"] || (node1["source_1"] == 0 && node2["source_1"] == 0)){
                        if(node1["source_2"] == node2["source_0"] || (node1["source_2"] == 0 && node2["source_0"] == 0)){
                            objA.operate = "/static/img/11101011.png";
                            objA.operateId = 5;
                            objA.nodes = new Object({source_0 : node1["source_1"], source_1 : node1["source_0"], source_2 : node1["source_2"], length : 3});
                            svgEvent.allData.splice(j-- , 1);
                        }
                    }
                }
                if(node1["source_1"] == node2["source_2"] || (node1["source_1"] == 0 && node2["source_2"] == 0)){
                    if(node1["source_0"] == node2["source_1"] || (node1["source_0"] == 0 && node2["source_1"] == 0)){
                        if(node1["source_2"] == node2["source_0"] || node1["source_2"] == 0 || node2["source_0"] == 0){
                            objA.operate = "/static/img/11101011.png";
                            objA.operateId = 5;
                            objA.nodes = new Object({
                                source_0: node1["source_0"],
                                source_1: node1["source_1"],
                                source_2: node1["source_2"],
                                length: 3});
                            svgEvent.allData.splice(j-- , 1);
                        }
                    }
                    if(node1["source_0"] == node2["source_0"] || (node2["source_0"] == 0 && node1["source_0"] == 0)){
                        if(node1["source_2"] == node2["source_1"] || (node1["source_2"] == 0 || node2["source_1"] == 0)){
                            objA.operate = "/static/img/11101011.png";
                            objA.operateId = 5;
                            objA.nodes = new Object({
                                source_0: node1["source_0"],
                                source_1: node1["source_1"],
                                source_2: node1["source_2"],
                                length: 3});
                            svgEvent.allData.splice(j-- , 1);
                        }
                    }
                }
            }
        }
    }

    svgEvent.eqTwoAndThree = function (obja, objb, i, j){
        if(obja.length != objb.length){
            obja.length > objb.length ? svgEvent.compare(obja, objb, i, j) : svgEvent.compare(objb, obja, i, j);
        }
    }

    svgEvent.compare = function (data1, data2, i, j){
        //data1包含data2
        //////////////////////////////////////////////
        var node1= data1.nodes, node2 = data2.nodes;
        if( (node1["source_0"] == node2["source_0"] || (node1["source_0"] == 0 && node2["source_0"] == 0)) && (node1["source_1"] == node2["source_1"] || (node1["source_1"] == 0 && node2["source_1"] == 0)) ){
            if(data2.operateId == 3){
                data1.nodes = new Object({
                    source_0: node1["source_0"],
                    source_1: node1["source_2"],
                    length: 2});
                svgEvent.allData.push(new Object({
                    id: svgEvent.id++,
                    operate: "/static/img/1011.png",
                    nodes: {source_0 : node1["source_1"], source_1 : node1["source_2"], length : 2},
                    length: 2,
                    operateId: 2}));
            }else{
                data1.nodes = new Object({
                    source_0: node2["source_0"],
                    source_1: node1["source_2"],
                    length: 2});
            }
            data1.operate = "/static/img/1011.png";
            data1.length = 2;
        }
        if( (node1["source_0"] == node2["source_1"] || (node1["source_0"] == 0 && node2["source_1"] == 0)) && (node1["source_1"] == node2["source_0"] || (node1["source_1"] == 0 && node2["source_0"] == 0)) ){
            if(data1.operateId == 5){
                data2.operateId = 3;
                data2.operate = "/static/img/1001.png";
            }else{
                data1.nodes = new Object({
                    source_0: node1["source_1"],
                    source_1: node1["source_2"],
                    length: 2});
                data2.nodes = new Object({
                    source_0: node1["source_1"],
                    source_1: node1["source_0"],
                    length: 2});
                data1.operate = "/static/img/1011.png";
                data2.operate = "/static/img/1011.png";
                data1.length = 2;
                data2.length = 2;
            }
        }
        ///////////////////////////////////////////////
        if(node1["source_2"] == node2["source_0"]){
            if(data2.operateId == 3){
                if( (node1["source_0"] == node2["source_1"]) || (node1["source_1"] == node2["source_1"]) ){
                    svgEvent.allData.pop();
                }else{
                    svgEvent.splice(i, 1);
                }
            }else{
                data2.operate = "/static/img/1001.png";
                data2.operateId = 3;
                data1.operate = "/static/img/1011.png";
                data1.length = 2;
                if(node1["source_0"] == node2["source_1"]){
                    data1.nodes = new Object({
                        source_0: node1["source_1"],
                        source_1: node1["source_2"]});
                }
                if(node1["source_1"] == node2["source_1"]){
                    data1.nodes = new Object({
                        source_0: node1["source_0"],
                        source_1: node1["source_2"]});
                }
            }
        }
        //////////////////////////////////////////////
        if(node1["source_2"] == node2["source_1"]){
            if( (node1["source_0"] == node2["source_0"]) || (node1["source_1"] == node2["source_0"]) ){
                if(data2.operateId == 3){
                    svgEvent.allData.pop();
                }else{
                    svgEvent.allData.splice(i, 1);
                }
            }
        }
        //////////////////////////////////////////////
    }

    svgEvent.eqTwo = function (obja, objb){
        //有互补的为false  没有互补的为true
        var bool = true,objA = obja.nodes, objB = objb.nodes;
        if(objA.length == objB.length){
            if(objA.length == 2){
                if(objA["source_0"] == objB["source_1"]){
                    if(objA["source_1"] == objB["source_0"]){
                        bool = false;
                    }else{
                        if(obja.operateId == 3){
                            bool = false;
                            svgEvent.allData.push(new Object({
                                id: svgEvent.id++,
                                operate : "/static/img/1011.png",
                                nodes: {"source_0": objB["source_0"], "source_1": objA["source_1"]},
                                length: 2,
                                operateId: 2}));
                        }else{
                            bool = new Array( objA["source_1"],objB["source_0"] );
                        }
                    }
                }
                if(objA["source_0"] != objB["source_1"]){
                    if(objA["source_1"] == objB["source_0"]){
                        if( (obja.operateId == 2) && (objb.operateId == 2) ){
                            bool = new Array( objB["source_1"], objA["source_0"] );
                        }
                    }
                }
                if(objA["source_0"] == objB["source_0"]){
                    if(obja.operateId == 3){
                        bool = new Array( objA["source_1"], objB["source_1"] );
                    }
                    if(objb.operateId == 3){
                        bool = new Array( objB["source_1"], objA["source_1"] );
                    }
                }
            }
        }
        return bool;
    }

    svgEvent.makeLinks = function (data){

        for(var i = 0; i < svgEvent.nodes.length; i++){
            if(svgEvent.nodes[i].src){
                svgEvent.nodes.splice(i--, 1);
            }
        }

        svgEvent.group = svgEvent.nodes.length;
        svgEvent.links = [];

        for(var i = 0 ; i < data.length; i++){
            svgEvent.nodes.push(new Object({src : data[i].operate, name : "i am a node"}));
            for(var j =  0; j < data[i].length - 1; j++){
                svgEvent.links.push(new Object({source : data[i].nodes["source_" + j], target : svgEvent.nodes.length - 1}));
            }
            svgEvent.links.push(new Object({source : svgEvent.nodes.length - 1, target : data[i].nodes["source_" + j]}));
        }
    }

    svgEvent.tempToalldata = function (){
        var node = {};
        for(var i = 0; i < svgEvent.temp.length; i++){
            node["source_"+i] = svgEvent.temp[i].source;
        }
        node.length = i;
        return node;
    }

    svgEvent.check = function (data){
        for(var i = 0; i < svgEvent.allData.length; i++){
            var nodes = svgEvent.allData[i].nodes;
            if( (data["source_0"] == nodes["source_0"] || (data["source_0"] == 0 && nodes["source_0"] == 0)) && (data["source_1"] == nodes["source_1"] || (data["source_1"] == 0 && nodes["source_1"] == 0) ) ){
                if(nodes["source_2"] == 0 || nodes["source_2"]){
                    if(data["source_2"] == nodes["source_2"]){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return true;
                }
            }
        }
    }

    svgEvent.loading = function (){

        $("g,line").remove();

        force
            .nodes(svgEvent.nodes)
            .links(svgEvent.links)
            .start();

        var edges = svg.selectAll('line.edge')
                        .data(svgEvent.links)
                        .enter()
                        .append('line')
                        .attr('class','edge');

        var nodes = svg.selectAll('g')
                        .data(svgEvent.nodes)
                        .enter()
                        .append('g')
                        .attr('source',function (data){return data.source})
                        .attr('target',function (data){return data.target})
                        .call(force.drag);

        var w = 40,
            h = 70;

        var rect = nodes.append('rect')
                        .attr('class','rect')
                        .attr('width',function (data){var width = (data.group == 0 || data.group) ? 30 : 15; return width;})
                        .attr('height',function (data){var height = (data.group == 0 || data.group)  ? 30 : 15; return height;})
                        .attr('rx',function (data){var rx = (data.group == 0 || data.group)  ? 30 : 15; return rx;})
                        .attr('group',function (data){return data.group})
                        .attr('fill',function (data){ return color(data.group)});

        var image = nodes.append("image")
                        .attr('xlink:href' , function(data){ var logo = data.group ? "" : data.src; return logo})
                        .attr('class', 'text')
                        .attr('x' , function (data){ var x = data.group ? "" : -16; return x})
                        .attr('y' , function (data){var y = data.group ? "" : -16; return y})
                        .attr('width',function (data){var width = data.group ? "" : 15; return width})
                        .attr('height',function (data){var height = data.group ? "" : 15; return height});

        var text = nodes.append("text")
                        .attr('transform' , 'translate(10, 50)')
                        .text(function (d){var content = (d.group == 0 || d.group)  ? d.name : ""; return content;});


        force.on("tick", function() {
            edges   .attr("x1", function(data) { return data.source.x+w/2; })
                    .attr("y1", function(data) { return data.source.y+h/2; })
                    .attr("x2", function(data) { return data.target.x+w/2; })
                    .attr("y2", function(data) { return data.target.y+h/2; });

            rect    .attr("x", function(data) { return data.x+16; })
                    .attr("y", function(data) { return data.y+30; });

            text    .attr("x", function(data) { return data.x; })
                    .attr("y", function(data) { return data.y; });

            image   .attr("x", function (data){ return data.x+16; })
                    .attr("y", function (data){ return data.y+Number(30); });
        });

    }

    button.dom = $(".input");
    button.action = function (){
        svgEvent.append(button.dom);
        button.dom.val('');
    };

    return button;
})(window.buttonEvent || {})

$(document).ready(function (){
    $(".submit").click(buttonEvent.action);

});
>>>>>>> 59013819dfd11c5b3595a64575569375676513bc
