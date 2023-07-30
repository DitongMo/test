// Load the data from CSV file
d3.csv("cases_by_age_group.csv").then(function(data) {
  // Convert percentage values to numbers
  data.forEach(function(d) {
    d.Percent_of_cases = +d.Percent_of_cases;
    d.Percent_of_US_population = +d.Percent_of_US_population;
  });

  // Set up SVG container
  var svg = d3.select("#chart")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", "0 0 800 400")
    .append("g")
    .attr("transform", "translate(50, 50)");

  // Set up scales and axes
  var xScale = d3.scaleBand()
    .domain(data.map(function(d) { return d.Age_group; }))
    .range([0, 700])
    .padding(0.1);

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d.Percent_of_cases; })])
    .range([300, 0]);

  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0, 300)")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y-axis")
    .call(yAxis);

  // Draw the bars for Percent_of_cases
  svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return xScale(d.Age_group); })
    .attr("y", function(d) { return yScale(d.Percent_of_cases); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return 300 - yScale(d.Percent_of_cases); });

  // Draw the bars for Percent_of_US_population
  svg.selectAll(".bar2")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar2")
    .attr("x", function(d) { return xScale(d.Age_group); })
    .attr("y", function(d) { return yScale(d.Percent_of_US_population); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return 300 - yScale(d.Percent_of_US_population); });
});
