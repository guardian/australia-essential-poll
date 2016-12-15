import reqwest from 'reqwest'
import mainHTML from './text/main.html!text'
import share from './lib/share'
import parseURL from './lib/parseURL'
import fetchJSON from './lib/fetch'
import * as d3 from 'd3'


var debug = true;
var shareFn = share('Interactive title', 'http://gu.com/p/URL', '#Interactive');

export function init(el, context, config, mediator) {
    el.innerHTML = mainHTML.replace(/%assetPath%/g, config.assetPath);    

    var params = parseURL(el);
    if(params.key){
        //load data if key is found
        loadConfig(params);
    } else {
        //error if key is not found
        dom.innerHTML = '<h1>Please enter a key in the alt text of the embed or as a param on the url in the format "key=""</h1>';
    }

    function loadConfig(params) {
        reqwest({
            url: 'https://interactive.guim.co.uk/docsdata/' + params.key + '.json',
            type: 'json',
            crossOrigin: true,
            success: function(resp) { 
                (debug) ? console.log(resp) : null;
                renderResults(resp)
            }
        })
    
    }

    function renderResults(configData) {

        //Make the header

        // makeHeader()

        //Make the results charts 

        reqwest({
            url: 'https://interactive.guim.co.uk/docsdata/1-hIlthccTseJ-ri_fVoFoqcWOQAg2H4PpJPXoebuSq0.json',
            type: 'json',
            crossOrigin: true,
            success: function(resp) { 
                (debug) ? console.log(resp) : null;
                makeCharts(resp)
            }
        })

        // Make the tables

    }

    function makeCharts(chartData) {
        makeHeader(chartData);        
    }

    function makeHeader(chartData) {
        var width = document.querySelector("#header").getBoundingClientRect().width;
        var height = document.querySelector("#header").getBoundingClientRect().height;
        var data = {};    

        (debug) ? console.log("width",width,"height",height) : null;

        function makeData() {
            data['red'] = []
            data['blue'] = []

            var redBase = 50;
            var blueBase = 60;
            var smallMove = 1;
            var bigMove = 4;
            var biggerMove = 5;

            for (var i = 0; i < 100; i++) {
                if (i < 60) {
                    data['red'].push(redBase)
                    data['blue'].push(blueBase)
                }

                else if (i <80 ) {

                    var r = Math.random()
                    if (r < 0.4) {
                        redBase = redBase - smallMove;
                    }
                    if (r < 0.6) {
                        redBase = redBase + smallMove;
                    }

                    if (r <0.8) {
                        redBase = redBase - bigMove;
                    }
                    else {
                        redBase = redBase + bigMove;
                    }

                    data['red'].push(redBase) 

                    var r = Math.random()

                    if (r < 0.4) {
                        blueBase = blueBase + smallMove;
                    }
                    if (r < 0.6) {
                        blueBase = blueBase - smallMove;
                    }

                    if (r <0.8) {
                        blueBase = blueBase + bigMove;
                    }
                    else {
                        blueBase = blueBase - bigMove;
                    }

                    data['blue'].push(blueBase)
                }

                else {

                    var r = Math.random()
                    if (r < 0.4) {
                        redBase = redBase + smallMove;
                    }
                    if (r < 0.6) {
                        redBase = redBase - smallMove;
                    }

                    if (r <0.8) {
                        redBase = redBase + bigMove;
                    }
                    else {
                        redBase = redBase - bigMove;
                    }

                    data['red'].push(redBase) 

                    var r = Math.random()

                    if (r < 0.4) {
                        blueBase = blueBase - smallMove;
                    }
                    if (r < 0.6) {
                        blueBase = blueBase + smallMove;
                    }

                    if (r <0.8) {
                        blueBase = blueBase - bigMove;
                    }
                    else {
                        blueBase = blueBase + bigMove;
                    }

                    data['blue'].push(blueBase)

                }

            };

            console.log(data['red']);
            console.log(data['blue']);
        }

        makeData();
        console.log(data);

        var svg = d3.select('#backgroundHeaderGraph').append('svg')
            .attr("width", width)
            .attr("height", height)

        var x = d3.scaleLinear()
            .range([0, width]);

        var y = d3.scaleLinear()
                .range([height, 0]);

        x.domain([0,100]);
        y.domain([-10,100]);  

        var line = d3.line()
                .x(function(d,i) { return x(i) })
                .y(function(d,i) { return y(d) });    

        svg.append("path")
              .attr("class", "red line")
              .style("stroke","#b51800")
              .attr("d", line(data['red']))

        svg.append("path")
              .attr("class", "blue line")
              .style("stroke","#005689")
              .attr("d", line(data['blue']))     

        var headerUpdateTimer = setInterval(function() {
            makeData();
            var t0 = svg.transition().duration(1000);
            t0.selectAll(".red").attr("d", line(data['red']));
            t0.selectAll(".blue").attr("d", line(data['blue']));

        },2000)

    }

}
