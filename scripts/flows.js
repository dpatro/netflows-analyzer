/**
 * Created by dpatro on 12/15/14.
 */

function fillTable(flows) {
    d3.select("#flows").select("table").remove();

    console.log(flows);
    //The columns
    var columns = ["sip", "dip", "n"];

    var table = d3.select("#flows").append("table"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(["Source IP", "Destination IP", "Number of Packets"])
        .enter()
        .append("th")
            .text(function(column) { return column; });

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(flows.ingress)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td")
            .text(function(d) { return d.value; });

    return;
}