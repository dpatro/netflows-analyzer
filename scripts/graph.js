
function drawGraph(srcfile) {

  var graphDiv = d3.select("#graph");

  var height = parseInt(graphDiv.style("height")),
    width = parseInt(graphDiv.style("width")),
    radius = 6
    ;

  // get the flows
  d3.csv(srcfile+".edges", function(error, edges){
    if (error){
        alert(error);
        return;
    }
    globalDict.flows = edges;
  });

  // get the links
  d3.csv(srcfile+".links", function(error, links) {
    if (error){
        alter(error);
        return;
    }
    else {
        // Move data to globalDict
        globalDict.links = links;
        globalDict.nodes = {};

        // add the curvy lines
        function tick() {
            path.attr("d", function(d) {
                var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y,
                    dr = Math.sqrt(dx * dx + dy * dy);
                return "M" +
                    d.source.x + "," +
                    d.source.y + "A" +
                    dr + "," + dr + " 0 0,1 " +
                    d.target.x + "," +
                    d.target.y;
            });

            node.attr("transform", function(d){
                return "translate(" + d.x + "," + d.y + ")";
            });
        }

        // Form new links using the multiple edges
        links.forEach(function(link) {
            link.source = globalDict.nodes[link.source] || (globalDict.nodes[link.source] = {name: link.source});
            link.target = globalDict.nodes[link.target] || (globalDict.nodes[link.target] = {name: link.target});
            link.value = +link.value;
        });

        var force = d3.layout.force()
            .nodes(d3.values(globalDict.nodes))
            .links(links)
            .size([width, height])
            .linkDistance(30)
            .charge(-900)
            .gravity(0.4)
            .on("tick", tick)
            .start();

        // Set the range
        var  v = d3.scale.linear();

        // Scale the range of the data
        v.domain([d3.min(links, function(l) {return l.value; }), d3.max(links, function(l) {return l.value; })]);

        // assign a type per value to encode opacity
        links.forEach(function(link) {
        if (v(link.value) <= 0.25) {
            link.type = "twofive";
        } else if (v(link.value) <= 0.50 && v(link.value) > 0.25) {
            link.type = "fivezero";
        } else if (v(link.value) <= 0.75 && v(link.value) > 0.50) {
            link.type = "sevenfive";
        } else if (v(link.value) <= 1 && v(link.value) > 0.75) {
            link.type = "onezerozero";
        }
        });

        var svg = graphDiv.append("svg")
            .attr("width", width)
            .attr("height", height);

        // build the arrow.
        svg.append("svg:defs").selectAll("marker")
            .data(["end"])      // Different link/path types can be defined here
            .enter().append("svg:marker")    // This section adds in the arrows
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 15)
            .attr("refY", -1.5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");

        // add the links and the arrows
        var path = svg.append("svg:g").selectAll("path")
            .data(force.links())
            .enter().append("svg:path")
            .attr("class", function(d) { return "link " + d.type; })
            .attr("marker-end", "url(#end)");

        // define the nodes
        var node = svg.selectAll(".node")
            .data(force.nodes())
            .enter().append("g")
            .attr("class", "node")
            .call(force.drag);

        // add the nodes
        node.append("circle")
            .attr("r", 5)
            .on("mouseover", function (d) {
                d3.select(this).transition()
                .duration(200)
                .attr("r", 2*radius);
            })
            .on("mouseout", function (d) {
                d3.select(this).transition()
                .duration(200)
                .attr("r", radius);
            })
            .on("click", function(d){
                flows = {
                    ingress: globalDict.flows.filter(function(flow){ if (flow.dip == d.name) return flow;}),
                    outgress: globalDict.flows.filter(function(flow){ if (flow.sip == d.name) return flow;})
                }
                fillTable(flows);
            });


        // add the text
        node.append("text")
            .attr("x", 12)
            .attr("dy", ".35em")
            .text(function(d) { return d.name; });

        d3.select(self.frameElement).style("height", height + "px");
    }
  });
}