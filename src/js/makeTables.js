import reqwest from 'reqwest'
import ScrollSpy from 'scrollspy-js'
import jQuery from 'jquery'
import stacktable from './stacktable'
import * as d3 from 'd3'

export default function makeTables(debug, configData) {

	var tableData = [];

	configData.forEach(function (d,i) { 
		if (d.contentType === 'table') {
		tableData.push(d);
		}
	});

	console.log(tableData.length);

	var tally = 0;
	configData.forEach(function (d,i) {
		if (d.contentType === 'table') {

			console.log(d.chapterTitle)

			reqwest({
            url: 'https://interactive.guim.co.uk/docsdata/' + d.key + '.json',
            type: 'json',
            crossOrigin: true,
            success: function(resp) { 
	                (debug) ? console.log(resp) : null;
	                makeTable(resp.sheets,i,d);
	                tally++
	                console.log(tally);
	                if (tally === tableData.length) {
	                	var spy = new ScrollSpy('#mainSection', {
		                    nav: '.pollNav a',
		                    className: 'currentNav'

		                  

		                });
	                
	                	$(".tables").stacktable();
	                }
            	}
        	})


		}

	})	

	function makeTable(data,i,config) {

		var navList = d3.select("#otherQuestions");
			
		navList
			.append("li")
			.append("a")	
			.attr("href", "#" + "table" + i)
			.text(config.chapterTitle);	

		var tablesContainer = d3.select("#tablesContainer");


		var tableDiv = tablesContainer.append("div")
						.attr("class", "pollTable row borderBottom item")
						.attr("data-id", "table" + i)
						.attr("id", "table" + i)

		tableDiv
			.append("div")
			.attr("class","figureTitle")
			.text(data.tableMeta[0].title)	

		var table = tableDiv
						.append("table")
						.attr("class", "tables")

		var tableHeadings = table.append("thead")
								.append("tr")

		data.tableDataSheet[0].forEach(function (d) {
			tableHeadings.append("th")
				.attr("class","column-header")
				.text(d);
		});										

		var tableBody = table.append("tbody")
								

		for (var i = 1; i < data.tableDataSheet.length; i++) {
				
				var tableRow = table.append("tr")

				data.tableDataSheet[i].forEach(function (d) {
					tableRow.append("td")
						.text(d);
				});	

				
			};

		
	}

}	