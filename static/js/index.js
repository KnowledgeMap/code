d3.json("/kmap/net2/", function(svgEvent, graph) {
		force
			.nodes(svgEvent.nodes)
			.links(svgEvent.links)
			.start();

		var edges = svg.selectAll('line.edge')
						.data(svgEvent.links)
						.enter()
						.append('line')
						.attr('class','edge');

		var nodes = svg.selectAll('.clickedG')
						.data(svgEvent.nodes)
						.enter()
						.append('g')
						.call(force.drag);

		var w = 40,
			h = 40;

		var rect = nodes.append('rect')
						.attr('class','rect')
						.attr('width',30)
						.attr('height',30)
						.attr('rx',30)
						.attr('fill',function (data){var colors =  data.group ? color(data.group) : "#aaa"; return colors;});

		var text = nodes.append("image")
						.attr('xlink:href' , function(data){ var logo = data.group ? "" : "/static/svg/" + data.name + ".svg"; return logo})
						.attr('class', 'text')
						.attr('width' , 30)
						.attr('height' , 30);

		var data = nodes.append('title')
						.text(function (d){ var name = d.group ? d.name : "i am a node"; return name});

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
});

var hoverEvent = function (){
	$(".text").on('mouseover',function (e){
		var e = e || event,
			x = e.pageX,
			y = e.pageY,
			showBox = document.createElement('div'),
			content = $(this).parent().find('title').html();
		showBox.className = 'appendChild',
		showBox.style.position = "absolute",
		showBox.style.width = '150px',
		showBox.style.height = '30px',
		showBox.style.background = '#eee';
		showBox.style.left = (x  - 75)  + "px";
		showBox.style.top = y - 30  + 'px';
		showBox.style.color = '#000',
		showBox.style.lineHeight = '30px',
		showBox.style.textAlign = 'center',
		showBox.innerHTML = content,
		showBox.style.zIndex = 1000;

		$('body').append(showBox);
	}).on('mouseleave',function (){
		$(".appendChild").remove();
	});
};

setTimeout(hoverEvent,500);
