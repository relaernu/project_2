function region() {    
    // *** variable definition
    // api route
    var url = "/location/";

    // define axis names for easy reference
    var axisNames = ["postcode", "road", "total"]

    // define where to put chart and buttons
    var current_id = "#region";
    var button_id = "#regionbtn";

    // define chart name
    var axisDefs = {
        postcode: "Postcode Summary",
        road: "Road Summary",
        total: "Total Accidents"
    };

    // initial load axes
    var currentX = axisNames[0];
    var currentX1 = "region";
    var currentY = axisNames[axisNames.length - 1];

    // *** end of variable definition

    // function to add buttons for different aggrigations
    function addButtons() {
        var div = d3.select(button_id);
        for (var i = 0; i < axisNames.length - 1; i++) {
            div.append("button")
                .classed("btn btn-sm btn-success", true)
                .attr("value", axisNames[i])
                .text(capital(axisNames[i]))
        }
    }

    // add buttons to div
    addButtons();

    // function to get api address
    function currentApi() {
        return url + currentX;
    }

    // capitalize first letter function
    function capital(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // main function to draw shape
    function resize(region) {

        d3.json(currentApi()).then(function (data) {

            data.forEach(d => 
                data[currentY] = +data[currentY])

            var svg = d3.select(current_id).select("svg");
            if (!svg.empty()) {
                svg.remove();
            }

            var svgWidth = $(current_id).parent().outerWidth();
            var svgHeight = $(current_id).parent().outerHeight();

            var margin = {
                top: 20,
                left: 50,
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

            var xScale = xScaleFunc(chartWidth, data, currentX);
            var xScale1 = xScaleFunc(chartWidth, data, currentX1);
            var yScale = yScaleFunc(chartHeight, data);
            var xAxis;
            if (currentX === axisNames[0]) {
                xAxis = d3.axisBottom(xScale).tickFormat(d=>data[d][currentX]);
            } else
                xAxis = d3.axisBottom(xScale).tickFormat(d=>data[d][currentX1]);
            var yAxis = d3.axisLeft(yScale);

            // draw x axis
            chartGroup.append("g")
                .attr("transform", `translate(0, ${chartHeight})`)
                .transition()
                .duration(500)
                .call(xAxis);

            var ticks = svg.selectAll(".tick");
            if (currentX === axisNames[0]) {

            } else {
                ticks.select("text")
                    .attr("transform", "rotate(15)")
                    .attr("y", function() {
                        var y = d3.select(this).attr("y");
                        return y+2;
                    });
            }
            
            // draw y axis
            chartGroup.append("g")
                .transition()
                .duration(500)
                .call(yAxis);

            var radius = 10;
            var circleGroup = chartGroup.append("g");
            var circles = circleGroup.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .classed("datacircle", true)
                .attr("cx", (d, i) => xScale(i) + radius / 2)
                .attr("cy", d => yScale(d[currentY]))
                .attr("r", radius)
                .attr("value", d=>d[currentY]);

            var toolTip = d3.tip()
                .attr("class", "d3tip")
                .offset([80, -60])
                .html(function(d) {
                    return (`<strong>${d}<strong><hr>${d}`);
                  });
            
            circles.call(toolTip);

            circles.on("mouseover", function(d) {
                toolTip.show(d, this);
            }).on("mouseout", function(d) {
                toolTip.hide();
            })
            // var rectGroup = chartGroup.append("g");
            // var rects = rectGroup.selectAll("rect")
            //     .data(data)
            //     .enter()
            //     .append("rect")
            //     .classed("bar", true)
            //     .attr("value", d => xScale(d[currentX]))
            //     .attr("width", xScale.bandwidth())
            //     .attr("height", d => chartHeight - yScale(d[currentY]))
            //     .attr("x", d => xScale(d[currentX]))
            //     .attr("y", d => yScale(d[currentY]))
            //     .style("fill", "blue");

            // var numberGroup = rectGroup.append("g");
            // var numbers = numberGroup.selectAll("text")
            //     .data(data)
            //     .enter()
            //     .append("text")
            //     .attr("x", d => xScale(d[currentX]))
            //     .attr("y", d => yScale(d[currentY]) - 5)
            //     .attr("font-size", "8px")
            //     .attr("fill", "red")
            //     .text(d => d[currentY]);

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
            d3.select(button_id).selectAll("button").on("click", function () {
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

    function xScaleFunc(width, data, column) {
        // console.log("befor");
        // console.log(data);
        var info = data.map(x => x[column]);
        // console.log(info);
        // define padding pixels
        var padding = 20;
        // get x scale
        var xBandScale = d3.scaleBand()
            .domain(d3.range(data.length))
            .range([0, width])
            .padding(0.5);

        return xBandScale;
    }

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
}
region();