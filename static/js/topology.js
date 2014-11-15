
var draw = function () {
        network = jSBGN_to_d3( JSON.parse(jSBGN_network) );
        // d3 setup
        var svg_width = window.innerWidth;
        var svg_height = window.innerHeight;

        var color = d3.scale.category20();

        var force = d3.layout.force()
            .size([svg_width, svg_height])
            .charge(-100)
            .gravity(0.04)
            .linkDistance(150).
            linkStrength(0.6);

        var svg = d3.select("div#kmap-overview")
            .append("svg")
            .attr("width", svg_width)
            .attr("height", svg_height); 

        console.log("d3 setup complete.");

        // setup arrow
        arrow = svg.append("defs").append("marker");
        arrow.attr('id', 'arrow').attr('orient', 'auto')
            .attr('markerWidth', 10).attr('markerHeight', 10)
            .attr('refX', 20).attr('refY', 3);
        arrow.append('path').attr('d', 'M0,0 V6 L4,3 Z')
            .attr('fill', 'blue');

        console.log(network.nodes.length+' nodes')
        console.log(network.edges.length+' edges');

        // distance calculation requires link.source/target to be object links
        function getNodeById(id) {
            var i=-1;
            while (++i < network.nodes.length) {
                if ( network.nodes[i].id == id )
                    return network.nodes[i];
            }
            return null;
        }

        var i=-1;
        while (++i < network.edges.length) {
            var e,s,t;
            e = network.edges[i];
            s = getNodeById(e.source);
            t = getNodeById(e.target);
            e.source = s;
            e.target = t;
        }

        // import data to d3 force-directed layouting
        force.nodes(network.nodes)
            .links(network.edges)
            .start();

        console.log("data import complete.");

        var edges = svg.selectAll("line.edge")
            .data(network.edges).enter()
            .append("line")
            .attr("class", "edge")  // add class link for application of css style attributes
            .attr('marker-end', 'url(#arrow)');

        // layers: <g> elements
        var w = 40;
        var h = 16;
            // selectAll.data = apply the data in network.nodes to the selected svg elements, which already exist
        var nodes = svg.selectAll("g").data(network.nodes)
            .enter()    // for remaining unapplied data do:
            .append("g")
            .attr("class", "node")
            .attr("id", function(data) { return data.id; });
        // drag'n'drop handler
        nodes.call(force.drag);

        var rects = nodes.append("rect").attr("class", "rect")
            .attr("width", w).attr("height",  h).attr("rx", 5);

        var labels = nodes.append("text").attr("class", "label")
            .attr("transform", "translate(10, "+h/2+")")    // move text inside the rect
            .text( function(data) { return data.id; } );

        // on every x|y update do:
        force.on("tick", function() {
            edges.attr("x1", function(data) {
                return data.sourceNode.x+w/2;
            }).attr("y1", function(data) {
                return data.sourceNode.y+h/2;
            }).attr("x2", function(data) {
                return data.targetNode.x+w/2;
            }).attr("y2", function(data) {
                return data.targetNode.y+h/2;
            });
            rects.attr("x", function(data) {return data.x;})
                .attr("y", function(data) {return data.y;});
            labels.attr("x", function(data) { return data.x; })
                .attr("y", function(data) { return data.y; });
        });
}
