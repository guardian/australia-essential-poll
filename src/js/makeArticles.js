import * as d3 from 'd3'

export default function makeArticles(debug, configData) {

		var articleData = [];

		configData.config.forEach(function (d) {

			if (d.contentType === 'article') {
				articleData.push(d)
			}

		})	

		console.log(articleData);

		if (articleData.length > 0) {
			articleData.forEach(function (d,i) {

				var navList = d3.select("#articles");
				
				navList
					.append("li")
					.append("a")
					.attr("href", "#article" + i)
					.text(d.chapterTitle);		

				var articlesContainer = d3.select("#articlesContainer");

				var articleDiv = articlesContainer.append("div")
									.attr("id", "article" + i)	
									.attr("class", "article item " + d.articleTone);

				articleDiv
					.append("img")
					.attr("class","articleImage")
					.attr("src", d.articleImage)					

				articleDiv
					.append("div")
					.attr("class","articleTitle")
					.html(function () { 
						if (d.articleTone === 'news') {
							return "<span class='newsSpan'>News </span> " + d.articleTitle;
						}

						else {
							return "<span class='commentSpan'>Comment </span> " + d.articleTitle;
						}
					})

				// articleDiv
				// 	.append("div")
				// 	.attr("class","articleSubtitle")
				// 	.text(d.articleStandfirst)

				articleDiv
					.append("a")
					.attr("class", "blockLink")
					.attr("href", d.articleUrl)

			});

		}

		else {
			d3.select("#articlesContainer").style("display","none");
			d3.select("#analysisHeader").style("display","none");
			d3.select("#articles").style("display","none");
		}

		


	}