var url = "http://localhost:5000/total";

var axisNames = ["year", "month", "day", "hour"];

current_id="#peroid";

var axisDefs = {
    year: "Total Accidents by Year",
    month: "Total Accidents by Month",
    day: "Total Accidents by Week Day",
    hour: "Total Accidents by Hour"
};

var currentX = axisNames[0];
var currentY = "Total Accidents";

//event.preventDefault()

function resize() {
    var svg = d3.select(current_id).select("svg");
    if (!svg.empty()) {
        svg.remove();
    }

    var svgWidth = $(current_id).parent().outerWidth();
    var svgHeight = (window.innerHeight - $("#header").outerHeight() - $(current_id).parent().children(':first-child').outerHeight()) / 3

    var margin = {
        top: 10,
        left: 10,
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
}

resize();

d3.json(url).then(function(data) {
    // d3.select("body").select("#total").text(data.Total);

    console.log(data);
    d3.select("body").select("#total").text(data.total);
})