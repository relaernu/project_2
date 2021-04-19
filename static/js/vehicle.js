function vehicle() {
    
    // *** variable definition
    // api route
    var url = "/vehicle/";

    // define colors for pie
    var colors = ["white",
        "silver",
        "blue",
        "black",
        "red",
        "grey",
        "green",
        "gold",
        "yellow",
        "aqua",
        "pink"];

    var colors_obj = {
        WHI: "white",
        SIL: "silver",
        BLU: "blue",
        BLK: "black",
        RED: "red",
        GRY: "grey",
        GRN: "green",
        GLD: "gold",
        YLW: "yellow",
        MRN: "marine",
        OTHER: "other"
    };

    // define axis names for easy reference
    var axisNames = ["color", "make", "type", "total"];

    // define where to put chart and buttons
    var current_id = "#vehicle";
    var button_id = "#vehiclebtn";

    // define chart name
    var axisDefs = {
        color: "Vehicle Color",
        make: "Vehicle Make",
        type: "Vehicle Type",
        total: "Total Accidents"
    };

    // initial load axes
    var currentX = axisNames[0];
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
    function resize(vehicle) {
        
        d3.json(currentApi()).then(function (data) {

            // prepare svg area
            var svg = d3.select(current_id).select("svg");
            if (!svg.empty()) {
                svg.remove();
            }

            // get svg width and height by its parent height
            var svgWidth = $(current_id).parent().outerWidth();
            var svgHeight = $(current_id).parent().outerHeight();

            // chart margin
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

            // pie radius
            var radius = d3.min([chartHeight, chartWidth]) / 2;

            // move pie center to chart centre
            var chartGroup = svg.append("g")
                .attr("transform", `translate(${svgWidth * 1 / 4}, ${svgHeight / 2})`);

            // draw pie circle
            var circle = chartGroup.append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", radius + 1)
                .style("stroke-width", 1);

            // define pie scale
            var colorScale = d3.scaleOrdinal()
                .domain(data.map(d=>d[currentX]))
                .range(colors);
            
            var pie = d3.pie()
                    .value(d=>d.total);
            
            var piedata = pie(data);

            // console.log(piedata);

            var arc = d3.arc()
                    .innerRadius(0)
                    .outerRadius(radius);
            
            var arcs = chartGroup.selectAll("arc")
                    .data(piedata)
                    .enter()
                    .append("g")
                    .attr("class", "arc");

            arcs.append("path")
                    .attr("fill", function(d, i) {
                        return colors[i];
                    })
                    .attr("d", arc);
            
            var textGroup = chartGroup.append("g");
            var legends = textGroup.selectAll("rect")
                    .data(piedata)
                    .enter()
                    .append("rect")
                    .attr("x", radius + 30)
                    .attr("y", (d, i) => i * 15 - radius - 13)
                    .attr("width", 15)
                    .attr("height", 15)
                    .style("fill", (d,i) => colors[i])
                    .style("stroke", "black");

            if (currentX === "color") {
                var text = textGroup.selectAll("text")
                    .data(piedata)
                    .enter()
                    .append("text")
                    .attr("dx", radius + 50)
                    .attr("dy", (d, i) => i * 15 - radius)
                    .text((d, i) => capital(colors_obj[d.data[currentX]]) + `(${d.data.total})`);
            } else {
                var text = textGroup.selectAll("text")
                    .data(piedata)
                    .enter()
                    .append("text")
                    .attr("dx", radius + 50)
                    .attr("dy", (d, i) => i * 15 - radius)
                    .text(d => d.data[currentX] + `(${d.data.total})`);
            }

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

    // d3.json(url).then(function(data) {
    //     // d3.select("body").select("#total").text(data.Total);

    // //     console.log(data);
    //     //d3.select("body").select("#total").text(data.total);
    // })
}

vehicle();