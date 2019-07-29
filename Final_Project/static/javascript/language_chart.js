var language_setup = function (targetID) {
    // set the dimensions of the canvas
    var margin = { top: 10, right: 0, bottom: 20, left: 40 },
        width = 300 - margin.left - margin.right,
        height = 150 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

    var y = d3.scale.linear().range([height, 0]);

    // define the axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);

    // add the SVG element
    d3.select(targetID).selectAll("svg").remove();

    var svg = d3.select(targetID).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    //Package and export settings
    var settings = {
        margin: margin, width: width, height: height,
        svg: svg, x: x, y: y, xAxis: xAxis, yAxis: yAxis
    }
    return settings;
}


var language_redrawChart = function (settings, newdata) {
    
    //Import settings
    var margin = settings.margin, width = settings.width, height = settings.height, categoryIndent = settings.categoryIndent,
        svg = settings.svg, x = settings.x, y = settings.y, xAxis = settings.xAxis, yAxis= settings.yAxis;

    // scale the range of the data
    x.domain(newdata.map(function (d) { return d._id; }));
    y.domain([0, d3.max(newdata, function (d) { return d.count; })]);

    // add the SVG element
    svg.selectAll(".bar").remove();

                    // add axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("");


    // Add bar chart
    svg.selectAll("bar")
        .data(newdata)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return x(d._id); })
        .attr("width", x.rangeBand())
        .attr("y", function (d) { return y(d.count); })
        .attr("height", function (d) { return height - y(d.count); });

    svg.selectAll("text.bar")
        .data(newdata)
        .enter().append("text")
        .attr("class", "bar")
        .attr("text-anchor", "middle")
        .attr("x", function (d) { return x(d._id) + x.rangeBand() / 2; })
        .attr("y", function (d) { return y(d.count) - 5; })
        .text(function (d) { return d.count; });
}


//Pulls data
//Uses a callback because d3.json loading is asynchronous
var language_pullData = function (settings, data, callback) {

    var newData = data;
    // data.forEach(function (d, i) {
    //     var newValue = d.count + Math.floor((Math.random() * 10) - 5)
    //     newData[i].count = newValue <= 0 ? 10 : newValue
    // })

    //newData = language_formatData(newData);

    callback(settings, newData);

}

//I like to call it what it does
var language_redraw = function (settings, data) {
    language_pullData(settings, data, language_redrawChart)
}