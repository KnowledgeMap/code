var buttonEvent = (function (button) {

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
		allLinksData : []
	};

//点击增加节点按钮向svg中添加节点
	svgEvent.append = function (dom) {
		//$('g,line').remove();
		$("#latex-source").focus();
		svgEvent.nodes.push(new Object({"name" : dom, "group" : svgEvent.group}));
		svgEvent.group++;
		svgEvent.temp = [];
		svgEvent.loading(svgEvent.allLinksData);
	}

	$("svg").on('click','g',function (e){
		svgEvent.clickG($(this));
	});

	$("svg").on('dblclick','g',function (){
		svgEvent.dbclickG($(this));
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
			if(svgEvent.temp.length >= 3){
				svgEvent.warming("警告","目前只支持最高三元算子的运算");
				return false;
			}else{	
				rect.attr('class',rect.attr('class')+" clickedG");
				svgEvent.temp.push(Number(inner));
			}
		}else{
			rect.attr('class','rect');
			for(var i = 0; i < svgEvent.temp.length; i++){
				if(svgEvent.temp[i] == Number(inner)){
					svgEvent.temp.splice(i, 1);
				}
			}
		}
	}

//双击节点之后表示选择结束，该节点为最终目标节点
	svgEvent.dbclickG = function (dom){

		var inner = dom.find('rect').attr("group"),data = svgEvent.allLinksData,temp = svgEvent.temp,newData;

		if(svgEvent.temp.length < 1 ){
			svgEvent.warming("警告","请选择足够多的节点以建立关系");
			return false;
		}

		switch(temp.length){
			case 1 : newData = "1011_" + temp[0] + "_" + inner; break;
			case 2 : newData = "11101111_" + temp[0] + "_" + temp[1] + "_" + inner; break;
		}

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
		$.ajaxSetup({
		  beforeSend: function(xhr, settings) {
		    if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
		      	xhr.setRequestHeader("X-CSRFToken", csrftoken);
		    }
		  }
		});

		$.ajax({
			url : "/kmap/result/",
			data : { "old" : JSON.stringify(data), "newLinks" : newData},
			type : "POST",
			success : function (data){
				console.log(data);
			},
			error : function (err){
				console.log(err);
			},
			dataType : "json"
		}); 
	}

	svgEvent.loading = function (data){

		$("g,.path,.floatDiv").remove();

		var links= data,newLink = [];

		for(var i = 0; i < links.length; i++){
			var tempdata = links[i].path.split("_");
			switch(Number(tempdata[0])){
				case 1011 : newLink.push(new Object({source : Number(tempdata[1]), target : Number(tempdata[2]), refer : "", two : 0})) ; break;
				case 1001 : newLink.push(new Object({source : Number(tempdata[1]), target : Number(tempdata[2]), refer : "", two : 1})) ; break;
				case 11101111 : newLink.push(new Object({source : Number(tempdata[1]), target : Number(tempdata[3]), refer : Number(tempdata[2]), two : 0, offset : "end"})); newLink.push(new Object({source : Number(tempdata[2]), target : Number(tempdata[3]), refer : Number(tempdata[1]), two : 0, offset : "end"})) ; newLink.push(new Object({source :Number(tempdata[1]), target : Number(tempdata[2]), display : "none"})) ; break;
				case 11001011 : newLink.push(new Object({source : Number(tempdata[1]), target : Number(tempdata[2]), refer : Number(tempdata[3]), two : 0, offset : "end"})); newLink.push(new Object({source : Number(tempdata[3]), target : Number(tempdata[2]), refer : Number(tempdata[1]), two : 1, offset : "end"})) ; newLink.push(new Object({source : Number(tempdata[1]), target : Number(tempdata[3]), display : "none"})) ; break;
				case 11100001 : newLink.push(new Object({source : Number(tempdata[1]), target : Number(tempdata[3]), refer : Number(tempdata[2]), two : 1, offset : "end"})); newLink.push(new Object({source : Number(tempdata[2]), target : Number(tempdata[3]), refer : Number(tempdata[1]), two : 1, offset : "end"})) ; newLink.push(new Object({source : Number(tempdata[1]), target : Number(tempdata[2]), display : "none"})) ; break;
				case 11101011 : newLink.push(new Object({source : Number(tempdata[1]), target : Number(tempdata[2]), refer : Number(tempdata[3]), two : 0, offset : "both"})); newLink.push(new Object({source : Number(tempdata[1]), target : Number(tempdata[3]), refer : Number(tempdata[2]), two : 0, offset : "both"})) ; newLink.push(new Object({source : Number(tempdata[2]), target : Number(tempdata[3]), refer : Number(tempdata[1]), two : 1, offset : "both"})); break;
				case 11101001 : newLink.push(new Object({source : Number(tempdata[1]), target : Number(tempdata[3]), refer : Number(tempdata[2]), two : 1, offset : "both"}));   newLink.push(new Object({source : Number(tempdata[1]), target : Number(tempdata[2]), refer : Number(tempdata[3]), two : 1, offset : "both"})) ;   newLink.push(new Object({source : Number(tempdata[2]), target : Number(tempdata[3]), refer : Number(tempdata[1]), two : 1, offset : "both"})); break;
			}
		}

		var force = d3.layout.force()
					.nodes(d3.values(svgEvent.nodes))
				    .links(newLink)
				    .size([svg_width, svg_height])
				    .linkDistance(150)
				    .charge(-300)
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
						.attr('group',function (data){return data.group});

		var text = nodes.append("text")
						.attr('class', 'text')
						.attr('width' , 30)
						.attr('height' , 30)
						.text(function (d){return "KEY";});

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
				content = $(this).attr("name");
			div.className = "floatDiv";			
			div.innerHTML = content;
			div.style.left = winW * 0.17 + x - 50 +"px";
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
			return "translate(" + (d.x - 13) + "," + ( d.y + 6) + ")";
		}
		function Szfun(x1,y1,x2,y2,x3,y3){
			var result = ( x2 * (y3 - y1) + x1 * (y2 - y3) + x3 * (y1 - y2) ) / Math.abs(( x2 * (y3 - y1) + x1 * (y2 - y3) + x3 * (y1 - y2) ));
			return Number(result);
		}

	}

	button.action = function (){
		var value = $("#editable-math").html();
		svgEvent.append(value);
		$(".input").val('');
		$(".textarea").siblings().remove();
	};

	return button;
})(window.buttonEvent || {})

$(document).ready(function (){
		comm.changeActive(1);
		svg_width = $(".drawBord").width(),
		svg_height = $(".drawBord").height();
			
		color = d3.scale.category20();//设置20种颜色类别

		svg = d3.select("body")
					.select("svg");
		$(".submit").click(buttonEvent.action);
		$("td").click(function (){
			var val = $(this).attr("alt"),latexMath = $('#editable-math'), latexSource = $('#latex-source');
			$("#latex-source").val($("#latex-source").val() + val);
			$("#latex-source").focus();
			latexMath.mathquill('latex', $("#latex-source").val());
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
		$("svg").on("mouseover","path",function (){
			$(this).css("stroke","#f00");
		}).on("mouseleave","path",function (){
			$(this).css("stroke","green");
		});
});
