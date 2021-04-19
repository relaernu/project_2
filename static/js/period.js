// define function to 
function period() {

    // *** define variables
    // api route for period
    var url = "/total/";

    // define axis names for easy reference
    var axisNames = ["year", "month", "day", "hour", "total"];

    // define div ids to put chart and button
    var current_id = "#period";
    var button_id = "#periodbtn";

    // define chart names
    var axisDefs = {
        year: "Total Accidents by Year",
        month: "Total Accidents by Month",
        day: "Total Accidents by Week Day",
        hour: "Total Accidents by Hour",
        total: "Total Accidents"
    };

    // define initial axes
    var currentX = axisNames[0];
    var currentY = axisNames[axisNames.length - 1];

    // define function to add buttons
    function addButtons() {
        var div = d3.select(button_id);
        for (var i = 0; i < axisNames.length - 1; i++) {
            div.append("button")
                .classed("btn btn-success", true)
                .attr("value", axisNames[i])
                .text(capital(axisNames[i]))
        }
    }

    // add the buttons to div
    addButtons();

    // function to get api address
    function currentApi() {
        return url + currentX;
    }

    // function to capitalize firet letter
    function capital(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // main function
    function resize(peroid) {

        d3.json(currentApi()).then(function (data) {
            
            // initial svg tag
            var svg = d3.select(current_id).select("svg");
            if (!svg.empty()) {
                svg.remove();
            }

            // calculate svg area
            var parent = $(current_id).parent();
            var svgWidth = parent.outerWidth();
            var svgHeight = parent.outerHeight() - parseInt(parent.css("padding-top").slice(0, -2)) - parseInt(parent.css("padding-bottom").slice(0, -2));

            var margin = {
                top: 20,
                left: 100,
                bottom: 40,
                right: 200
            };

            // define chart area
            var chartHeight = svgHeight - margin.top - margin.bottom;
            var chartWidth = svgWidth - margin.left - margin.right;

            // add svg area
            var svg = d3.select(current_id)
                .append("svg")
                .attr("height", svgHeight)
                .attr("width", svgWidth)
                .classed("chart", true);

            // add buttons area
            var buttonGroup = svg.append("g")
                .attr("transform", `translate(${svgWidth - margin.right + 40})`)

            buttonGroup.selectAll("rect")
                .data(axisNames.slice(0,4))
                .enter()
                .append("rect")
                // .classed("btn btn-success", true)
                .attr("value", d=>d)
                .attr("x", 0)
                .attr("y", (d, i) => margin.top + i * 30)
                .attr("rx", 5)
                .attr("ry", 5)
                .attr("width", 80)
                .attr("height", 28)
                .style("fill", "#18ce0f")
                .on("mouseover", function() { d3.select(this).style("fill", "#1beb11");})
                .on("mouseout", function() { d3.select(this).style("fill", "#18ce0f");})
                .on("click", function() {
                    var value = d3.select(this).attr("value");
                    currentX = value;
                    resize(currentX);
                });
            
            buttonGroup.selectAll("text")
                .data(axisNames.slice(0,4))
                .enter()
                .append("text")
                .attr("x", d=> 40 - d.length * 5)
                .attr("y", (d, i) => margin.top + 18 + i * 30)
                .attr("fill", "white")
                .text(d=>capital(d))

            // add chart area
            var chartGroup = svg.append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

            // convert data to int
            data.forEach(d => {
                d[currentX] = +d[currentX],
                d[currentY] = +d[currentY]
            });

            // calc scale by current data
            var xScale = xScaleFunc(chartWidth, data);
            var yScale = yScaleFunc(chartHeight, data);

            // prepare for axes to draw
            var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")).ticks(data.length);
            var yAxis = d3.axisLeft(yScale);

            // draw x axis
            var xg = chartGroup.append("g")
                .attr("transform", `translate(0, ${chartHeight})`)
                .transition()
                .duration(500)
                .call(xAxis)
                .style("stroke", "white")
                .style("stroke-width", 2)
                .style("fill", "white");

            // draw y axis
            chartGroup.append("g")
                .transition()
                .duration(500)
                .call(yAxis)
                .style("stroke", "white")
                .style("stroke-width", 2)
                .style("fill", "white");

            // data point radius
            var radius = 5;

            // draw data points
            var circleGroup = chartGroup.append("g");
            var circles = circleGroup.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("value", d => xScale(d[currentX]))
                .attr("cx", d => xScale(d[currentX]))
                .attr("cy", d => yScale(d[currentY]))
                .attr("r", radius)
                .style("fill", "white");

            // circles.transition()
            //     .duration(1000)
            //     .attr("cx", d => xScale(d[currentX]))
            //     .attr("cy", d => yScale(d[currentY]))
            //     .attr("r", radius);

            // draw lines
            var lineGenerator = d3.line();
            var points = data.map(d => [xScale(d[currentX]), yScale(d.total)]);
            var lines = circleGroup.append("path")
                .attr("fill", "none")
                .attr("stroke", "red")
                .attr("stroke-width", 5)
                .attr("d", lineGenerator(points));

            // put x label
            var xLabels = chartGroup.append("g")
            // .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

            xLabels.append("text")
                .attr("x", chartWidth)
                .attr("y", chartHeight + 16)
                .attr("fill", "red")
                .text(capital(currentX));

            
            // put y label
            var yLabels = chartGroup.append("g")
            //     .attr("transform", `translate(-20, ${chartHeight /2}) rotate(-90)`);

            yLabels.append("text")
                .attr("x", -40)
                .attr("y", -10)
                .attr("fill", "red")
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
        });
    }

    // call main function
    resize(currentX);

    // function to calc x scale
    function xScaleFunc(width, data) {
        // console.log(data);
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

    // function to calc y scale
    function yScaleFunc(height, data) {
        // define padding pixels
        // console.log(data);
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

// call the function to draw the visulation
period();