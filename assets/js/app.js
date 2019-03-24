// @TODO: YOUR CODE HERE!ll

var svgWidth = 740;
var svgHeight = 400;

// Define the chart's margins as an object
var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(function(Data) {

    // Throw an error if one occurs
    // if (error) throw error;
  
    // Print the forceData
  console.log(Data);

  Data.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  var xLinearScale = d3.scaleLinear()
    // .domain(d3.extent(Data, data => data.poverty))
    .domain([d3.min(Data, data => data.poverty)-1,d3.max(Data, data => data.poverty)+2])
    .range([0, chartWidth]);

  // Configure a linear scale with a range between the chartHeight and 0
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(Data, data => data.healthcare)-0.6, d3.max(Data, data => data.healthcare)+2])
    .range([chartHeight, 0]);
  
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);


  
  // Append an SVG path and plot its points using the line function
  var drawLine = d3.line()
    .x(data => xLinearScale(data.poverty))
    .y(data => yLinearScale(data.healthcare));


  // Append an SVG group element to the chartGroup, create the left axis inside of it
  chartGroup.append("g")
    .classed("axis", true)
    // .attr("transform", `translate(0, ${chartWidth})`)
    .call(leftAxis);

  // Append an SVG group element to the chartGroup, create the bottom axis inside of it
  // Translate the bottom axis to the bottom of the page
  chartGroup.append("g")
    .classed("axis", true)
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  // Labels
  chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0-margin.left + 0)
        .attr("x", 0 - svgHeight/2)
        .attr("dy","1em")
        .attr("class", "axis-text")
        .text("Lacks Healthcare (%)")
        .style("font-weight", "bold");
  chartGroup.append("text")
        .attr("transform", "translate(" + (svgWidth / 2 - 70) + " ," + (svgHeight - margin.top -20) + ")")
        .attr("class", "axis-text")
        .text("In Poverty (%)")
        .style("font-weight", "bold");

  //circles
  chartGroup.selectAll("circle")
    .data(Data)
    .enter()
    .append("circle")
    .attr("cx", function(data, index) {
        return xLinearScale(data.poverty)
    })
    .attr("cy", function(data, index) {
        return yLinearScale(data.healthcare)
    })
    .attr("r", "9")
    .attr("fill", "lightblue");
    
  //abbr states in circles
  
  chartGroup.append("text")
    .style("text-anchor", "middle")
    .style("font-size", "9px")
    .selectAll("tspan")
    .data(Data)
    .enter()
    .append("tspan")
        .attr("x", function(data) {
            return xLinearScale(data.poverty - 0);
        })
        .attr("y", function(data) {
            return yLinearScale(data.healthcare - 0.2);
        })
        .text(function(data) {
            return data.abbr
        })
        .style("fill", "white")
        .style("font-weight", "bold");

});