// Define the dimensions of the chart
const margin = { top: 20, right: 20, bottom: 40, left: 60 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create the SVG element
const svg = d3.select('chart2')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// Load the data from CSV file
d3.csv('interactive_trend.csv').then(function(data) {
  // Parse date
  const parseDate = d3.timeParse('%m/%d/%Y');
  data.forEach(d => {
    d.Date = parseDate(d.Date);
    d.Administered_Cumulative = +d.Administered_Cumulative;
    d.Series_Complete_Cumulative = +d.Series_Complete_Cumulative;
    d.Booster_Cumulative = +d.Booster_Cumulative;
  });

  // Set the initial y-value
  let yValue = 'Administered_Cumulative';

  // Define the x and y scales
  const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.Date))
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d[yValue])])
    .range([height, 0]);

  // Define the line functions
  const line = d3.line()
    .x(d => xScale(d.Date))
    .y(d => yScale(d[yValue]));

  // Draw the line chart
  svg.append('path')
    .datum(data)
    .attr('class', 'line')
    .attr('d', line);

  // Add x-axis
  svg.append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

  // Add y-axis
  svg.append('g')
    .attr('class', 'axis y-axis')
    .call(d3.axisLeft(yScale));

  // Function to update the chart based on the selected y-value
  function updateChart(selectedValue) {
    yValue = selectedValue;

    // Update the y scale domain
    yScale.domain([0, d3.max(data, d => d[yValue])]);

    // Update the line function
    line.y(d => yScale(d[yValue]));

    // Select the existing line and update the data
    svg.selectAll('.line')
      .datum(data)
      .transition()
      .attr('d', line);

    // Update the y-axis
    svg.select('.y-axis')
      .transition()
      .call(d3.axisLeft(yScale));
  }

  // Button event listeners
  d3.select('#btnAdministered').on('click', () => updateChart('Administered_Cumulative'));
  d3.select('#btnSeriesComplete').on('click', () => updateChart('Series_Complete_Cumulative'));
  d3.select('#btnBooster').on('click', () => updateChart('Booster_Cumulative'));
});
