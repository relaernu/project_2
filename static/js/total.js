var url = "http://localhost:5000/total";
d3.json(url).then(function(data) {
    // d3.select("body").select("#total").text(data.Total);
    console.log(data);
    d3.select("body").select("#total").text("Good");
})