import * as d3 from 'd3'

export default function makeTwopp(debug, chartData, mobile) {

		(debug) ? console.log("chartData",chartData) : null;

		var votingIntention = chartData.sheets.votingIntention;

		// Shared vars and functions

		var getW = document.querySelector("#twoPartyPreferredContainer").getBoundingClientRect().width;
        var getH = getW*0.6;
        var miniPadding = 25;
        var margin = {top: 20, right: 20, bottom: (getH*0.25), left: 40},
	        margin2 =  {top: (getH*0.75 + miniPadding), right: 10, bottom: 20, left: 40},
	        width = getW - margin.left - margin.right,
	        height = getH - margin.top - margin.bottom,
	        height2 = getH - margin2.top - margin2.bottom;

	    console.log("height",height,"width",width,"margin",margin, "margin2", margin2, "height2", height2);    

	    var parseDate = d3.timeParse("%-d/%-m/%Y");    

	    var extentY = [];

	    votingIntention.forEach(function (d,i) {

	    	d['alp2PP'] = +d['alp2PP'];
	    	d['lnp2PP'] = +d['lnp2PP'];
	    	d['date'] = parseDate(d['date']);

	    	extentY.push(+d['alp2PP']);
	    	extentY.push(+d['lnp2PP']);
	    
	    });

	    votingIntention.sort(function (a, b) {
			if (a.date > b.date) {
				return 1;
			}
			if (a.date < b.date) {
				return -1;
			}
			return 0;
		});

	   
	    var coalition2pp = votingIntention[votingIntention.length -1]['lnp2PP'];
	    var labor2pp = votingIntention[votingIntention.length - 1]['alp2PP'];

	    d3.select("#twoPartyPreferredNotes").html(`If an election were held today, the two-party preferred vote for the <span class='coalitionKey'>Coalition</span> would be <span class='coalitionHighlight'>${coalition2pp}%</span>, and <span class='laborKey'>Labor</span> would be <span class='laborHighlight'>${labor2pp}%</span>`);
	    
	    // Two party preferred chart

	    function makeChart() {

	    	var endDate = votingIntention[votingIntention.length -1].date;
			var startDate = d3.timeDay.offset(endDate, -365);
			var padDate = d3.timeDay.offset(endDate, +2);
	    	
	    	var x = d3.scaleTime().range([0, width]),
				y = d3.scaleLinear().range([height, 0]),
				x2 = d3.scaleTime().range([0, width]),
				y2 = d3.scaleLinear().range([height2, 0]);

	        var xAxis = d3.axisBottom()
				.scale(x);

			if (mobile) {
				xAxis.ticks(5);
			}	

		    var xAxis2 = d3.axisBottom()
		        .scale(x2);

		    var yAxis = d3.axisLeft()
				.scale(y);

			var alpNavLine = d3.line()
				.x(function(d) { return x2(d.date); })
				.y(function(d) { return y2(d.alp2PP); });

			var alpLine = d3.line()
				.x(function(d) { return x(d.date); })
				.y(function(d) { return y(d.alp2PP); });

			var lnpNavLine = d3.line()
				.x(function(d) { return x2(d.date); })
				.y(function(d) { return y2(d.lnp2PP); });

			var lnpLine = d3.line()
				.x(function(d) { return x(d.date); })
				.y(function(d) { return y(d.lnp2PP); });	

			var svg = d3.select("#twoPartyPreferredContainer").append("svg")
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


			if (!mobile) {
				focus.append("rect")
				.attr("class", "mouseOverlay")
				.attr("opacity", 0)
				.attr("width", width)
				.attr("height", height)
				.on("mouseover", function() { 
						alpLineTip.style("display", null);
						lnpLineTip.style("display", null);
						})
				.on("mouseout", function() { 
					alpLineTip.style("display", "none"); 
					lnpLineTip.style("display", "none"); 
				})
				.on("touchstart", function() { 
					alpLineTip.style("display", null); 
					lnpLineTip.style("display", null); 
				})
				.on("mousemove", mousemove);	


				var alpLineTip = focus.append("g")
					.attr("class", "lineTip")
					.style("display", "none"); 

				alpLineTip.append("circle")
					.attr("r", 4.5)
					.style("pointer-events","none")
					.style("fill", "#b51800");

				alpLineTip.append("text")
					.attr("dy", "-10")
					.attr("dx", "-5");

				var lnpLineTip = focus.append("g")
					.attr("class", "lineTip")
					.style("display", "none");  

				lnpLineTip.append("circle")
					.attr("r", 4.5)
					.style("pointer-events","none")
					.style("fill", "#005689");

				lnpLineTip.append("text")
					.attr("dy", "-10")
					.attr("dx", "-5");		

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

					alpLineTip.attr("transform", "translate(" + x(d.date) + "," + y(d.alp2PP) + ")");
					alpLineTip.select("text").text(d.alp2PP);

					lnpLineTip.attr("transform", "translate(" + x(d.date) + "," + y(d.lnp2PP) + ")");
					lnpLineTip.select("text").text(d.lnp2PP);

					if (+d.alp2PP >= +d.lnp2PP) {
						alpLineTip.select("text").attr("dy", "-10")
						lnpLineTip.select("text").attr("dy", "20")
					}

					else {
						alpLineTip.select("text").attr("dy", "20")
						lnpLineTip.select("text").attr("dy", "-10")
					}

				} //End mousemove   

			} //end mobile check

			


			// context.append("line")
			// 	.attr("class", "trendline")
			// 	.attr("x1", function(d) { return x(votingIntention[0].date); })
			// 	.attr("y1", function(d) { return y2(50); })
			// 	.attr("x2", function(d) { return x(endDate); })
			// 	.attr("y2", function(d) { return y2(50); })
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
				focus.select(".x.axis").call(xAxis);
			}	


	    } //End make2pp

	    makeChart();    
            
    }