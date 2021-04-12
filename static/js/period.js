var url = "http://localhost:5000/total/";

var axisNames = ["year", "month", "day", "hour", "total"];

var current_id="#period";

var axisDefs = {
    year: "Total Accidents by Year",
    month: "Total Accidents by Month",
    day: "Total Accidents by Week Day",
    hour: "Total Accidents by Hour",
    total: "Total Accidents"
};

var currentX = axisNames[0];
var currentY = axisNames[4];

//event.preventDefault()
function currentApi() {
    return url + currentX;
}

function resize(peroid) {
    var svg = d3.select(current_id).select("svg");
    if (!svg.empty()) {
        svg.remove();
    }

    var svgWidth = $(current_id).parent().outerWidth();
    var svgHeight = (window.innerHeight - $("#header").outerHeight() - $(current_id).parent().children(':first-child').outerHeight()) / 3

    var margin = {
        top: 10,
        left: 40,
        bottom: 40,
        right: 10
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

    d3.json(currentApi()).then(function(data) {
        // d3.select("body").select("#total").text(data.Total);

        data.forEach(d => {
            d[currentX] = +d[currentX],
            d[currentY] = +d[currentY]
        });

        console.log(data);

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

        console.log(xScale(2006));
        var radius = 5;
        
        var circleGroup = chartGroup.append("g");
        var circles = circleGroup.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("value", d=> xScale(d[currentX]))
            .attr("cx", d => xScale(d[currentX]))
            .attr("cy", d => yScale(d[currentY]))
            .attr("r", radius);
        
        // circles.transition()
        //     .duration(1000)
        //     .attr("cx", d => xScale(d[currentX]))
        //     .attr("cy", d => yScale(d[currentY]))
        //     .attr("r", radius);

        var lineGenerator = d3.line();
        var points = data.map(d => [xScale(d.year), yScale(d.total)]);
        var lines = circleGroup.append("path")
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 5)
            .attr("d", lineGenerator(points));



        
    });
    
    
}

resize(currentX);

function xScaleFunc(width, data) {
    console.log(data);
    // define padding pixels
    var padding = 30;
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
                         .range([0, width]);

    return xLinearScale;
}

function yScaleFunc(height, data) {
    // define padding pixels
    console.log(data);
    var padding = 30;
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