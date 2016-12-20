import * as d3 from 'd3'

export default function makeCharts(debug, chartData) {

		(debug) ? console.log("chartData",chartData) : null;
		var preferredPM = chartData.sheets.preferredPM;
		var votingIntention = chartData.sheets.votingIntention;

		// Shared vars and functions

		var width = document.querySelector("#twoPartyPreferredContainer").getBoundingClientRect().width;
        var height = width*0.6;
        var miniPadding = 25;
        var margin = {top: 20, right: 20, bottom: (height*0.25), left: 40},
	        margin2 =  {top: (height*0.75 + miniPadding), right: 10, bottom: 20, left: 40},
	        width = width - margin.left - margin.right,
	        height = height - margin.top - margin.bottom,
	        height2 = height - margin2.top - margin2.bottom;

	    var parseDate = d3.timeParse("%-d/%-m/%Y");    

	    votingIntention.forEach(function (d,i) {

	    	d['ALP'] = +d['ALP'];
	    	d['LNP'] = +d['LNP'];
	    	d['Greens'] = +d['Greens'];
	    	d['ON'] = +d['ON'];
	    	d['ALP-2PP'] = +d['ALP-2PP'];
	    	d['LNP-2PP'] = +d['LNP-2PP'];
	    	d['date'] = parseDate(d['date']);
	    
	    });

	    preferredPM.forEach(function (d,i) {

	    	d['ALP-DK'] = +d['ALP-DK'];
	    	d['ALP-Favourable'] = +d['ALP-Favourable'];
	    	d['ALP-Preferred'] = +d['ALP-Preferred'];
	    	d['ALP-Unfavourable'] = +d['ALP-Unfavourable'];
	    	d['DK-Preferred'] = +d['DK-Preferred'];
	    	d['LNP-DK'] = +d['LNP-DK'];
	    	d['LNP-Favourable'] = +d['LNP-Favourable'];
	    	d['LNP-Preferred'] = +d['LNP-Preferred'];
	    	d['LNP-Unfavourable'] = +d['LNP-Unfavourable'];
	    	d['date'] = parseDate(d['date']);

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

	    votingIntention.sort(function (a, b) {
			if (a.date > b.date) {
				return 1;
			}
			if (a.date < b.date) {
				return -1;
			}
			return 0;
		});

	    
	    // Two party preferred chart

	    function make2PP() {

	    	var endDate = votingIntention[votingIntention.length -1].date;
	    	console.log(endDate);
			var startDate = d3.timeDay.offset(endDate, -365);
			var padDate = d3.timeDay.offset(endDate, +2);
	    	
	    	var x = d3.scaleTime().range([0, width]),
				y = d3.scaleLinear().range([height, 0]),
				x2 = d3.scaleTime().range([0, width]),
				y2 = d3.scaleLinear().range([height2, 0]);
	    
		    var twoppFilter = votingIntention.filter(function(d){ return (d.date > startDate && d.date <= endDate) });
		    console.log(twoppFilter);
	        var xAxis = d3.axisBottom()
				.scale(x);

		    var xAxis2 = d3.axisBottom()
		        .scale(x2);

		    var yAxis = d3.axisLeft()
				.scale(y);

			// var brush = d3.brushX()
			// 	.on("brush", brushMid)
			// 	.on("brushend", brushEnd);

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

			x.domain([startDate, padDate]);

			y.domain(d3.extent(votingIntention, function(d) { return d.alp2PP; }));
			x2.domain([d3.min(votingIntention, function(d) { return d.date; }), padDate]);
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

			focus.append("rect")
				.attr("class", "mouseOverlay")
				.attr("opacity", 0)
				.attr("width", width)
				.attr("height", height)
				.on("mouseover", function() { lineTip.style("display", null); })
				.on("mouseout", function() { lineTip.style("display", "none"); })
				.on("touchstart", function() { lineTip.style("display", null); })
				.on("mousemove", mousemove);

			focus.append("path")
				.datum(twoppFilter)
				.attr("class", "line alpLine")
				.attr("stroke-width", 1)
				.attr("stroke", "#b51800")
				.attr("clip-path", "url(#clip)")
				.attr("d", alpLine);

			focus.append("path")
				.datum(twoppFilter)
				.attr("class", "line lnpLine")
				.attr("stroke-width", 1)
				.attr("stroke", "#005689")
				.attr("clip-path", "url(#clip)")
				.attr("d", lnpLine);  	  	    						   

			var lineTip = focus.append("g")
				.attr("class", "lineTip")
				.style("display", "none");

			lineTip.append("rect")
				.attr("width", 40)
				.attr("height",20)
				.attr("fill", "#FFF")
				.attr("y", "-10")
				.attr("x", "6")      

			lineTip.append("circle")
				.attr("r", 4.5)
				.style("pointer-events","none")
				.style("fill", "#00456e");

			lineTip.append("text")
				.attr("x", 9)
				.attr("dy", ".35em");

			var bisectDate = d3.bisector(function(d) { return d.date; }).left;

			function mousemove() {
				var x0 = x.invert(d3.mouse(this)[0]);
				var i = bisectDate(twoppFilter, x0, 1);
				var d0 = twoppFilter[i - 1];
				var d1 = twoppFilter[i];
				if (d1 != undefined) {
					var d = x0 - d0.date > d1.date - x0 ? d1 : d0;
				}
				else {
					var d = d0;
				}

				if (x(d.date) > width - 50) {
					lineTip.select("rect")
					.attr("x", "-46");

					lineTip.select("text")
					.attr("x", "-43")  
				}

				else {
					lineTip.select("rect")
					.attr("x", "6")

					lineTip.select("text")
					.attr("x", "9")     
				}
   
				lineTip.attr("transform", "translate(" + x(d.date) + "," + y(d.alp2PP) + ")");
				lineTip.select("text").text(d.alp2PP);

			} //End mousemove    	

	    } //End make2pp

	    make2PP();    
            
    }