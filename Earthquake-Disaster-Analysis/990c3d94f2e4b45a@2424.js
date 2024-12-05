import define1 from "./b2bbebd2f186ed03@1816.js";

function _1(md){return(
md`## IDEA 1: Box plot showing the degree of data concentration, quartiles and outliers. `
)}

function _2(md){return(
md`## Since outlier is discrete data, I use outlier symbol size to represent the proportion of the number of outliers.`
)}

function _3(md){return(
md`> **Interactivity:** * Select the standard to view by using the drop down box. Hover over the box to view specific data related to quartiles. *`
)}

function _d3(require){return(
require("d3@6")
)}

function _Boxplot_data(FileAttachment){return(
FileAttachment("mc1-reports-data.csv").csv()
)}

function _processedData(d3,Boxplot_data){return(
d3.group(Boxplot_data, (d) => d.location)
)}

function _7(md){return(
md`#### Please select the following options:`
)}

function _selectedMetric(Inputs){return(
Inputs.select(
  ["sewer_and_water", "power", "roads_and_bridges", "medical", "buildings"],
  { label: "Select Metric" }
)
)}

function _stats(processedData,selectedMetric,d3){return(
Array.from(processedData, ([location, values]) => {
  const metricValues = values.map((d) => +d[selectedMetric]).sort(d3.ascending);
  const q1 = d3.quantile(metricValues, 0.25);
  const median = d3.quantile(metricValues, 0.5); // q2
  const q3 = d3.quantile(metricValues, 0.75);
  const iqr = q3 - q1; // Interquartile range
  const lowerWhisker = d3.max([d3.min(metricValues), q1 - 1.5 * iqr]);
  const upperWhisker = d3.min([d3.max(metricValues), q3 + 1.5 * iqr]);
  const outliers = metricValues.filter(
    (v) => v < lowerWhisker || v > upperWhisker
  );

  return {
    location,
    q1,
    median,
    q3,
    lowerWhisker,
    upperWhisker,
    outliers,
    total: values.length
  };
})
)}

function _chart(d3,Boxplot_data,selectedMetric,stats)
{
  const margin = { top: 70, right: 50, bottom: 100, left: 50 };
  const width = 850 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  const locationDescriptions = [
    "1. PALACE HILLS",
    "2. NORTHWEST",
    "3. OLD TOWN",
    "4. SAFE TOWN",
    "5. SOUTHWEST",
    "6. DOWNTOWN",
    "7. WILSON FOREST",
    "8. SCENIC VISTA",
    "9. BROADVIEW",
    "10. CHAPPARAL",
    "11. TERRAPIN SPRINGS",
    "12. PEPPER MILL",
    "13. CHEDDARFORD",
    "14. EASTON",
    "15. WESTON",
    "16. SOUTHTON",
    "17. OAK WILLOW",
    "18. EAST PARTON",
    "19. WEST PARTON"
  ];

  const x = d3
    .scaleBand()
    .domain(locationDescriptions)
    .range([0, width])
    .paddingInner(0.1)
    .paddingOuter(0.2);

  const yDomain = d3.extent(Boxplot_data, (d) => +d.sewer_and_water);

  const y = d3.scaleLinear().domain(yDomain).range([height, 0]);

  const svg = d3
    .create("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  // .append("g")
  // .attr("transform", `translate(${margin.left},${margin.top})`);

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // X axis
  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(10,10)rotate(30)")
    .style("text-anchor", "start")
    .attr("dx", "-0.8em")
    .attr("dy", "0.5em");
  // Y axis
  g.append("g").call(d3.axisLeft(y));

  // X axis label
  g.append("text")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 10)
    .text("Neighborhoods");

  // Y axis label
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("transform", `rotate(-90)`)
    .attr("y", margin.left / 4) // Adjust this to place label outside of the y-axis
    .attr("x", -(height / 2 + margin.top))
    .text("Damage Value");

  // chart title
  svg
    .append("text")
    .attr("class", "chart-title")
    .attr("x", width / 2 + margin.left)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .text(selectedMetric + " Damage Value for Each Neighborhood");

  // Box plot
  // Box main body
  // Box main body
  g.selectAll(".box")
    .data(stats)
    .join(
      (enter) =>
        enter
          .append("rect")
          .attr("class", "box")
          .attr(
            "x",
            (d) => x(locationDescriptions[+d.location - 1]) + x.bandwidth() / 4
          )
          .attr("y", (d) => y(d.q3))
          .attr("width", x.bandwidth() / 2)
          .attr("height", (d) => Math.max(0, y(d.q1) - y(d.q3))) 
          .style("fill", "#69b3a2")
          .attr("stroke", "black"), 
      (update) =>
        update
          .attr(
            "x",
            (d) => x(locationDescriptions[+d.location - 1]) + x.bandwidth() / 4
          )
          .attr("y", (d) => y(d.q3))
          .attr("width", x.bandwidth() / 2)
          .attr("height", (d) => Math.max(0, y(d.q1) - y(d.q3))) 
          .style("fill", "#69b3a2")
          .attr("stroke", "black"), 
      (exit) => exit.remove()
    );

  // add median line
  g.selectAll(".median")
    .data(stats)
    .join(
      (enter) =>
        enter
          .append("line")
          .attr("class", "median")
          .attr(
            "x1",
            (d) => x(locationDescriptions[+d.location - 1]) + x.bandwidth() / 4
          )
          .attr(
            "x2",
            (d) =>
              x(locationDescriptions[+d.location - 1]) + (x.bandwidth() * 3) / 4
          )
          .attr("y1", (d) => y(d.median))
          .attr("y2", (d) => y(d.median))
          .attr("stroke", "black"),
      (update) =>
        update
          .attr(
            "x1",
            (d) => x(locationDescriptions[+d.location - 1]) + x.bandwidth() / 4
          )
          .attr(
            "x2",
            (d) =>
              x(locationDescriptions[+d.location - 1]) + (x.bandwidth() * 3) / 4
          )
          .attr("y1", (d) => y(d.median))
          .attr("y2", (d) => y(d.median))
          .attr("stroke", "black"),
      (exit) => exit.remove()
    );

  // whiskers and its caps
  // lower whiskers
  g.selectAll(".lower-whisker")
    .data(stats)
    .enter()
    .append("line")
    .attr("class", "lower-whisker")
    .attr(
      "x1",
      (d) => x(locationDescriptions[+d.location - 1]) + x.bandwidth() / 2
    )
    .attr(
      "x2",
      (d) => x(locationDescriptions[+d.location - 1]) + x.bandwidth() / 2
    )
    .attr("y1", (d) => y(d.q1))
    .attr("y2", (d) => y(d.lowerWhisker))
    .attr("stroke", "grey")
    .attr("stroke-width", "1")
    .attr("stroke-dasharray", "4");

  // upper whiskers
  g.selectAll(".upper-whisker")
    .data(stats)
    .enter()
    .append("line")
    .attr("class", "upper-whisker")
    .attr(
      "x1",
      (d) => x(locationDescriptions[+d.location - 1]) + x.bandwidth() / 2
    )
    .attr(
      "x2",
      (d) => x(locationDescriptions[+d.location - 1]) + x.bandwidth() / 2
    )
    .attr("y1", (d) => y(d.q3))
    .attr("y2", (d) => y(d.upperWhisker))
    .attr("stroke", "grey")
    .attr("stroke-width", "1")
    .attr("stroke-dasharray", "4");

  // whisker caps
  g.selectAll(".whisker-cap")
    .data(stats)
    .enter()
    .each(function (d) {
      const xPosition =
        x(locationDescriptions[+d.location - 1]) + x.bandwidth() / 2;
      // lower whisker caps
      d3.select(this)
        .append("line")
        .attr("x1", xPosition - 4)
        .attr("x2", xPosition + 4)
        .attr("y1", y(d.lowerWhisker))
        .attr("y2", y(d.lowerWhisker))
        .attr("stroke", "grey")
        .attr("stroke-width", "1");
      // upper whisker caps
      d3.select(this)
        .append("line")
        .attr("x1", xPosition - 4)
        .attr("x2", xPosition + 4)
        .attr("y1", y(d.upperWhisker))
        .attr("y2", y(d.upperWhisker))
        .attr("stroke", "grey")
        .attr("stroke-width", "1");
    });

  // outlier symbol size control
  stats.forEach((stat) => {
    // The number of each outlier in current location
    let outlierCounts = {};
    stat.outliers.forEach((outlier) => {
      outlierCounts[outlier] = (outlierCounts[outlier] || 0) + 1;
    });

    // Avoid redrawing symbol
    let processedOutliers = {};

    stat.outliers.forEach((outlier) => {
      if (!processedOutliers[outlier]) {
        // proportion：Number of outlier/total number of records of the same location
        const proportion = (outlierCounts[outlier] / stat.total) * 100;

        // size control elements
        const baseSize = 0.1;
        const proportionFactor = 3;

        const adjustedSize = baseSize + proportion * proportionFactor;

        // horizontal part of the cross symbol
        g.append("line")
          .attr("class", "outlier-horiz")
          .attr(
            "x1",
            x(locationDescriptions[+stat.location - 1]) +
              x.bandwidth() / 2 -
              adjustedSize
          )
          .attr(
            "x2",
            x(locationDescriptions[+stat.location - 1]) +
              x.bandwidth() / 2 +
              adjustedSize
          )
          .attr("y1", y(outlier))
          .attr("y1", y(outlier))
          .attr("y2", y(outlier))
          .attr("stroke", "red");

        // vertical part of the cross symbol
        g.append("line")
          .attr("class", "outlier-vert")
          .attr(
            "x1",
            x(locationDescriptions[+stat.location - 1]) + x.bandwidth() / 2
          )
          .attr(
            "x2",
            x(locationDescriptions[+stat.location - 1]) + x.bandwidth() / 2
          )
          .attr("y1", y(outlier) - adjustedSize)
          .attr("y2", y(outlier) + adjustedSize)
          .attr("stroke", "red");

        // show proportion value
        g.append("text")
          .attr(
            "x",
            x(locationDescriptions[+stat.location - 1]) + x.bandwidth() / 2
          )
          .attr("y", y(outlier) - 10)
          .attr("text-anchor", "middle")
          .style("font-size", "8px")
          .style("fill", "black")
          .text(`${proportion.toFixed(2)}%`);

        processedOutliers[outlier] = true;
      }
    });
  });

  // tooltip
  const tooltip = svg
    .append("g")
    .attr("class", "tooltip")
    .style("display", "none");

  tooltip
    .append("rect")
    .attr("width", 120)
    .attr("height", 60)
    .attr("fill", "white")
    .style("opacity", 0.8);

  const tooltipText = tooltip
    .append("text")
    .attr("x", 5)
    .attr("y", 15)
    .attr("text-anchor", "start")
    .style("font-size", "12px");

  g.selectAll(".box")
    .on("mouseover", function (event, d) {
      const tooltipData = [
        `Q1: ${d.q1}`,
        `Median: ${d.median}`,
        `Q3: ${d.q3}`,
        `Upper Whisker: ${d.upperWhisker}`,
        `Lower Whisker: ${d.lowerWhisker}`
      ];

      const [xPosition, yPosition] = d3.pointer(event, g.node());

      const textSelection = tooltipText.selectAll("tspan").data(tooltipData);
      textSelection
        .join("tspan")
        .attr("x", 5)
        .attr("dy", (d, i) => `${i === 0 ? 1.2 : 1.5}em`)
        .text((d) => d);

      // use requestAnimationFrame to make tooltip work smoothly
      requestAnimationFrame(() => {
        const bbox = tooltipText.node().getBBox();
        const padding = 10;
        tooltip
          .select("rect")
          .attr("width", bbox.width + padding * 2)
          .attr("height", bbox.height + padding * 2);

        tooltip
          .attr(
            "transform",
            `translate(${xPosition - bbox.width / 2}, ${
              yPosition - bbox.height / 2 - padding
            })`
          )
          .style("display", null);

        tooltipText.attr("y", padding);
      });
    })
    .on("mouseout", function () {
      tooltip.style("display", "none");
    });

  return svg.node();
}


function _11(md){return(
md`## IDEA 2: Parallel coordinates shows the trend between different metrics damage values. `
)}

function _12(md){return(
md`## This graph is used to verify a specific hypothesis.`
)}

function _13(md){return(
md`> **Interactivity:** * Select the neighbourhoods you want to view by using the multi-select box. select the start time and end time you want to view by using the time slider.You can also use the time slider to fix the time interval you want to view. *`
)}

function _paraCoor_data(FileAttachment){return(
FileAttachment("mc1-reports-data.csv").csv()
)}

function _locationOptions(paraCoor_data){return(
Array.from(new Set(paraCoor_data.map((d) => d.location)))
)}

function _defaultSelectedLocation(locationOptions){return(
locationOptions[0]
)}

function _locationLabels(){return(
[
  "1. PALACE HILLS",
  "2. NORTHWEST",
  "3. OLD TOWN",
  "4. SAFE TOWN",
  "5. SOUTHWEST",
  "6. DOWNTOWN",
  "7. WILSON FOREST",
  "8. SCENIC VISTA",
  "9. BROADVIEW",
  "10. CHAPPARAL",
  "11. TERRAPIN SPRINGS",
  "12. PEPPER MILL",
  "13. CHEDDARFORD",
  "14. EASTON",
  "15. WESTON",
  "16. SOUTHTON",
  "17. OAK WILLOW",
  "18. EAST PARTON",
  "19. WEST PARTON"
]
)}

function _18(md){return(
md`#### Neighborhoods Name Cross Reference Table:`
)}

function _19(md){return(
md`<style>
  .location-table {
    width: 100%;
    border-collapse: collapse;
  }

  .location-table th,
  .location-table td {
    text-align: left;
    padding: 8px;
  }

  .location-table th {
    background-color: #f2f2f2;
  }

  .location-table tr:nth-child(even) {
    background-color: #f9f9f9;
  }
</style>

<table class="location-table">
  <thead>
    <tr>
      <th colspan="2">St. Himark Neighborhoods list</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1. PALACE HILLS</td>
      <td>11. TERRAPIN SPRINGS</td>
    </tr>
    <tr>
      <td>2. NORTHWEST</td>
      <td>12. PEPPER MILL</td>
    </tr>
    <tr>
      <td>3. OLD TOWN</td>
      <td>13. CHEDDARFORD</td>
    </tr>
    <tr>
      <td>4. SAFE TOWN</td>
      <td>14. EASTON</td>
    </tr>
    <tr>
      <td>5. SOUTHWEST</td>
      <td>15. WESTON</td>
    </tr>
    <tr>
      <td>6. DOWNTOWN</td>
      <td>16. SOUTHTON</td>
    </tr>
    <tr>
      <td>7. WILSON FOREST</td>
      <td>17. OAK WILLOW</td>
    </tr>
    <tr>
      <td>8. SCENIC VISTA</td>
      <td>18. EAST PARTON</td>
    </tr>
    <tr>
      <td>9. BROADVIEW</td>
      <td>19. WEST PARTON</td>
    </tr>
    <tr>
      <td>10. CHAPPARAL</td>
      <td></td> 
    </tr>
  </tbody>
</table>
`
)}

function _20(md){return(
md`#### Please select the following options:`
)}

function _selectedLocations(Inputs,locationOptions,defaultSelectedLocation){return(
Inputs.checkbox(locationOptions, {
  value: [defaultSelectedLocation], // default option
  label: "Select Neighborhoods"
})
)}

function _startTime(){return(
new Date("2020-04-06T00:00:00Z").getTime()
)}

function _endTime(){return(
new Date("2020-04-11T00:00:00Z").getTime()
)}

function _25(md){return(
md`#### Please select the following options:`
)}

function _timeSlider(rangeSlider,startTime,endTime){return(
rangeSlider({
  min: startTime,
  max: endTime,
  step: 60 * 60 * 1000 * 1, // 1 hour
  value: [startTime, startTime + 3 * 60 * 60 * 1000], // 3 hours
  title: "Choose Time Range",
  format: (value) => new Date(value).toLocaleString() 
})
)}

function _filteredData(paraCoor_data,timeSlider,selectedLocations){return(
paraCoor_data.filter((d) => {
  const dTime = new Date(d.time).getTime();
  return (
    dTime >= timeSlider[0] &&
    dTime <= timeSlider[1] &&
    selectedLocations.includes(d.location)
  );
})
)}

function _chart2(filteredData,locationOptions,d3,selectedLocations)
{
  const keys = [
    "sewer_and_water",
    "power",
    "roads_and_bridges",
    "medical",
    "buildings",
    "shake_intensity"
  ];
  const locations = [...new Set(filteredData.map((d) => d.location))];

  // set same color in town map
  const customColors = [
    "#FF7F94",
    "#BF7FFF",
    "#FFF87F",
    "#FF7FF0",
    "#FFC57F",
    "#7FD4FF",
    "#82B97F",
    "#FFF87F",
    "#BF7FFF",
    "#7FFFFF",
    "#FFD47F",
    "#FF7F7F",
    "#7FDDFF",
    "#7FFFF0",
    "#847FFF",
    "#AAFF7F",
    "#FFFB7F",
    "#FFD07F",
    "#FF7F7F"
  ];

  // location name
  const locationDescriptions = [
    "1. PALACE HILLS",
    "2. NORTHWEST",
    "3. OLD TOWN",
    "4. SAFE TOWN",
    "5. SOUTHWEST",
    "6. DOWNTOWN",
    "7. WILSON FOREST",
    "8. SCENIC VISTA",
    "9. BROADVIEW",
    "10. CHAPPARAL",
    "11. TERRAPIN SPRINGS",
    "12. PEPPER MILL",
    "13. CHEDDARFORD",
    "14. EASTON",
    "15. WESTON",
    "16. SOUTHTON",
    "17. OAK WILLOW",
    "18. EAST PARTON",
    "19. WEST PARTON"
  ];

  const globalColorMapping = locationOptions.reduce((acc, location, index) => {
    acc[location] = customColors[index % customColors.length]; 
    return acc;
  }, {});

  // color scale
  const color = d3
    .scaleOrdinal()
    .domain(locationOptions) 
    .range(locationOptions.map((location) => globalColorMapping[location])); 

  const margin = { top: 50, right: 130, bottom: 50, left: 50 },
    width = 850 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  const svg = d3
    .create("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + 10) 
    .style("max-width", "100%")
    .style("height", "auto")
    .style("border", "none");

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3
    .scaleLinear()
    .domain([0, 10])
    .range([0, width / 1.06]);

  const y = d3.scalePoint().domain(keys).range([0, height]);

  const line = d3
    .line()
    .defined(([, value]) => value != null)
    .x(([key, value]) => x(value))
    .y(([key]) => y(key));

  g.selectAll("path")
    .data(filteredData)
    .join("path")
    .attr("fill", "none")
    .attr("stroke", (d) => color(d.location))
    .attr("stroke-width", 1.5)
    .attr("stroke-opacity", 0.2)
    .attr("d", (d) => line(keys.map((key) => [key, d[key]])));

  keys.forEach((key) => {
    g.append("g")
      .attr("transform", `translate(0,${y(key)})`)
      .call(d3.axisBottom(x).ticks(10))
      .append("text")
      .attr("fill", "currentColor")
      .attr("y", 10)
      .attr("x", -margin.left * 0.9)
      .attr("text-anchor", "start")
      .text(key);
  });

  // color legend
  const legend = g
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width + margin.right / 4 - 35}, ${20})`);

  selectedLocations.forEach((location, index) => {
    // make legend dynamic
    const description = locationDescriptions.find((desc) =>
      desc.includes(location)
    );
    if (description) {
      legend
        .append("circle")
        .attr("cx", 0)
        .attr("cy", index * 20)
        .attr("r", 5)
        .style("fill", globalColorMapping[location]);

      legend
        .append("text")
        .attr("x", 10)
        .attr("y", index * 20)
        .attr("dy", "0.32em")
        .text(description)
        .style("font-size", "10px")
        .style("user-select", "none");
    }
  });

  // title
  svg
    .append("text")
    .attr("class", "title")
    .attr("x", width / 2 + margin.left) 
    .attr("y", margin.top / 2) 
    .attr("text-anchor", "middle") 
    .style("font-size", "20px") 
    .text("Comparison of Damage Value");

  return svg.node();
}


function _29(md){return(
md`## IDEA 3: Mutiple Map shows the average shake intensity for each day and how citizens feel about the shaking.`
)}

function _30(md){return(
md`## I can tell if the shake intensity data is reliable by comparing these maps to shakemaps.`
)}

function _31(md){return(
md`> **Interactivity:** * Hover over neighborhood to see specific information related to shaking. *`
)}

function _map_data(FileAttachment){return(
FileAttachment("mc1-reports-data.csv").csv()
)}

function _filterDataByDate(){return(
function filterDataByDate(map_data, startDate, endDate) {
  return map_data.filter((d) => {
    const date = new Date(d.time);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return date >= start && date < end;
  });
}
)}

function _calculateAverageIntensity(){return(
function calculateAverageIntensity(data) {
  const validData = data.filter(
    (d) => !isNaN(parseFloat(d.shake_intensity)) && isFinite(d.shake_intensity)
  );
  const totalIntensity = validData.reduce(
    (acc, curr) => acc + parseFloat(curr.shake_intensity),
    0
  );
  return validData.length > 0 ? totalIntensity / validData.length : 0;
}
)}

function _35(md){return(
md`<div id="map-container-1"></div>
<div id="map-container-2"></div>
<div id="map-container-3"></div>
<div id="map-container-4"></div>
<div id="map-container-5"></div>`
)}

function _36(htl){return(
htl.html`<script src="https://d3js.org/d3.v6.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3-legend/2.25.6/d3-legend.min.js"></script>`
)}

function _drawMap(d3){return(
function drawMap(data, containerSelector, averageIntensity, title) {
  // Avoid adding SVG repeatedly in the same container
  d3.select(containerSelector).selectAll("*").remove();

  const svg = d3
    .select(containerSelector)
    .append("svg")
    .attr("width", 850)
    .attr("height", 550);

  const margin = { top: 30, right: 130, bottom: 60, left: 50 },
    width = 850 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  // title
  svg
    .append("text")
    .attr("x", width / 2) 
    .attr("y", margin.top / 2) 
    .attr("text-anchor", "middle") 
    .style("font-size", "18px") 
    .text(title); 

  // svg path data
  const pathsData = [
    {
      d: "m 68.294116,108.34313 -0.421568,-8.431368 14.754901,-2.529411 10.117647,-8.009804 17.284314,-4.637255 10.11765,1.686275 7.58823,2.107843 5.48039,-2.950981 0.84314,94.852941 -17.70588,-3.79412 0.84314,31.19608 -17.284318,1.68627 -2.529411,5.05883 -12.647059,5.05882 -5.058823,17.70588 -6.323529,24.45098 -19.813726,1.26471 5.058824,-18.54902 13.490196,-2.10784 4.215686,-8.00981 3.372549,-18.54902 -4.215686,-9.69608 -6.745098,-7.16666 -1.264706,-10.11765 -15.598039,-0.84314 -13.490196,-2.10784 -0.843137,-5.48039 4.215686,1.2647 12.22549,-1.2647 6.323529,0.42157 -10.539215,-34.9902 -3.372549,-12.22549 3.794118,-2.52941 7.166666,-20.23529 8.009804,-2.10785 z",
      id: "1",
      class: "unselected selected"
    },
    {
      d: "m 133.42646,85.578429 6.95589,-2.95098 6.00735,1.47549 1.15932,9.063726 10.22303,2.634804 6.21814,-3.056373 3.47794,-0.105392 3.79412,-3.89951 -0.10539,-5.269608 18.12745,-0.843137 -3.37255,8.431373 h 5.48039 l 5.05883,-2.107844 0.42156,-8.431372 5.05883,-0.843137 v 8.852941 l 8.0098,-3.794118 4.63726,0.421569 16.0196,-4.637255 6.7451,7.166667 -0.84314,62.392157 -15.59803,2.52941 -14.75491,-5.48039 -11.17156,-1.68627 -13.55193,1.88427 -7.31572,12.87062 0.63235,6.95588 -4.84804,8.64216 -9.69608,5.05883 h -17.70588 l -8.43137,-0.42157 z",
      id: "2",
      class: "unselected",
      style: "opacity: 1;"
    },
    {
      d: "m 230.49265,80.624998 6.85048,7.272059 -0.94852,62.286763 15.70342,3.68873 15.28187,-1.79167 6.6397,3.89951 8.22059,2.74019 8.43137,0.21079 12.43628,-1.47549 8.22058,4.0049 20.44608,-5.26961 9.69608,-1.05392 h 20.02451 l 24.66176,-35.83333 1.89706,-11.80392 -0.42157,-3.37255 14.33334,-42.578432 -0.42157,-6.534313 -4.42647,10.117647 -6.53432,-0.210785 -4.42647,-0.632353 -1.68627,-2.529411 2.95098,-2.950981 3.58333,0.421569 3.37255,-4.004902 4.21569,-0.421569 -3.16177,-2.740196 -4.21568,-4.848039 -2.95098,-0.210784 -1.26471,-6.323529 1.26471,-6.32353 h -9.06373 l -4.0049,-1.47549 -3.16176,4.848039 -3.58334,-3.372549 h -6.32353 l 4.21569,7.588236 -0.84314,8.852941 -5.48039,6.745097 5.90196,4.84804 2.31863,4.848039 0.42157,5.269607 -0.84314,5.269608 -1.47549,3.794118 -2.7402,0.632353 -2.31862,-0.843138 -1.89706,1.475491 -2.10785,1.264705 -4.21568,-1.053921 -1.89706,-0.421569 -0.63235,-3.583333 -1.47549,-2.529412 1.05392,-3.794117 -1.89706,-1.686275 -3.79412,-0.632353 -1.89706,-1.897059 -1.89706,-4.004901 2.52942,-4.215687 -8.64216,-4.215686 -4.0049,-6.955882 -8.00981,4.426471 -6.74509,2.107843 -10.11765,-4.637255 -1.89706,-6.745098 1.26471,-3.794118 -1.26471,-2.318627 -2.31863,-1.264706 0.84314,-2.529412 -1.26471,-8.009803 -11.17156,5.058823 -2.31863,2.740196 -6.32353,2.740196 -2.7402,-0.210784 -15.80882,9.063725 -4.84804,4.848039 -5.05882,0.421569 -3.37255,1.264706 -2.95098,-2.740196 -5.26961,1.053921 -4.42647,3.372549 -2.31863,3.794118 -1.68627,3.794117 1.89706,2.318628 1.68627,2.740196 h -3.58333 l -0.42157,1.47549 0.63235,2.107843 2.10784,1.47549 v 2.107843 l -0.84313,2.740196 z",
      id: "3",
      class: "unselected",
      style: "opacity: 1;"
    },
    {
      d: "m 401.63495,55.18356 0.15653,6.259975 -14.20312,42.765895 0.47271,3.19173 -1.94509,11.90568 -24.58217,35.82243 -11.86951,22.23668 -14.60661,16.09707 v 29.21322 l 146.36417,0.89428 25.33799,-4.47141 -2.08666,-7.45235 10.73139,-5.0676 -9.53901,-5.66378 -7.45235,0.59618 -7.15426,-7.45235 -1.78856,-9.53901 h 2.08665 l -8.34663,-12.22185 3.87522,-6.85616 -6.55807,-8.34664 0.2981,-8.64472 -5.66379,-8.64473 7.45235,1.49047 -4.47141,-5.36569 -5.36569,-2.08666 -2.98094,-7.75045 -5.36569,1.78857 -4.17332,-4.76951 -0.89428,-4.47141 3.57713,-0.89428 5.0676,4.47141 2.08665,-0.59619 6.55807,3.87523 5.66379,-2.98094 -2.68285,-3.87523 -5.96188,-5.0676 -5.0676,-4.17331 7.45235,-7.75045 6.55807,-8.644723 3.87522,-6.856163 h -3.27903 l -2.98094,1.192376 -2.08666,3.577129 -10.13519,10.135201 -4.17332,3.57712 -8.64473,5.0676 h -6.85616 l -7.15426,0.2981 -6.55807,-3.87523 1.19238,-5.06759 -3.57713,-2.384757 0.59619,-2.98094 2.38475,-1.192376 2.38475,0.596188 0.89429,2.086658 -0.59619,2.086659 2.38475,-0.596189 0.59619,-0.298094 -0.89428,-2.98094 -2.38476,-2.384752 -1.78856,-2.384752 -1.49047,-2.086658 -1.78856,-6.558069 -6.55807,-4.471411 -2.08666,0.894283 -2.38475,-6.856163 -6.55807,-7.750445 -6.55807,-2.086658 -2.68285,-11.029479 2.98094,-7.154257 -2.08665,-0.894282 h -1.78857 l -1.19238,4.769505 -0.89117,3.570923 z",
      id: "4",
      class: "unselected",
      style: "opacity: 1;"
    },
    {
      d: "m 117.15096,207.92059 -0.74524,-31.15083 17.60563,3.72307 8.51066,0.55254 12.42076,-0.1054 0.0723,40.34809 7.18732,0.17462 -0.28001,22.7967 51.28715,0.33116 38.97799,46.94542 25.0399,35.1751 3.27903,6.85616 -8.94282,-0.2981 -2.38475,-5.36569 -19.37611,-0.59619 -10.1352,-2.08665 -7.45235,-1.19238 -18.77993,-11.62567 -7.15425,-3.27903 -7.45235,-4.17332 -9.83711,-6.55807 -7.75044,-0.59619 -5.36569,1.78857 -9.24092,-6.55807 -4.17331,-6.25997 -6.55807,-6.55807 -6.85617,-2.38476 -1.78856,-2.68284 -3.57713,-0.2981 -14.30851,-9.539 -1.19238,-4.76951 -3.57713,-5.66379 -2.08665,-2.68284 -0.2981,-1.49047 -2.68284,-5.96188 4.47141,-5.36569 1.78856,-4.47142 -1.19238,-5.06759 v -7.15426 l -1.49047,-0.89428 1.19238,-3.57713 2.08666,-4.17332 -0.89428,-7.45235 z",
      id: "5",
      class: "unselected"
    },
    {
      d: "m 214.85128,150.23939 -8.64474,-2.98094 -11.17852,-1.78856 -13.71233,2.01213 -7.07973,12.74352 0.44714,6.85617 -4.7695,8.64472 -9.76259,4.99308 -5.14212,0.22357 -0.14904,40.09364 7.45235,0.2981 -0.2981,22.80419 51.27218,0.44714 0.96881,-22.95324 z",
      id: "6",
      class: "unselected"
    },
    {
      d: "m 585.98038,398.17156 -0.42157,-8.64215 0.31617,-53.53922 -0.52695,-103.60049 0.84313,-15.49265 4.63726,-0.21078 0.84314,-2.52941 5.48039,-2.31863 5.26961,-2.10784 4.63725,-1.47549 4.21569,-4.42647 -0.84314,-2.52941 1.26471,-0.63236 h 1.2647 l 0.21079,1.26471 0.84313,1.47549 1.05392,0.84314 1.26471,1.05392 v 1.47549 1.2647 l -1.47549,0.21079 -1.47549,1.47549 -1.68627,0.42157 h -1.05393 l -2.10784,3.16176 -2.52941,-0.42157 -0.21079,-1.2647 h -3.16176 l -0.21078,1.47549 1.89705,-0.21079 -2.74019,5.05883 -3.16177,2.10784 1.89706,2.74019 2.10785,-1.2647 1.05392,1.68627 0.84313,0.21079 4.00491,-4.63726 -1.05393,-3.16176 8.22059,1.05392 6.32353,-5.05882 2.10785,1.89706 -0.10539,184.85783 z",
      id: "7",
      class: "unselected"
    },
    {
      d: "m 424.59192,486.20708 -5.04823,-6.89415 -0.0617,-14.10137 23.37587,-0.56003 15.52133,-13.05802 10.66707,-5.87639 7.67116,0.0979 19.27927,-9.66612 54.36117,-32.07538 9.06373,0.21078 v -7.16666 l 5.90196,-7.37745 20.23529,-0.21079 0.21079,8.64216 37.94117,0.21078 0.42157,6.11275 -5.48039,1.68627 -4.84804,4.21569 -1.68628,0.84314 h -9.27451 l -2.31862,1.89706 -4.00491,1.2647 -4.21568,0.21079 -1.89706,-1.26471 -6.53431,1.47549 -1.89706,1.89706 -3.58334,-0.21079 -2.74019,0.63236 -6.32353,4.21568 -5.90196,2.95098 -12.01471,4.42647 -5.69117,-0.42156 -12.43628,4.42647 -2.10784,2.52941 -3.16177,-0.21079 -4.63725,2.7402 -6.7451,5.05882 -2.52941,2.52942 -2.7402,0.42156 -3.37254,0.42157 -1.05393,1.26471 -5.2696,1.05392 -3.16177,-0.63235 -1.47549,0.42157 -2.31863,2.31862 -3.79411,-0.63235 -2.10785,0.63235 -2.31862,1.26471 -0.63236,1.89706 v 1.47549 l -3.58333,1.68627 -1.68628,1.68628 -1.47549,2.52941 -2.31862,3.16176 -4.84804,1.05392 h -4.42647 l -5.26961,-0.84313 -5.05882,0.63235 -6.53432,3.37255 -5.05882,4.42647 -2.52941,4.0049 -2.52941,1.89706 -4.63726,-0.42157 z",
      id: "8",
      class: "unselected"
    },
    {
      d: "m 282.34559,344 -8.32599,3.79411 4.32108,8.00981 0.31618,24.0294 -8.00981,7.58824 8.00981,5.05882 3.37255,5.4804 8.85294,1.2647 9.27451,8.00981 6.32353,5.05882 8.0098,10.53921 11.38235,15.59804 8.43137,18.97059 -1.2647,5.05882 4.63725,6.7451 6.7451,3.37255 9.27451,3.79412 h 4.63726 l 6.74509,2.95098 2.95098,-0.42157 5.4804,0.84314 3.79411,2.95098 7.16667,5.48039 8.0098,1.68627 2.52942,2.10785 h 3.79411 l 2.52941,1.2647 h 18.12746 l 5.05882,-7.16666 -5.05882,-7.16667 -0.42157,-43.84314 7.16666,-6.32353 17.4951,-6.11274 5.69118,-6.53431 -0.42157,-51.00981 -60.91667,0.73775 -52.48529,0.10539 -0.52696,-20.23529 z",
      id: "9",
      class: "unselected"
    },
    {
      d: "m 494.60538,335.99019 -45.61361,-0.46212 0.0437,29.70833 0.42905,50.87301 -5.86889,6.51313 -17.60049,6.11274 -6.85049,6.42892 0.31617,30.31678 23.29167,-0.80697 15.49265,-12.96323 10.75,-5.90197 h 7.79902 l 19.18137,-9.69607 z",
      id: "10",
      class: "unselected"
    },
    {
      d: "m 494.66586,335.90522 1.33393,100.52123 54.48819,-32.32073 9.00455,0.13096 0.13096,-7.16174 5.83531,-7.35755 20.15751,-0.29809 0.32368,-53.42678 z",
      id: "11",
      class: "unselected"
    },
    {
      d: "m 506.72548,219.21568 -25.08333,4.63726 12.43628,17.07352 0.42156,94.95834 91.48039,0.31618 -0.42157,-103.91667 -6.95589,9.69607 2.7402,9.69609 -5.90196,5.48039 -0.84313,4.63725 -8.85294,5.26961 -9.69608,0.63235 -1.26471,-5.48039 -8.0098,-1.26471 -9.69608,8.85295 -3.37255,-2.95098 0.84314,-9.69608 -9.69608,-8.85294 -4.21569,-2.95098 -1.68627,-8.43138 -7.58824,-8.43137 z",
      id: "12",
      class: "unselected",
      style: "opacity: 1;"
    },
    {
      d: "m 417.12278,223.03098 -0.20019,30.05485 -14.10757,23.28856 0.44714,27.59777 0.31928,38.29042 -4.04106,5.476 -7.68615,0.37481 -4.14335,5.38249 0.0979,12.25545 61.2597,-0.34486 -0.0979,-29.83785 45.52941,0.42157 -0.44714,-95.20218 -12.62149,-17.30989 z",
      id: "13",
      class: "unselected"
    },
    {
      d: "m 361.49509,155.13725 -11.69853,22.23775 -14.7549,16.01961 -0.10539,29.29902 -67.87255,-1e-5 0.31618,-70.61274 6.6397,3.89951 8.22059,2.74019 8.32598,0.1054 12.54167,-1.47549 8.1152,4.11029 20.44607,-5.26961 9.69608,-1.15931 z",
      id: "14",
      class: "unselected"
    },
    {
      d: "m 214.85127,150.23939 6.11093,2.45927 15.64993,-2.53379 15.41358,3.7037 15.43697,-1.80755 -0.32368,70.60773 -52.95844,-1.03584 z",
      id: "15",
      class: "unselected"
    },
    {
      d: "m 214.2392,221.58616 -0.91237,23.16402 38.75533,46.8793 14.48624,20.41194 0.56001,-89.29906 z",
      id: "16",
      class: "unselected"
    },
    {
      d: "m 272.54411,320.39215 4.84804,6.32352 3.16176,6.9559 1.89706,10.32842 52.69608,1.68628 0.42157,20.23529 52.4853,-0.21079 -0.21079,-12.43627 4.21568,-5.05882 7.58824,-0.42157 3.79412,-5.48039 v -38.36275 h -9.27451 l -2.95098,-4.21568 -32.03922,8.43137 -16.86274,11.38235 -7.58824,0.21079 z",
      id: "17",
      class: "unselected"
    },
    {
      d: "m 334.93627,222.79901 -0.31618,97.27696 7.79902,-0.63235 16.86274,-11.17157 32.14461,-8.43137 2.7402,4.21569 h 9.2745 l -0.63235,-27.71814 14.12255,-23.18627 0.21079,-30.03677 z",
      id: "18",
      class: "unselected"
    },
    {
      d: "m 267.05609,222.67314 -0.43966,89.24171 5.72991,8.34353 62.50366,-0.17462 0.0331,-97.41063 z",
      id: "19",
      class: "unselected"
    }
  ];

  const labelsData = [
    { x: 91.25, y: 145, text: "1. PALACE HILLS" }, //Placeholder, does not take effect
    { x: 91.25, y: 145, text: "1. PALACE HILLS" },
    { x: 179, y: 122, text: "2. NORTHWEST" },
    { x: 304.5, y: 98.5, text: "3. OLD TOWN" },
    { x: 418.25, y: 165.25, text: "4. SAFE TOWN" },
    { x: 176.5, y: 269, text: "5. SOUTHWEST" },
    { x: 186, y: 197.75, text: "6. DOWNTOWN" },
    { x: 606.75, y: 322.25, text: "7. WILSON FOREST" },
    { x: 527.75, y: 439.25, text: "8. SCENIC VISTA" },
    { x: 357.75, y: 412, text: "9. BROADVIEW" },
    { x: 467.25, y: 399.75, text: "10. CHAPPARAL" },
    { x: 542.25, y: 367.75, text: "11. TERRAPIN SPRINGS" },
    { x: 539, y: 303.5, text: "12. PEPPER MILL" },
    { x: 445.25, y: 280, text: "13. CHEDDARFORD" },
    { x: 299.25, y: 187.25, text: "14. EASTON" },
    { x: 238.5, y: 181.75, text: "15. WESTON" },
    { x: 239.75, y: 242.25, text: "16. SOUTHTON" },
    { x: 350.25, y: 335, text: "17. OAK WILLOW" },
    { x: 372, y: 260.75, text: "18. EAST PARTON" },
    { x: 297.75, y: 277.25, text: "19. WEST PARTON" }
  ];

  const romanNumerals = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X"
  ];

  const perceivedLevel = [
    "Not felt",
    "Weak",
    "Weak",
    "Light",
    "Moderate",
    "Strong",
    "Very strong",
    "Severe",
    "Violent",
    "Extreme"
  ];

  // Tooltip definition
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("padding", "10px 15px")
    .style("background", "#f9f9f9")
    .style("border", "1px solid #ddd")
    .style("box-shadow", "0 2px 4px rgba(0,0,0,0.1)")
    .style("border-radius", "4px")
    .style("pointer-events", "none")
    .style(
      "font-family",
      "'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif"
    )
    .style("font-size", "12px")
    .style("color", "#333")
    .style("transition", "opacity 0.3s");

  svg
    .selectAll("path")
    .data(pathsData)
    .enter()
    .append("path")
    .attr("d", (d) => d.d)
    .attr("id", (d) => d.id)
    .attr("class", (d) => d.class)
    .attr("style", (d) => d.style)
    .attr("fill", (d) => {
      const intensity = averageIntensity.get(d.id);
      const colorScale = d3
        .scaleSequential(d3.interpolateInferno)
        .domain(d3.extent(Array.from(averageIntensity.values())));
      return intensity ? colorScale(intensity) : "#FFFFFF";
    })
    .attr("stroke", "black")
    .attr("stroke-width", "1")
    .on("mouseover", function (event, d) {
      const bbox = this.getBBox();
      const offsetX = (bbox.width / 2) * 0.01; 
      const offsetY = (bbox.height / 2) * 0.01; 
      const scale = 1.02; // slightly zoomed in to 1.02x

      d3.select(this)
        .transition()
        .duration(200)
        .attr("transform", `translate(${offsetX}, ${offsetY}) scale(${scale})`); 

      const intensity = averageIntensity.get(d.id) || 0;
      // const intensityRoman = roma
      let roundedIntensity = Math.round(intensity); // round the intensity value to the nearest whole number

      if (roundedIntensity === 0) {
        roundedIntensity = 1;
      }

      const intensityRoman = perceivedLevel[roundedIntensity - 1]; // convert rounded intensity to Roman

      tooltip
        .html(
          `Neighborhood ID: ${d.id}
          <br>Average Intensity: ${intensity.toFixed(4)} 
          <br>perceived shaking: ${intensityRoman}`
        )
        .style("opacity", 1)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY + 10}px`)
        .transition()
        .duration(200)
        .style("opacity", 1);
    })
    .on("mouseout", function () {
      d3.select(this).transition().duration(500).attr("transform", "");
      tooltip.transition().duration(500).style("opacity", 0);
    });

  // text labels
  svg
    .selectAll("text")
    .data(labelsData)
    .enter()
    .append("text")
    .attr("x", (d) => d.x)
    .attr("y", (d) => d.y)
    .style("text-anchor", "middle")
    .style("font-size", "8pt")
    .text((d) => d.text)
    .style("pointer-events", "none");

  // color scale, according to shakemap color
  var colorScale = d3
    .scaleOrdinal()
    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .range([
      "#FFFFFF", 
      "#E8EEFF", 
      "#CAD3F5", 
      "#9FE5FC", 
      "#83FAE6", 
      "#8CF487", 
      "#FCF909", 
      "#F4BE0A", 
      "#F37E07", 
      "#FE000A", 
      "#CB0004" 
    ]); 

  // update map color
  svg.selectAll("path").style("fill", (d) => {
    let intensity = averageIntensity.get(d.id) || 0;

    if (intensity > 0 && intensity < 1) {
      intensity = 1;
    }

    let roundedIntensity = Math.round(intensity); // round the intensity value to the nearest whole number

    const color = colorScale(roundedIntensity); 

    return color ? color : "#FFFFFF"; // use "white" color if don't have data
  });

  // legend
  const legendWidth = 20; 
  const legendHeight = 300; 
  const legendPosition = { x: width - margin.right + 140, y: margin.top };

  // legend title
  svg
    .append("text")
    .attr("x", legendPosition.x + legendWidth / 2) 
    .attr("y", legendPosition.y + 60) 
    .attr("text-anchor", "middle") 
    .style("font-size", "13px") 
    .style("font-family", "Arial, sans-serif") 
    .text("Intensity level & perceived"); 

  // add legend
  const domain = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const legendItemHeight = legendHeight / 10; 

  domain.forEach((value, index) => {
    svg
      .append("rect")
      .attr("x", legendPosition.x)
      .attr("y", legendPosition.y + 80 + index * legendItemHeight)
      .attr("width", legendWidth)
      .attr("height", legendItemHeight)
      .attr("fill", colorScale(value)); 

    // legend text
    svg
      .append("text")
      .attr("x", legendPosition.x + legendWidth + 5) 
      .attr(
        "y",
        legendPosition.y + 80 + index * legendItemHeight + legendItemHeight / 2
      ) 
      .attr("dy", "0.35em") 
      .style("font-size", "10px") 
      .style("font-family", "Arial, sans-serif") 
      .text(romanNumerals[index] + " : " + perceivedLevel[index]); 
  });

  // return svg.node();
}
)}

function _38(filterDataByDate,map_data,d3,drawMap)
{
  const dateRanges = [
    ["2020-04-06T00:00:00", "2020-04-07T00:00:00"],
    ["2020-04-07T00:00:00", "2020-04-08T00:00:00"],
    ["2020-04-08T00:00:00", "2020-04-09T00:00:00"],
    ["2020-04-09T00:00:00", "2020-04-10T00:00:00"],
    ["2020-04-10T00:00:00", "2020-04-11T00:01:00"]
  ];

  dateRanges.forEach((range, index) => {
    const filteredData = filterDataByDate(map_data, range[0], range[1]);

    // caculate averageIntensity of different period
    const validData = filteredData.filter(
      (d) =>
        !isNaN(parseFloat(d.shake_intensity)) && isFinite(d.shake_intensity)
    );
    const averageIntensity = d3.rollup(
      validData,
      (v) => d3.mean(v, (d) => +d.shake_intensity),
      (d) => d.location
    );

    // title text
    const title = `April ${6 + index} Shake Intensity Visualization`;

    // add map
    drawMap(
      filteredData,
      `#map-container-${index + 1}`,
      averageIntensity,
      title
    );
  });
}


function _39(md){return(
md`## IDEA 4: Error Shading Chart shows the 95% confidence interval and records number for each matrics. `
)}

function _40(md){return(
md`## confidence interval and records number use the left and right y-axes respectively.`
)}

function _41(md){return(
md`> **Interactivity:** * Select the neighbourhood to be viewed via the drop-down box. Select the data count interval via the slider. Hover over any part of the graph representing the data to view the calculated data associated with the confidence interval and the number of records.
> The Tooltip is anti-obscuration and dynamically wraps around the mouse to prevent it from exceeding the visualisation. *`
)}

function _jStat(require){return(
require('jstat@1.9.4/dist/jstat.min.js')
)}

function _errorBand_data(FileAttachment){return(
FileAttachment("mc1-reports-data.csv").csv()
)}

function _parseDate(d3){return(
d3.utcParse("%Y-%m-%d %H:%M:%S")
)}

function _fieldsToSummarize(){return(
[
  "sewer_and_water",
  "power",
  "roads_and_bridges",
  "medical",
  "buildings"
]
)}

function _46(md){return(
md`#### Please select the following options:`
)}

function _selectedLocation(Inputs){return(
Inputs.select(
  [
    "1. PALACE HILLS",
    "2. NORTHWEST",
    "3. OLD TOWN",
    "4. SAFE TOWN",
    "5. SOUTHWEST",
    "6. DOWNTOWN",
    "7. WILSON FOREST",
    "8. SCENIC VISTA",
    "9. BROADVIEW",
    "10. CHAPPARAL",
    "11. TERRAPIN SPRINGS",
    "12. PEPPER MILL",
    "13. CHEDDARFORD",
    "14. EASTON",
    "15. WESTON",
    "16. SOUTHTON",
    "17. OAK WILLOW",
    "18. EAST PARTON",
    "19. WEST PARTON"
  ],
  { label: "Select Location" }
)
)}

function _selectedLocationNumber(selectedLocation){return(
selectedLocation.split(".")[0].trim()
)}

function _49(md){return(
md`#### Please select the following options:`
)}

function _IntervalTimeSlider(Inputs){return(
Inputs.range(
  [1000 * 60 * 60, 1000 * 60 * 60 * 12], // from 1 to 12 hours
  {
    value: 1000 * 60 * 60 * 5, // 5 hours
    step: 1000 * 60 * 10 * 3, // 0.5 hour
    label: "Statistics Interval (unit: hours)",
    format: (value) => `${value / (1000 * 60 * 60)}`
  }
)
)}

function _summarizeDataWithCI(d3,jStat){return(
function summarizeDataWithCI(data, fields, currentInterval) {
  data.sort((a, b) => a.time - b.time);

  const filteredData = data.filter((d) =>
    fields.every((field) => d[field] != null)
  );
  const summaries = fields.map((field) => {
    const summary = d3
      .rollups(
        filteredData,
        (v) => {
          const mean = d3.mean(v, (d) => d[field]); 
          const deviation = d3.deviation(v, (d) => d[field]);
          const n = v.length;
          const sem = deviation / Math.sqrt(n); 
          let margin;
          if (n < 30) {
            // For sample sizes less than 30, use the t-score
            const tScore = jStat.studentt.inv(0.975, n - 1); // t-score with 95% confidence interval
            margin = tScore * sem;
          } else {
            // For sample sizes more than 30, use the z-score
            const z = 1.96; // z-score with 95% confidence interval
            margin = z * sem;
          }
          const count = v.length; // records number

          return { mean, lower: mean - margin, upper: mean + margin, count };
        },
        (d) => Math.floor(d.time.getTime() / currentInterval) * currentInterval
      )
      .map(([time, stats]) => ({
        time: new Date(time),
        field,
        mean: stats.mean,
        lower: stats.lower,
        upper: stats.upper,
        count: stats.count 
      }));

    return summary;
  });

  return summaries.flatMap((d) => d);
}
)}

function _updateChart(d3,summarizeDataWithCI,fieldsToSummarize){return(
function updateChart(data, selectedLocationName, currentInterval) {
  const width = 900;
  // const height = 600;
  const basePanelHeight = 150; 
  const extraBottomMargin = 80; 
  const margin = { top: 30, right: 40, bottom: 20, left: 60 };
  const lastPanelMargin = {
    ...margin,
    bottom: margin.bottom + extraBottomMargin
  }; 

  // width and height of each panel
  const panelWidth = width - margin.left - margin.right;
  const panelHeight = 100; 

  // use a container save all panels
  const container = d3
    .create("div")
    .style("display", "flex")
    .style("flex-direction", "column")
    .style("align-items", "center");

  // title
  const title = container
    .append("h2")
    .text(
      `The Damage Value Confidence Range and the Reports Number In ${selectedLocationName}`
    )
    .style("margin-top", "20px")
    .style("text-align", "center");

  const summarizedData = summarizeDataWithCI(
    data,
    fieldsToSummarize,
    currentInterval
  );

  // make sure the start and end times are based on the actual range of summarizedData
  const timeExtent = d3.extent(summarizedData, (d) => d.time);

  // x axis scale
  const x = d3
    .scaleUtc()
    .domain(timeExtent)
    .range([margin.left, width - margin.right]);

  // tooltip
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("padding", "8px 12px") 
    .style("font-family", "Arial, sans-serif") 
    .style("font-size", "14px") 
    .style("color", "#333") 
    .style("background", "rgba(255, 255, 255, 0.9)") 
    .style("border", "1px solid #ddd") 
    .style("border-radius", "5px") 
    .style(
      "box-shadow",
      "0 3px 6px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.1)"
    ) 
    .style("pointer-events", "none") 
    .style("transition", "opacity 0.2s, top 0.2s"); 

  // // ccustom color
  // const colorScale = d3
  //   .scaleOrdinal()
  //   .domain([
  //     "sewer_and_water",
  //     "power",
  //     "roads_and_bridges",
  //     "medical",
  //     "buildings"
  //   ])
  //   .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"]);

  // color
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  // loop each field + calculate + plot error bands and line charts
  fieldsToSummarize.forEach((field, i) => {
    // make sure if this is the last panel
    const isLastPanel = i === fieldsToSummarize.length - 1;
    const panelHeight = isLastPanel
      ? basePanelHeight + extraBottomMargin
      : basePanelHeight;
    const panelMargin = isLastPanel ? lastPanelMargin : margin;

    const fieldData = summarizedData.filter((d) => d.field === field);

    // for each field
    const svgPanel = container
      .append("svg")
      .attr("width", width)
      .attr("height", panelHeight)
      .style("border", "1px solid #ccc")
      .style("margin-top", "5px");

    const y = d3
      .scaleLinear()
      .domain([0, 10])
      .nice()
      .range([panelHeight - panelMargin.bottom, panelMargin.top]);

    // use max records number to set y axis
    const maxRecords = d3.max(fieldData, (d) => d.count);

    const yRecords = d3
      .scaleLinear()
      .domain([0, maxRecords])
      .range([panelHeight - panelMargin.bottom, panelMargin.top])
      .nice();

    container.append(() => svgPanel.node());

    // confidence interval
    const areaGenerator = d3
      .area()
      .x((d) => x(d.time))
      .y0((d) => y(d.lower))
      .y1((d) => y(d.upper))
      .curve(d3.curveLinear); //linear interpolation

    svgPanel
      .append("path")
      .datum(fieldData)
      .attr("fill", colorScale(field))
      .attr("d", areaGenerator)
      .style("opacity", 0.4)
      .style("pointer-events", "all")
      .on("mousemove", (event) => {
        const [xPos] = d3.pointer(event);
        const x0 = x.invert(xPos); // find the corresponding time by inverting the x position
        const bisectDate = d3.bisector((d) => d.time).left;
        const idx = bisectDate(fieldData, x0, 1);
        const d0 = fieldData[idx - 1];
        const d1 = fieldData[idx];
        const d = x0 - d0.time > d1.time - x0 ? d1 : d0; // find the closest data point

        const tooltipWidth = tooltip.node().getBoundingClientRect().width;
        const tooltipHeight = tooltip.node().getBoundingClientRect().height;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const mouseX = event.pageX;
        const mouseY = event.pageY;

        // default tooltip position
        let left = mouseX + 20; 
        let top = mouseY + 20; 

        // customize the position of some tooltips to avoid occlusion
        if (mouseX + tooltipWidth + 40 > windowWidth) {
          left = mouseX - tooltipWidth - 40;
        }

        if (mouseY + tooltipHeight + 60 > windowHeight) {
          top = mouseY - tooltipHeight - 40;
        }

        tooltip
          .style("opacity", 0.9)
          .html(
            `Time: ${d.time.toISOString()}<br>` +
              `Upper: ${d.upper.toFixed(2)}<br>` +
              `Mean: ${d.mean.toFixed(2)}<br>` +
              `Lower: ${d.lower.toFixed(2)}<br>` +
              `Reports number: ${d.count}`
          )
          // dynamically adjust the position of tooltip
          .style("left", `${left}px`)
          .style("top", `${top}px`);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0); 
      });

    // mean line
    const lineGenerator = d3
      .line()
      .x((d) => x(d.time))
      .y((d) => y(d.mean))
      .curve(d3.curveLinear); //linear interpolation

    svgPanel
      .append("path")
      .datum(fieldData)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("d", lineGenerator)
      .style("pointer-events", "all")
      .on("mousemove", (event) => {
        const [xPos] = d3.pointer(event);
        const x0 = x.invert(xPos); 
        const bisectDate = d3.bisector((d) => d.time).left;
        const idx = bisectDate(fieldData, x0, 1);
        const d0 = fieldData[idx - 1];
        const d1 = fieldData[idx];
        const d = x0 - d0.time > d1.time - x0 ? d1 : d0; 

        const tooltipWidth = tooltip.node().getBoundingClientRect().width;
        const tooltipHeight = tooltip.node().getBoundingClientRect().height;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const mouseX = event.pageX;
        const mouseY = event.pageY;

        let left = mouseX + 20; 
        let top = mouseY + 20; 

        if (mouseX + tooltipWidth + 40 > windowWidth) {
          left = mouseX - tooltipWidth - 40;
        }

        if (mouseY + tooltipHeight + 60 > windowHeight) {
          top = mouseY - tooltipHeight - 40;
        }

        tooltip
          .style("opacity", 0.9)
          .html(
            `Time: ${d.time.toISOString()}<br>` +
              `Upper: ${d.upper.toFixed(2)}<br>` +
              `Mean: ${d.mean.toFixed(2)}<br>` +
              `Lower: ${d.lower.toFixed(2)}<br>` +
              `Reports number: ${d.count}`
          )
          .style("left", `${left}px`)
          .style("top", `${top}px`);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0); 
      });

    // records number line
    const recordsLineGenerator = d3
      .line()
      .x((d) => x(d.time))
      .y((d) => yRecords(d.count)) // use right y-axis scale to map the number of records
      .curve(d3.curveLinear);

    svgPanel
      .append("path")
      .datum(fieldData)
      .attr("fill", "none")
      .attr("stroke", "grey") 
      .attr("stroke-dasharray", "5,5") // use dashed lines to represent record numbers
      .attr("d", recordsLineGenerator);

    // add a wider transparent path at the same location to facilitate mouse capture of the tooltip
    svgPanel
      .append("path")
      .datum(fieldData)
      .attr("d", recordsLineGenerator)
      .attr("fill", "none")
      .attr("stroke", "transparent") // set as can't see
      .attr("stroke-width", 10) // set wider to help use tooltip
      .style("pointer-events", "all")
      .on("mousemove", (event) => {
        const [xPos] = d3.pointer(event);
        const x0 = x.invert(xPos); 
        const bisectDate = d3.bisector((d) => d.time).left;
        const idx = bisectDate(fieldData, x0, 1);
        const d0 = fieldData[idx - 1];
        const d1 = fieldData[idx];
        const d = x0 - d0.time > d1.time - x0 ? d1 : d0; 

        const tooltipWidth = tooltip.node().getBoundingClientRect().width;
        const tooltipHeight = tooltip.node().getBoundingClientRect().height;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const mouseX = event.pageX;
        const mouseY = event.pageY;

        let left = mouseX + 20; 
        let top = mouseY + 20;

        if (mouseX + tooltipWidth + 40 > windowWidth) {
          left = mouseX - tooltipWidth - 40;
        }

        if (mouseY + tooltipHeight + 60 > windowHeight) {
          top = mouseY - tooltipHeight - 40;
        }

        tooltip
          .style("opacity", 0.9)
          .html(
            `Time: ${d.time.toISOString()}<br>` +
              `Upper: ${d.upper.toFixed(2)}<br>` +
              `Mean: ${d.mean.toFixed(2)}<br>` +
              `Lower: ${d.lower.toFixed(2)}<br>` +
              `Reports number: ${d.count}`
          )
          .style("left", `${left}px`)
          .style("top", `${top}px`);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0); 
      });

    // For upper confidence interval points
    svgPanel
      .selectAll(".upperPoint")
      .data(fieldData)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.time))
      .attr("cy", (d) => y(d.upper))
      .attr("r", 1.5) // radius
      .style("fill", "grey");

    // For lower confidence interval points
    svgPanel
      .selectAll(".lowerPoint")
      .data(fieldData)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.time))
      .attr("cy", (d) => y(d.lower))
      .attr("r", 1.5) // radius
      .style("fill", "grey");

    fieldData.forEach((d) => {
      svgPanel
        .append("line")
        .attr("x1", x(d.time))
        .attr("y1", y(d.lower))
        .attr("x2", x(d.time))
        .attr("y2", y(d.upper))
        .attr("stroke", "grey")
        .attr("stroke-dasharray", "2,5")
        .attr("stroke-width", 1);
    });

    // left y axis
    svgPanel
      .append("g")
      .attr("transform", `translate(${panelMargin.left},0)`)
      .call(
        d3
          .axisLeft(y)
          .ticks(5) 
          .tickSize(-panelWidth) 
          .tickPadding(10) 
      )
      .call((g) => g.select(".domain").remove()) 
      .call((g) =>
        g
          .selectAll(".tick line") 
          .attr("stroke-opacity", 0.2) 
          .attr("stroke-dasharray", "2,2")
      ) 
      .call((g) =>
        g
          .selectAll(".tick text") 
          .style("font-size", "12px") 
          .style("font-family", "Arial, sans-serif")
      );

    // title
    svgPanel
      .append("text")
      .attr("x", margin.left)
      .attr("y", margin.top - 10) 
      .text(field + " damage value")
      .attr("text-anchor", "start") 
      .style("font-size", "13px"); 

    // right y axis
    const yAxisRecords = d3.axisRight(yRecords).ticks(5); 

    svgPanel
      .append("g")
      .attr("transform", `translate(${width - panelMargin.right},0)`)
      .call(yAxisRecords);

    // title
    svgPanel
      .append("text")
      .attr(
        "transform",
        `translate(${width - margin.right + 10}, ${margin.top - 10})` 
      )
      .attr("text-anchor", "end") 
      .style("font-size", "13px") 
      .text("reports number");

    // x ais, only for the last panel
    if (isLastPanel) {
      svgPanel
        .append("g")
        .attr(
          "transform",
          `translate(0,${panelHeight - lastPanelMargin.bottom})`
        )
        .call(
          d3
            .axisBottom(x)
            .ticks(width / 80)
            .tickSizeOuter(0)
            .ticks(d3.utcHour.every(12))
            .tickFormat(d3.utcFormat("%Y/%m/%d %H:%M"))
        )
        .selectAll("text")
        .style("text-anchor", "start")
        .attr("dx", ".8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(30)");
    }
  });

  return container.node();
}
)}

function _chart4(IntervalTimeSlider,selectedLocation,errorBand_data,parseDate,updateChart)
{
  const currentInterval = IntervalTimeSlider;
  const selectedLocationNumber = selectedLocation.split(".")[0].trim();
  const data = errorBand_data
    .filter((d) => +d.location === +selectedLocationNumber) 
    .map((d) => ({
      time: parseDate(d.time),
      sewer_and_water: +d.sewer_and_water,
      power: +d.power,
      roads_and_bridges: +d.roads_and_bridges,
      medical: +d.medical,
      buildings: +d.buildings,
      shake_intensity: +d.shake_intensity,
      location: d.location
    }));

  data.sort((a, b) => a.time - b.time);

  let selectedLocationName = selectedLocation.split(".")[1].trim();

  return updateChart(data, selectedLocationName, currentInterval);
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["mc1-reports-data.csv", {url: new URL("./files/4c32995ea9864939036ff1bd99397b1947906e7efa09f756c8b8a6c5e826d9f9217eab3bff379d2c9705b47acc0c1a07c52f3e4638037a2e6efd4c6d96629450.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("Boxplot_data")).define("Boxplot_data", ["FileAttachment"], _Boxplot_data);
  main.variable(observer("processedData")).define("processedData", ["d3","Boxplot_data"], _processedData);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("viewof selectedMetric")).define("viewof selectedMetric", ["Inputs"], _selectedMetric);
  main.variable(observer("selectedMetric")).define("selectedMetric", ["Generators", "viewof selectedMetric"], (G, _) => G.input(_));
  main.variable(observer("stats")).define("stats", ["processedData","selectedMetric","d3"], _stats);
  main.variable(observer("chart")).define("chart", ["d3","Boxplot_data","selectedMetric","stats"], _chart);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer()).define(["md"], _13);
  main.variable(observer("paraCoor_data")).define("paraCoor_data", ["FileAttachment"], _paraCoor_data);
  main.variable(observer("locationOptions")).define("locationOptions", ["paraCoor_data"], _locationOptions);
  main.variable(observer("defaultSelectedLocation")).define("defaultSelectedLocation", ["locationOptions"], _defaultSelectedLocation);
  main.variable(observer("locationLabels")).define("locationLabels", _locationLabels);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer("viewof selectedLocations")).define("viewof selectedLocations", ["Inputs","locationOptions","defaultSelectedLocation"], _selectedLocations);
  main.variable(observer("selectedLocations")).define("selectedLocations", ["Generators", "viewof selectedLocations"], (G, _) => G.input(_));
  const child1 = runtime.module(define1);
  main.import("rangeSlider", child1);
  main.variable(observer("startTime")).define("startTime", _startTime);
  main.variable(observer("endTime")).define("endTime", _endTime);
  main.variable(observer()).define(["md"], _25);
  main.variable(observer("viewof timeSlider")).define("viewof timeSlider", ["rangeSlider","startTime","endTime"], _timeSlider);
  main.variable(observer("timeSlider")).define("timeSlider", ["Generators", "viewof timeSlider"], (G, _) => G.input(_));
  main.variable(observer("filteredData")).define("filteredData", ["paraCoor_data","timeSlider","selectedLocations"], _filteredData);
  main.variable(observer("chart2")).define("chart2", ["filteredData","locationOptions","d3","selectedLocations"], _chart2);
  main.variable(observer()).define(["md"], _29);
  main.variable(observer()).define(["md"], _30);
  main.variable(observer()).define(["md"], _31);
  main.variable(observer("map_data")).define("map_data", ["FileAttachment"], _map_data);
  main.variable(observer("filterDataByDate")).define("filterDataByDate", _filterDataByDate);
  main.variable(observer("calculateAverageIntensity")).define("calculateAverageIntensity", _calculateAverageIntensity);
  main.variable(observer()).define(["md"], _35);
  main.variable(observer()).define(["htl"], _36);
  main.variable(observer("drawMap")).define("drawMap", ["d3"], _drawMap);
  main.variable(observer()).define(["filterDataByDate","map_data","d3","drawMap"], _38);
  main.variable(observer()).define(["md"], _39);
  main.variable(observer()).define(["md"], _40);
  main.variable(observer()).define(["md"], _41);
  main.variable(observer("jStat")).define("jStat", ["require"], _jStat);
  main.variable(observer("errorBand_data")).define("errorBand_data", ["FileAttachment"], _errorBand_data);
  main.variable(observer("parseDate")).define("parseDate", ["d3"], _parseDate);
  main.variable(observer("fieldsToSummarize")).define("fieldsToSummarize", _fieldsToSummarize);
  main.variable(observer()).define(["md"], _46);
  main.variable(observer("viewof selectedLocation")).define("viewof selectedLocation", ["Inputs"], _selectedLocation);
  main.variable(observer("selectedLocation")).define("selectedLocation", ["Generators", "viewof selectedLocation"], (G, _) => G.input(_));
  main.variable(observer("selectedLocationNumber")).define("selectedLocationNumber", ["selectedLocation"], _selectedLocationNumber);
  main.variable(observer()).define(["md"], _49);
  main.variable(observer("viewof IntervalTimeSlider")).define("viewof IntervalTimeSlider", ["Inputs"], _IntervalTimeSlider);
  main.variable(observer("IntervalTimeSlider")).define("IntervalTimeSlider", ["Generators", "viewof IntervalTimeSlider"], (G, _) => G.input(_));
  main.variable(observer("summarizeDataWithCI")).define("summarizeDataWithCI", ["d3","jStat"], _summarizeDataWithCI);
  main.variable(observer("updateChart")).define("updateChart", ["d3","summarizeDataWithCI","fieldsToSummarize"], _updateChart);
  main.variable(observer("chart4")).define("chart4", ["IntervalTimeSlider","selectedLocation","errorBand_data","parseDate","updateChart"], _chart4);
  return main;
}
