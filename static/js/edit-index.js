var buttonEvent = (function (button){
	var svg = d3.select("svg"),
		svgEvent = svgEvent || {
			ctrlDown : false,
			count 	 : 0,
			edges 	 : [],
			data 	 : [],
			flag 	 : 2,
			group	 : 1,
			tempData : "",
			eachFlag : ""
		};

	svgEvent.appendG = function (val){
		svgEvent.svgDomG = svg.append('g')
						 .attr('class','svgG')
						 .attr('transform','translate(50,50)')
						 .attr('index', svgEvent.count)
						 .attr('clicked',false)
						 .attr('width',100)
						 .attr('height',100);

		svgEvent.count++;

		svgEvent.rect = svgEvent.svgDomG.append('circle')
						.attr('class','rect load')
						.attr('cx',100)
						.attr('cy',100)
						.attr('r',50);

		svgEvent.text = svgEvent.svgDomG.append('text')
						.attr('class','text')
						.attr('transform',function (){return 'translate(80, 90)';})
						.text(val);

		$(document).unbind().bind('keydown',function (e){
			if(e.keyCode == 17){
				svgEvent.ctrlDown = true;
			}
		}).bind('keyup',function (){
			svgEvent.ctrlDown = false;
			if($(".clickedG").length > 1){
				svgEvent.modeling($(".clickedG"));
			}
		});

		$(".rect").unbind('click').click(function (e){
			var e = e || event,
				domtarget = $(e.target.parentNode)[0];
			svgEvent.clickEd($(domtarget));
		})

	}

	svgEvent.clickEd = function (dom){
		var e = e || event,
			x = e.pageX,
			y = e.pageY,
			position = dom.attr('transform'),
			positionx = Number(position.substring(10,position.indexOf(','))),
			positiony = Number(position.substring(position.indexOf(",")+1,position.length-1));
		if(dom.attr('clicked') == 'false'){ 
			dom.attr('class',dom.attr('class') +' clickedG').attr('clicked',true);
			$("#drawBord").bind('mousemove',function (){svgEvent.mousemove(x,y,positionx,positiony,dom,dom.attr('index'))});
		}else{
			dom.attr('class','svgG').attr('clicked',false);
			$("#drawBord").unbind();
		}	
	}

	svgEvent.mousemove = function (x,y,positionx,positiony,dom,index){
		var e = e || event,
			ex = e.pageX - x + positionx,
			ey = e.pageY - y + positiony;
		if(!svgEvent.ctrlDown){
			dom.attr('transform','translate('+ex+','+ey+')');
		}
	}

	svgEvent.modeling = function (obj){
		
		for(var i = 0, len = obj.length; i< len; i++){
			svgEvent.data.push(new Object({"name" : $(obj[i]).find('text').html(), "group" : svgEvent.group}));
		}

		svgEvent.data.push(new Object({"name" : "link"}));
		i = 0;

		for( ; i < len ; i++){
			svgEvent.edges.push(new Object({"target" : Number($(obj[i]).attr('index')), "source" : svgEvent.flag, "value" : svgEvent.group}));
		}

		svgEvent.flag += 3;
		svgEvent.count++;
		svgEvent.group++;

    	$(".clickedG,.edge,.rect,.text").remove();

		force
			.nodes(svgEvent.data)
			.links(svgEvent.edges)
			.start();

		var edges = svg.selectAll('line.edge')
						.data(svgEvent.edges)
						.enter()
						.append('line')
						.attr('class','edge');

		var nodes = svg.selectAll('.clickedG')
						.data(svgEvent.data)
						.enter()
						.append('g')
						.call(force.drag);

		var w = 40,
			h = 50;

		var rect = nodes.append('rect')
						.attr('class','rect')
						.attr('width',50)
						.attr('height',50)
						.attr('rx',50)
						.attr('fill',function (data){var colors =  data.group ? color(data.group) : "#aaa"; return colors;});

		var text = nodes.append("image")
						.attr('xlink:href' , function(data){ var logo = data.group ? "" : "https://github.com/favicon.ico"; return logo})
						.attr('class', 'text')
						.attr('x' , function(data){ var x = data.group ? "" : -8; return x})
						.attr('y' , function(data){ var y = data.group ? "" : -8; return y})
						.attr('width' , function(data){ var width = data.group ? "" : 16; return width})
						.attr('height' , function(data){ var height = data.group ? "" : 16; return height})
						.attr('transform' , function(data){ var transform = data.group ? "translate(10, 25)" : ""; return transform})
		var data = nodes.append('title')
						.attr('class','aaa')
						.text(function (d){ var name = d.group ? d.name : "this is node"; return name});

		force.on("tick", function() {
								edges	.attr("x1", function(data) { return data.source.x+w/2; })
										.attr("y1", function(data) { return data.source.y+h/2; })
										.attr("x2", function(data) { return data.target.x+w/2; })
										.attr("y2", function(data) { return data.target.y+h/2; });

							    rect	.attr("x", function(data) { return data.x; })
										.attr("y", function(data) { return data.y; });

							    text	.attr("x", function(data) { return data.x; })
										.attr("y", function(data) { return data.y; });
							});
	}

	button.dom = $(".input");//得到用户当前的输入
	button.action = function (){
		svgEvent.appendG(button.dom.val());
		button.dom.val('');
	};

	return button;
})(window.buttonEvent || {})

$(document).ready(function (){
	$(".submit").click(buttonEvent.action);
});