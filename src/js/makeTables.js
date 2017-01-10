import reqwest from 'reqwest'
import * as d3 from 'd3'

export default function makeTables(debug, configData) {

	var tableData = [];

	configData.forEach(function (d) {

		if (d.contentType === 'table') {

			console.log(d.chapterTitle)

			var navList = d3.select("#otherQuestions");
			
			navList
				.append("li")
				.text(d.chapterTitle);	

			reqwest({
            url: 'https://interactive.guim.co.uk/docsdata/' + d.key + '.json',
            type: 'json',
            crossOrigin: true,
            success: function(resp) { 
	                (debug) ? console.log(resp) : null;
	                makeTable(resp.sheets);
            	}
        	})


		}

	})	

	function makeTable(data) {

		var tablesContainer = d3.select("#tablesContainer");


		var tableDiv = tablesContainer.append("div")
						.attr("class", "pollTable row borderBottom")

		tableDiv
			.append("div")
			.attr("class","figureTitle")
			.text(data.tableMeta[0].title)	

		
			
		var table = tableDiv
						.append("table")

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