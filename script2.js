// Load the data from CSV file and create the interactive line chart
d3.csv('interactive_trend.csv').then(function(data) {
  // Convert date string to Date object
  const parseDate = d3.timeParse("%m/%d/%y");
  data.forEach(function(d) {
    d.Date = parseDate(d.Date);
    d.Administered_Cumulative = +d.Administered_Cumulative;
    d.Series_Complete_Cumulative = +d.Series_Complete_Cumulative;
    d.Booster_Cumulative = +d.Booster_Cumulative;
  });

  // Set up the chart dimensions
  const margin = { top: 20, right: 50, bottom: 50, left: 50 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Create the SVG element
  const svg = d3.select("chart3")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Set the initial y-value to display
  let yValue = "Administered_Cumulative";

  // Function to update the line chart based on selected y-value
  function updateChart(selectedYValue) {
    // Update the yValue
    yValue = selectedYValue;

    // Set the y scale based on the selected y-value
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[yValue])])
      .range([height, 0]);

    // Create the line function for the selected y-value
    const line = d3.line()
      .x(d => xScale(d.Date))
      .y(d => yScale(d[yValue]));

    // Remove any existing lines
    svg.selectAll(".line").remove();

    // Add the line for the selected y-value
    svg.append("path")
      .datum(data)
      .attr("class", `line ${yValue}-line`)
      .attr("d", line);
  }

  // X scale based on date
  const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.Date))
    .range([0, width]);

  // Initial y scale based on Administered_Cumulative
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Administered_Cumulative)])
    .range([height, 0]);

  // Initial line function based on Administered_Cumulative
  const line = d3.line()
    .x(d => xScale(d.Date))
    .y(d => yScale(d.Administered_Cumulative));

  // Add the initial line to the chart
  svg.append("path")
    .datum(data)
    .attr("class", "line administered-line")
    .attr("d", line);

  // X axis
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

  // Y axis
  svg.append("g")
    .call(d3.axisLeft(yScale));

  // Button event listeners to update the chart
  document.getElementById("administered-button").addEventListener("click", () => updateChart("Administered_Cumulative"));
  document.getElementById("series-complete-button").addEventListener("click", () => updateChart("Series_Complete_Cumulative"));
  document.getElementById("booster-button").addEventListener("click", () => updateChart("Booster_Cumulative"));
});
