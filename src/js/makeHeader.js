import * as d3 from 'd3'

export default function makeHeader(debug) {

        var width = document.querySelector(".interactive-container #header").getBoundingClientRect().width;
        var height = document.querySelector(".interactive-container #header").getBoundingClientRect().height;
        var data = {};    

        (debug) ? console.log("width",width,"height",height) : null;

        function makeData() {
            data['red'] = []
            data['blue'] = []

            var redBase = 50;
            var blueBase = 60;
            var smallMove = 1;
            var bigMove = 2;
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
