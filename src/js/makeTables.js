import reqwest from 'reqwest'
import ScrollSpy from 'scrollspy-js'
import jQuery from 'jquery'
import stacktable from './stacktable'
import * as d3 from 'd3'

export default function makeTables(debug, configData, embedID, embedded) {

	console.log(configData);

	if (!embedded) { 
		configData.config.forEach(function (d,i) { 
				if (d.contentType === 'table') {
					makeTable(configData[d.key],i,d);
				}
		});

		var spy = new ScrollSpy('#mainSection', {
        nav: '.pollNav a',
        className: 'currentNav'
    	});
	}

	else if (embedded) {
		configData.config.forEach(function (d,i) { 
				if (d.key === embedID) {
					makeTable(configData[d.key],i,d);
				}
		});

	}

	$(".tables").stacktable();

	function makeTable(data,i,config) {

		console.log(data);

		if (!embedded) {
			var navList = d3.select("#otherQuestions");
			
			navList
				.append("li")
				.append("a")	
				.attr("href", "#" + "table" + i)
				.text(config.chapterTitle);	

			}	

		var tablesContainer = d3.select("#tablesContainer");

		var tableDiv = tablesContainer.append("div")
						.attr("class", "pollTable row borderBottom item")
						.attr("data-id", "table" + i)
						.attr("id", "table" + i)

		tableDiv
			.append("div")
			.attr("class","figureTitle")
			.text(config.articleTitle)	

		var table = tableDiv
						.append("table")
						.attr("class", "tables")

		var tableHeadings = table.append("thead")
								.append("tr")

		Object.keys(data[0]).forEach(function (d) {
			tableHeadings.append("th")
				.attr("class","column-header")
				.text(d);
		});										

		var tableBody = table.append("tbody")

		for (var i = 0; i < data.length; i++) {
				var tableRow = table.append("tr")
				Object.keys(data[0]).forEach(function (k) {
					tableRow.append("td")
						.text(data[i][k]);
				})

		};
		


		
	}
}