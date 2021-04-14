function period() {
    var url = "/total/";

    var axisNames = ["year", "month", "day", "hour", "total"];

    var current_id = "#period";
    var button_id = "#periodbtn";

    var axisDefs = {
        year: "Total Accidents by Year",
        month: "Total Accidents by Month",
        day: "Total Accidents by Week Day",
        hour: "Total Accidents by Hour",
        total: "Total Accidents"
    };

    var currentX = axisNames[0];
    var currentY = axisNames[4];

    function addButtons() {
        var div = d3.select(button_id);
        for (var i = 0; i < axisNames.length - 1; i++) {
            div.append("a")
                .classed("badge badge-success", true)
                .attr("href", "#")
                .attr("value", axisNames[i])
                .text(capital(axisNames[i]))
        }
    }

    addButtons();

    //event.preventDefault()
    function currentApi() {
        return url + currentX;
    }

    function capital(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function resize(peroid) {
        var svg = d3.select(current_id).select("svg");
        if (!svg.empty()) {
            svg.remove();
        }

        var svgWidth = $(current_id).parent().outerWidth();
        var svgHeight = (window.innerHeight - $("#header").outerHeight() - $(current_id).parent().children(':first-child').outerHeight()) / 3

        var margin = {
            top: 20,
            left: 40,
            bottom: 40,
            right: 30
        };

        var chartHeight = svgHeight - margin.top - margin.bottom;
        var chartWidth = svgWidth - margin.left - margin.right;

        var svg = d3.select(current_id)
            .append("svg")
            .attr("height", svgHeight)
            .attr("width", svgWidth)
            .classed("chart", true);

        var chartGroup = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        console.log(currentApi());

        d3.json(currentApi()).then(function (data) {
            // d3.select("body").select("#total").text(data.Total);

            data.forEach(d => {
                d[currentX] = +d[currentX],
                    d[currentY] = +d[currentY]
            });

            console.log(data.length);


            var xScale = xScaleFunc(chartWidth, data);
            var yScale = yScaleFunc(chartHeight, data);
            var xAxis = d3.axisBottom(xScale);
            var yAxis = d3.axisLeft(yScale);

            // draw x axis
            chartGroup.append("g")
                .attr("transform", `translate(0, ${chartHeight})`)
                .transition()
                .duration(500)
                .call(xAxis);

            // draw y axis
            chartGroup.append("g")
                .transition()
                .duration(500)
                .call(yAxis);

            var radius = 5;

            var circleGroup = chartGroup.append("g");
            var circles = circleGroup.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("value", d => xScale(d[currentX]))
                .attr("cx", d => xScale(d[currentX]))
                .attr("cy", d => yScale(d[currentY]))
                .attr("r", radius);

            // circles.transition()
            //     .duration(1000)
            //     .attr("cx", d => xScale(d[currentX]))
            //     .attr("cy", d => yScale(d[currentY]))
            //     .attr("r", radius);

            var lineGenerator = d3.line();
            var points = data.map(d => [xScale(d[currentX]), yScale(d.total)]);
            var lines = circleGroup.append("path")
                .attr("fill", "none")
                .attr("stroke", "blue")
                .attr("stroke-width", 5)
                .attr("d", lineGenerator(points));

            var xLabels = chartGroup.append("g")
            // .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

            xLabels.append("text")
                .attr("x", chartWidth)
                .attr("y", chartHeight + 16)
                .attr("font-size", "smaller")
                .attr("fill", "blue")
                .text(capital(currentX));

            var yLabels = chartGroup.append("g")
            //     .attr("transform", `translate(-20, ${chartHeight /2}) rotate(-90)`);

            yLabels.append("text")
                .attr("x", -40)
                .attr("y", -10)
                .attr("font-size", "smaller")
                .attr("fill", "blue")
                .text(capital(currentY));

            // add function to button
            d3.select(button_id).selectAll("a").on("click", function () {
                var value = d3.select(this).attr("value");
                if (value === currentX) {
                    d3.select(this)
                        .classed("active", true);
                    return;
                }
                else {
                    currentX = value;
                    d3.select(this)
                        .classed("active", false);
                    resize();
                }
            });


            // xLabels.selectAll("text")
            // .on("click", function() {
            //     var value = d3.select(this).attr("value");
            //     if (value === currentX) {
            //         return;
            //     }
            //     else {
            //         currentX = value;
            //         resize();
            //     }
            // });
        });


    }

    resize(currentX);

    function xScaleFunc(width, data) {
        console.log(data);
        // define padding pixels
        var padding = 20;
        // get x scale
        var min = d3.min(data, d => d[currentX]);
        var max = d3.max(data, d => d[currentX]);
        var xLinearScale = d3.scaleLinear()
            .domain([min, max])
            .range([0, width]);

        // get the actual value for padding 50px to x axis on left & right
        var left = xLinearScale.invert(-padding);
        var right = xLinearScale.invert(width + padding);

        // reset scale with padding
        xLinearScale = d3.scaleLinear()
            .domain([left, right])
            .range([0, width])

        return xLinearScale;
    }

    function yScaleFunc(height, data) {
        // define padding pixels
        console.log(data);
        var padding = 20;
        // get y scale
        var min = d3.min(data, d => d[currentY]);
        var max = d3.max(data, d => d[currentY]);
        var yLinearScale = d3.scaleLinear()
            .domain([min, max])
            .range([height, 0]);

        // get the actual value for padding 50px to the y scale on top & bottom
        var top = yLinearScale.invert(height + padding);
        var bottom = yLinearScale.invert(-padding);

        // reset scale with padding
        yLinearScale = d3.scaleLinear()
            .domain([top, bottom])
            .range([height, 0]);

        return yLinearScale;
    }

    // d3.json(url).then(function(data) {
    //     // d3.select("body").select("#total").text(data.Total);

    //     console.log(data);
    //     //d3.select("body").select("#total").text(data.total);
    // })
}

period()