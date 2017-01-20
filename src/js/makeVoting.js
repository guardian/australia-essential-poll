import * as d3 from 'd3'

export default function makeVoting(debug, chartData) {

		// (debug) ? console.log("chartData",chartData) : null;

		var votingIntention = chartData.sheets.votingIntention;

		// Shared vars and functions

		var getW = document.querySelector("#primaryVotingContainer").getBoundingClientRect().width;
        var getH = getW*0.6;
        var miniPadding = 25;
        var margin = {top: 20, right: 20, bottom: (getH*0.25), left: 40},
	        margin2 =  {top: (getH*0.75 + miniPadding), right: 10, bottom: 20, left: 40},
	        width = getW - margin.left - margin.right,
	        height = getH - margin.top - margin.bottom,
	        height2 = getH - margin2.top - margin2.bottom;

	    // console.log("height",height,"width",width,"margin",margin, "margin2", margin2, "height2", height2);    

	    var parseDate = d3.timeParse("%-d/%-m/%Y");    

	    var extentY = [];

	    votingIntention.forEach(function (d,i) {

	    	d['alp'] = +d['alp'];
	    	d['lnp'] = +d['lnp'];

	    	d['greens'] = +d['greens'];
	    	
	    	if (d['ON'] == "") {
	    		d['ON'] = null;
	    	}
	    	else {
	    	d['ON'] = +d['ON'];
	    	}

	    	extentY.push(+d['alp']);
	    	extentY.push(+d['lnp']);
	    	extentY.push(+d['greens']);
	    	extentY.push(+d['ON']);

	    });

	    console.log("votingIntention",votingIntention);

	    votingIntention.sort(function (a, b) {
			if (a.date > b.date) {
				return 1;
			}
			if (a.date < b.date) {
				return -1;
			}
			return 0;
		});

	    var coalition = votingIntention[votingIntention.length -1]['lnp'];
	    var labor = votingIntention[votingIntention.length - 1]['alp'];
	    var greens = votingIntention[votingIntention.length - 1]['greens'];
	    var on = votingIntention[votingIntention.length - 1]['ON'];


	    d3.select("#primaryNotes").html(`If an election were held today, the primary vote for the <span class='coalitionKey'>Coalition</span> would be <span class='coalitionHighlight'>${coalition}%</span>, <span class='laborKey'>Labor's</span> would be <span class='laborHighlight'>${labor}%</span>, the <span class='greensKey'>Greens's</span> would be <span class='greensHighlight'>${greens}%</span>, and <span class='onKey'>One Nation's</span> would be <span class='onHighlight'>${on}%</span></span>`);


	    
	    // Two party preferred chart

	    function makeChart() {

	    	console.log(votingIntention);

	    	var endDate = votingIntention[votingIntention.length -1].date;
			var startDate = d3.timeDay.offset(endDate, -365);
			var padDate = d3.timeDay.offset(endDate, +2);
	    	
	    	var x = d3.scaleTime().range([0, width]),
				y = d3.scaleLinear().range([height, 0]),
				x2 = d3.scaleTime().range([0, width]),
				y2 = d3.scaleLinear().range([height2, 0]);

	        var xAxis = d3.axisBottom()
				.scale(x);

		    var xAxis2 = d3.axisBottom()
		        .scale(x2);

		    var yAxis = d3.axisLeft()
				.scale(y);

			var alpNavLine = d3.line()
				.x(function(d) { return x2(d.date); })
				.y(function(d) { return y2(d.alp); });

			var alpLine = d3.line()
				.x(function(d) { return x(d.date); })
				.y(function(d) { return y(d.alp); });

			var lnpNavLine = d3.line()
				.x(function(d) { return x2(d.date); })
				.y(function(d) { return y2(d.lnp); });

			var lnpLine = d3.line()
				.x(function(d) { return x(d.date); })
				.y(function(d) { return y(d.lnp); });

			var greensNavLine = d3.line()
				.x(function(d) { return x2(d.date); })
				.y(function(d) { return y2(d.greens); });

			var greensLine = d3.line()
				.x(function(d) { return x(d.date); })
				.y(function(d) { return y(d.greens); });

			var onNavLine = d3.line()
				.defined(function(d) { return d.ON; })
				.x(function(d) { return x2(d.date); })
				.y(function(d) { return y2(d.ON); });

			var onLine = d3.line()
				.defined(function(d) { return d.ON; })
				.x(function(d) { return x(d.date); })
				.y(function(d) { return y(d.ON); });		

			var svg = d3.select("#primaryVotingContainer").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom);

			svg.append("defs").append("clipPath")
				.attr("id", "clip")
				.append("rect")
				.attr("width", width)
				.attr("height", height);

			var focus = svg.append("g")
				.attr("class", "focus")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var context = svg.append("g")
				.attr("class", "context")
				.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

			x.domain([startDate, endDate]);
			y.domain(d3.extent(extentY));
			x2.domain([d3.min(votingIntention, function(d) { return d.date; }), endDate]);
			y2.domain(y.domain());

			focus.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis);

			var yAxisContainer = focus.append("g")
                .attr("class", "y axis")
                .call(yAxis);

            focus.append("line")
				.attr("class", "trendline")
				.attr("x1", function(d) { return x(votingIntention[0].date); })
				.attr("y1", function(d) { return y(50); })
				.attr("x2", function(d) { return x(endDate); })
				.attr("y2", function(d) { return y(50); })
				.style("stroke-dasharray", ("3, 3"))
				.attr("stroke", "#808080")
				.attr("clip-path", "url(#clip)")
				.attr("stroke-width", 1);   

			// focus.append("rect")
			// 	.attr("class", "mouseOverlay")
			// 	.attr("opacity", 0)
			// 	.attr("width", width)
			// 	.attr("height", height)
			// 	.on("mouseover", function() { lineTip.style("display", null); })
			// 	.on("mouseout", function() { lineTip.style("display", "none"); })
			// 	.on("touchstart", function() { lineTip.style("display", null); })
			// 	.on("mousemove", mousemove);

			focus.append("path")
				.datum(votingIntention)
				.attr("class", "line alpLine")
				.attr("stroke-width", 1)
				.attr("stroke", "#b51800")
				.attr("clip-path", "url(#clip)")
				.attr("d", alpLine);

			focus.append("path")
				.datum(votingIntention)
				.attr("class", "line lnpLine")
				.attr("stroke-width", 1)
				.attr("stroke", "#005689")
				.attr("clip-path", "url(#clip)")
				.attr("d", lnpLine);

			focus.append("path")
				.datum(votingIntention)
				.attr("class", "line greensLine")
				.attr("stroke-width", 1)
				.style("stroke-dasharray", ("10, 3"))
				.attr("stroke", "#298422")
				.attr("clip-path", "url(#clip)")
				.attr("d", greensLine);

			focus.append("path")
				.datum(votingIntention)
				.attr("class", "line onLine")
				.attr("stroke-width", 1)
				.attr("stroke", "#ff9b0b")
				.attr("clip-path", "url(#clip)")
				.attr("d", onLine)

			// var alpLineTip = focus.append("g")
			// 	.attr("class", "lineTip")
			// 	.style("display", "none");

			// alpLineTip.append("rect")
			// 	.attr("width", 40)
			// 	.attr("height",20)
			// 	.attr("fill", "#FFF")
			// 	.attr("y", "-10")
			// 	.attr("x", "6")      

			// alpLineTip.append("circle")
			// 	.attr("r", 4.5)
			// 	.style("pointer-events","none")
			// 	.style("fill", "#b51800");

			// alpLineTip.append("text")
			// 	.attr("x", 9)
			// 	.attr("dy", ".35em");

			var bisectDate = d3.bisector(function(d) { return d.date; }).left;

			function mousemove() {
				var x0 = x.invert(d3.mouse(this)[0]);
				var i = bisectDate(votingIntention, x0, 1);
				var d0 = votingIntention[i - 1];
				var d1 = votingIntention[i];
				if (d1 != undefined) {
					var d = x0 - d0.date > d1.date - x0 ? d1 : d0;
				}
				else {
					var d = d0;
				}

				if (x(d.date) > width - 50) {
					alpLineTip.select("rect")
						.attr("x", "-46");

					alpLineTip.select("text")
						.attr("x", "-43")  
				}

				else {
					alpLineTip.select("rect")
						.attr("x", "6")

					alpLineTip.select("text")
						.attr("x", "9")     
				}
   
				alpLineTip.attr("transform", "translate(" + x(d.date) + "," + y(d.alp2PP) + ")");
				alpLineTip.select("text").text(d.alp2PP);

			} //End mousemove   


			// context.append("line")
			// 	.attr("class", "trendline")
			// 	.attr("x1", function(d) { return x(votingIntention[0].date); })
			// 	.attr("y1", function(d) { return y(50); })
			// 	.attr("x2", function(d) { return x(endDate); })
			// 	.attr("y2", function(d) { return y(50); })
			// 	.style("stroke-dasharray", ("3, 3"))
			// 	.attr("stroke", "#808080")
			// 	.attr("stroke-width", 1);       

			context.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height2 + ")")
				.call(xAxis2);

			context.append("path")
				.datum(votingIntention)
				.attr("class", "line alpNavLine")
				.attr("stroke-width", 1)
				.attr("stroke", "#b51800")
				.attr("d", alpNavLine);  

			context.append("path")
				.datum(votingIntention)
				.attr("class", "line lnpNavLine")
				.attr("stroke-width", 1)
				.attr("stroke", "#005689")
				.attr("d", lnpNavLine);  	

			context.append("path")
				.datum(votingIntention)
				.attr("class", "line greensNavLine")
				.style("stroke-dasharray", ("10, 2"))
				.attr("stroke-width", 1)
				.attr("stroke", "#298422")
				.attr("d", greensNavLine);  

			context.append("path")
				.datum(votingIntention)
				.attr("class", "line onNavLine")
				.attr("stroke-width", 1)
				.attr("stroke", "#ff9b0b")
				.attr("d", onNavLine); 	

			var brush = d3.brushX()
				.on("brush end", brushed);	

   			context.append("g")
				.attr("class", "brush")
				.call(brush)
				.call(brush.move, [startDate, endDate].map(x2));


        	function brushed() {
				var s = d3.event.selection || x2.range();
				x.domain(s.map(x2.invert, x2));
				focus.select(".alpLine").attr("d", alpLine);
				focus.select(".lnpLine").attr("d", lnpLine);
				focus.select(".greensLine").attr("d", greensLine);
				focus.select(".onLine").attr("d", onLine);
				focus.select(".x.axis").call(xAxis);
			}	


	    } //End make2pp

	    makeChart();    
            
    }