import * as d3 from 'd3'

export default function makeFurniture(debug, furnitureData) {

		console.log(furnitureData);
		d3.select("#date").text(furnitureData[0].date);
		d3.select("#pollStandfirst").text(furnitureData[0].standfirst);
		d3.select("#appendix").html(furnitureData[0].notes);
	}