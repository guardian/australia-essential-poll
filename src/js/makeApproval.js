import * as d3 from 'd3'

export default function makeApproval(debug, chartData, mobile, embedded) {

		(debug) ? console.log("chartData",chartData) : null;
		var preferredPM = chartData.sheets.preferredPM;

		var containerID = '#approvalContainer';
		var notesID = '#approvalNotes';
		var wrapperID = "#approvalRating";

		// Shared vars and functions
		if (embedded) {
			containerID = "#chartContainer";
			notesID = "#chartNotes";
			wrapperID = "#embeddedChart";
		}

		// Shared vars and functions

		var getW = document.querySelector(containerID).getBoundingClientRect().width;
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
	    	if (d.alpFavourable == "") {
	    		d.alpFavourable = null;
	    	}
	    	else {
	    		d.alpFavourable = +d.alpFavourable; 
	    	}
	    	
	    	if (d.lnpFavourable == "") {
	    		d.lnpFavourable = null;
	    	}

	    	else {
	    		d.lnpFavourable = +d.lnpFavourable; 
	    	}
	    	
	    	// d.alpDK = +d.alpDK; 
	    	// d.lnpDK = +d.lnpDK; 
	    	d.date = parseDate(d.date);
	    	extentY.push(+d.alpFavourable)
	    	extentY.push(+d.lnpFavourable)
	    	// extentY.push(+d.alpDK)
	    	// extentY.push(+d.lnpDK)
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


	    var leaderHTML = ''

	    if (preferredPM[preferredPM.length -1]['lnpFavourable']===null) {

		    var coalitionApproval = preferredPM[preferredPM.length -2]['lnpFavourable'];
		    var coalitionDisapproval = preferredPM[preferredPM.length -2]['lnpUnfavourable'];
		    var laborApproval = preferredPM[preferredPM.length - 2]['alpFavourable'];
		    var laborDisapproval = preferredPM[preferredPM.length - 2]['alpUnfavourable'];

		    leaderHTML = `Approval rating wasn't measured in this week's poll. The last time it was measured, <span class='coalitionHighlight'>${coalitionApproval}%</span> of respondents approved of the job that <span class='coalitionKey'>Malcolm Turnbull</span> was doing as prime minister, and <span class='coalitionHighlight'>${coalitionDisapproval}%</span> disapproved. <span class='laborHighlight'>${laborApproval}%</span> of respondents approved of the job that <span class='laborKey'>Bill Shorten</span> was doing as opposition leader, and <span class='laborHighlight'>${coalitionDisapproval}%</span> disapproved`

	    } else {

		    var coalitionApproval = preferredPM[preferredPM.length -1]['lnpFavourable'];
		    var coalitionDisapproval = preferredPM[preferredPM.length -1]['lnpUnfavourable'];
		    var laborApproval = preferredPM[preferredPM.length - 1]['alpFavourable'];
		    var laborDisapproval = preferredPM[preferredPM.length - 1]['alpUnfavourable'];

		    leaderHTML = `<span class='coalitionHighlight'>${coalitionApproval}%</span> of respondents approve of the job that <span class='coalitionKey'>Scott Morrison</span> is doing as prime minister, and <span class='coalitionHighlight'>${coalitionDisapproval}%</span> disapprove. <span class='laborHighlight'>${laborApproval}%</span> of respondents approve of the job that <span class='laborKey'>Bill Shorten</span> is doing as opposition leader, and <span class='laborHighlight'>${coalitionDisapproval}%</span> disapprove`

	    }


	    d3.select(wrapperID + " .figureTitle").text('Approval rating of leaders');
	    d3.select(notesID).html(leaderHTML);

	    
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

			if (mobile) {
				xAxis.ticks(5);
			}		

		    var xAxis2 = d3.axisBottom()
		        .scale(x2);

		    var yAxis = d3.axisLeft()
				.scale(y);

			var alpNavLine = d3.line()
				.defined(function(d) { return d.alpFavourable; })
				.x(function(d) { return x2(d.date); })
				.y(function(d) { return y2(d.alpFavourable); });

			var alpLine = d3.line()
				.defined(function(d) { return d.alpFavourable; })
				.x(function(d) { return x(d.date); })
				.y(function(d) { return y(d.alpFavourable); });

			var lnpNavLine = d3.line()
				.defined(function(d) { return d.lnpFavourable; })
				.x(function(d) { return x2(d.date); })
				.y(function(d) { return y2(d.lnpFavourable); });

			var lnpLine = d3.line()
				.defined(function(d) { return d.lnpFavourable; })
				.x(function(d) { return x(d.date); })
				.y(function(d) { return y(d.lnpFavourable); });
	

			var svg = d3.select(containerID).append("svg")
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

					if (d.alpFavourable === null) {
						alpLineTip.style("display", "none"); 
					}

					else {
						alpLineTip.style("display", null); 
					}

					if (d.lnpFavourable === null) {
						lnpLineTip.style("display", "none"); 
					}

					else {
						lnpLineTip.style("display", null); 
					}

					alpLineTip.attr("transform", "translate(" + x(d.date) + "," + y(d.alpFavourable) + ")");
					alpLineTip.select("text").text(d.alpFavourable);

					lnpLineTip.attr("transform", "translate(" + x(d.date) + "," + y(d.lnpFavourable) + ")");
					lnpLineTip.select("text").text(d.lnpFavourable);

					if (+d.alpFavourable >= +d.lnpFavourable) {
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
			// 	.attr("class", "line alpDKNavLine")
			// 	.attr("stroke-width", 1)
			// 	.attr("stroke", "#767676")
			// 	.attr("d", alpDKNavLine);

			// context.append("path")
			// 	.datum(preferredPM)
			// 	.attr("class", "line lnpDKNavLine")
			// 	.attr("stroke-width", 1)
			// 	.attr("stroke", "#767676")
			// 	.attr("d", lnpDKNavLine);  		
	  		
			var brush = d3.brushX()
				.extent([[0, 0], [width, height2]])
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