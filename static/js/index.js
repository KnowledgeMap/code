function loading(data){
	d3.json(data, function(svgEvent,error) {
		var newLink = [];
		var links = svgEvent.links,
			nodes = svgEvent.nodes;
		for(var i = 0; i < links.length; i++){
			var tempdata = links[i].path.split("_");
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
		for(var i = 0; i < newLink.length; i++){
			for(var j = 0; j < nodes.length; j++){
				if(nodes[j].name == newLink[i].source){
					newLink[i].source = j
				}
				if(nodes[j].name == newLink[i].target){
					newLink[i].target = j;
				}
				if(nodes[j].name == newLink[i].refer){
					newLink[i].refer = j;
				}
			}
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

		var text = nodes.append("text")
						.attr('class', 'text')
						.attr('width' , 30)
						.attr('height' , 30)
						.text(function (d){return d.name});

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

		$("svg").on("mouseover",'g',function (){
			var data = $(this).find("rect").attr("transform"),
				x = Number(data.substring(10,data.length - 1).split(",")[0]),
				y = Number(data.substring(10,data.length - 1).split(",")[1]),
				div = document.createElement("div"),
				winW = window.innerWidth,
				winH = window.innerHeight,
				content = $(this).find("text")[0].innerHTML;
			div.className = "floatDiv";			
			div.innerHTML = content;
			div.style.left = x - 63 +"px";
			div.style.bottom = winH - 40 - y + "px";
			$("body").append(div);
		}).on("mouseout","g",function (){
			$(".floatDiv").remove();
		});

	function tick() {
		path.attr("d", linkArc);
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
			Sz = Szfun(x1,y1,x0,y0,x2,y2);
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
	  	return "translate(" + (d.x - 15) + "," + (d.y - 15) + ")";
	}
	function transformText(d){
		return "translate(" + (d.x - 3) + "," + ( d.y + 3) + ")";
	}
	function Szfun(x1,y1,x2,y2,x3,y3){
		var result = ( x2 * (y3 - y1) + x1 * (y2 - y3) + x3 * (y1 - y2) ) / Math.abs(( x2 * (y3 - y1) + x1 * (y2 - y3) + x3 * (y1 - y2) ));
		return Number(result);
	}
});
}
loading("/static/js/data.json");