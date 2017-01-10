import * as d3 from 'd3'

export default function makeArticles(debug, configData) {

		var articleData = [];

		configData.forEach(function (d) {

			if (d.contentType === 'article') {
				articleData.push(d)
			}

		})	

		console.log(articleData);

		articleData.forEach(function (d) {

			var navList = d3.select("#articles");
			
			navList
				.append("li")
				.text(d.chapterTitle);		

			var articlesContainer = d3.select("#articlesContainer");

			var articleDiv = articlesContainer.append("div")
								.attr("class", "article");

			articleDiv
				.append("div")
				.attr("class","figureTitle")
				.text(d.articleTitle)

			articleDiv
				.append("div")
				.attr("class","articleSubtitle")
				.text(d.articleStandfirst)

			articleDiv
				.append("a")
				.attr("class", "readmore")
				.attr("href", d.articleUrl)
				.text("read more")

		});


	}