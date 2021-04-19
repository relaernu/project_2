var url = "/data/";

var table_id = "#tbl";
var title_id = "#tbtitle";
var ids = ["accident", "location", "node", "person", "vehicle"];

ids.forEach(id => {
    d3.select("#"+id)
        .classed("btn btn-success", true)
        .on("click", function() {
            var route = d3.select(this).attr("value");
            d3.json(url+route).then(data => {
                d3.select(table_id).html(data["table"]);
                d3.select(title_id).text(`${route} Table`);
            })
        })
})