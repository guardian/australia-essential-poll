import * as d3 from 'd3'

export default function makePreferred(debug, chartData, mobile) {

		(debug) ? console.log("chartData",chartData) : null;
		var preferredPM = chartData.sheets.preferredPM;


		// Shared vars and functions

		var getW = document.querySelector("#preferredContainer").getBoundingClientRect().width;
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

	    preferredPM.forEach(function (d,i) {
	    	if (d.alpPreferred == "") {
	    		d.alpPreferred = null;
	    	}
	    	else {
	    		d.alpPreferred = +d.alpPreferred; 
	    	}

	    	if (d.lnpPreferred === "") {
	    		 d.lnpPreferred = null;
	    	}
	    	
	    	else {
	    		d.lnpPreferred = +d.lnpPreferred;
	    	}

	    	if (d.dkPreferred === "") {
	    		d.dkPreferred = null
	    	}

	    	else {
	    		d.dkPreferred = +d.dkPreferred
	    	}
	    	extentY.push(+d.alpPreferred)
	    	extentY.push(+d.lnpPreferred)
	    	// extentY.push(+d.dkPreferred)
	    });

	    preferredPM.sort(function (a, b) {
			if (a.date > b.date) {
				return 1;
			}
			if (a.date < b.date) {
				return -1;
			}
			return 0;
		});

	    var coalitionPreferred = preferredPM[preferredPM.length -1]['lnpPreferred'];
	    var laborPreferred = preferredPM[preferredPM.length - 1]['alpPreferred'];
	    // var dkPreferred = preferredPM[preferredPM.length - 1]['dkPreferred'];

	    d3.select("#preferredPMNotes").html(`<span class='coalitionHighlight'>${coalitionPreferred}%</span> of respondents think <span class='coalitionKey'>Malcolm Turnbull</span> would make the better Prime Minister and <span class='laborHighlight'>${laborPreferred}%</span> think <span class='laborKey'>Bill Shorten</span> would make the better Prime Minister`); //'

	    
	    // Two party preferred chart

	    function makeChart() {

	    	var endDate = preferredPM[preferredPM.length -1].date;
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
				.defined(function(d) { return d.alpPreferred; })
				.x(function(d) { return x2(d.date); })
				.y(function(d) { return y2(d.alpPreferred); });

			var alpLine = d3.line()
				.defined(function(d) { return d.alpPreferred; })
				.x(function(d) { return x(d.date); })
				.y(function(d) { return y(d.alpPreferred); });

			var lnpNavLine = d3.line()
				.defined(function(d) { return d.lnpPreferred; })
				.x(function(d) { return x2(d.date); })
				.y(function(d) { return y2(d.lnpPreferred); });

			var lnpLine = d3.line()
				.defined(function(d) { return d.lnpPreferred; })
				.x(function(d) { return x(d.date); })
				.y(function(d) { return y(d.lnpPreferred); });


			// var dkLine = d3.line()
			// 	.defined(function(d) { return d.dkPreferred; })
			// 	.x(function(d) { return x(d.date); })
			// 	.y(function(d) { return y(d.dkPreferred); });

			var svg = d3.select("#preferredContainer").append("svg")
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
			x2.domain([d3.min(preferredPM, function(d) { return d.date; }), endDate]);
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
				.attr("x1", function(d) { return x(preferredPM[0].date); })
				.attr("y1", function(d) { return y(50); })
				.attr("x2", function(d) { return x(endDate); })
				.attr("y2", function(d) { return y(50); })
				.style("stroke-dasharray", ("3, 3"))
				.attr("stroke", "#808080")
				.attr("clip-path", "url(#clip)")
				.attr("stroke-width", 1);   

			focus.append("path")
				.datum(preferredPM)
				.attr("class", "line alpLine")
				.attr("stroke-width", 1)
				.attr("stroke", "#b51800")
				.attr("clip-path", "url(#clip)")
				.attr("d", alpLine);

			focus.append("path")
				.datum(preferredPM)
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
					var i = bisectDate(preferredPM, x0, 1);
					var d0 = preferredPM[i - 1];
					var d1 = preferredPM[i];
					if (d1 != undefined) {
						var d = x0 - d0.date > d1.date - x0 ? d1 : d0;
					}
					else {
						var d = d0;
					}


					if (d.alpPreferred === null) {
						alpLineTip.style("display", "none"); 
					}

					else {
						alpLineTip.style("display", null); 
					}

					if (d.lnpPreferred === null) {
						lnpLineTip.style("display", "none"); 
					}

					else {
						lnpLineTip.style("display", null); 
					}


					alpLineTip.attr("transform", "translate(" + x(d.date) + "," + y(d.alpPreferred) + ")");
					alpLineTip.select("text").text(d.alpPreferred);

					lnpLineTip.attr("transform", "translate(" + x(d.date) + "," + y(d.lnpPreferred) + ")");
					lnpLineTip.select("text").text(d.lnpPreferred);

					if (+d.alpPreferred >= +d.lnpPreferred) {
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
				.datum(preferredPM)
				.attr("class", "line alpNavLine")
				.attr("stroke-width", 1)
				.attr("stroke", "#b51800")
				.attr("d", alpNavLine);  

			context.append("path")
				.datum(preferredPM)
				.attr("class", "line lnpNavLine")
				.attr("stroke-width", 1)
				.attr("stroke", "#005689")
				.attr("d", lnpNavLine);  	

			// context.append("path")
			// 	.datum(preferredPM)
			// 	.attr("class", "line dkNavLine")
			// 	.attr("stroke-width", 1)
			// 	.attr("stroke", "#767676")
			// 	.attr("d", dkNavLine);
	  		
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