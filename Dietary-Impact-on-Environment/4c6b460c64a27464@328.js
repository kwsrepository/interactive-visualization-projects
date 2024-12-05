function _1(md){return(
md`# Kewen Yu - Research methods cw2 `
)}

function _d3(require){return(
require("d3@6")
)}

function _Data(FileAttachment){return(
FileAttachment("Results_21Mar2022.csv").csv()
)}

async function _globalExtents(Data,d3)
{
  const data = await Data;
  return {
    mean_ghgs: d3.extent(data, (d) => +d.mean_ghgs),
    mean_land: d3.extent(data, (d) => +d.mean_land),
    mean_watscar: d3.extent(data, (d) => +d.mean_watscar),
    mean_eut: d3.extent(data, (d) => +d.mean_eut),
    mean_ghgs_ch4: d3.extent(data, (d) => +d.mean_ghgs_ch4),
    mean_ghgs_n2o: d3.extent(data, (d) => +d.mean_ghgs_n2o),
    mean_bio: d3.extent(data, (d) => +d.mean_bio),
    mean_watuse: d3.extent(data, (d) => +d.mean_watuse),
    mean_acid: d3.extent(data, (d) => +d.mean_acid)
  };
}


function _selectedDiets(Inputs){return(
Inputs.checkbox(
  ["meat100", "meat50", "meat", "fish", "vegan", "veggie"],
  {
    label: "Select diet groups to display",
    value: ["meat100", "meat50", "meat", "fish", "vegan", "veggie"]
  }
)
)}

function _selectedSex(Inputs){return(
Inputs.checkbox(["female", "male"], {
  label: "Select sex to display",
  value: ["female", "male"]
})
)}

function _selectedAges(Inputs){return(
Inputs.checkbox(
  ["20-29", "30-39", "40-49", "50-59", "60-69", "70-79"],
  {
    label: "Select age groups to highlight",
    value: ["20-29", "30-39", "40-49", "50-59", "60-69", "70-79"]
  }
)
)}

async function _chart(d3,Data,selectedDiets,selectedSex,globalExtents,selectedAges)
{
  const margin = { top: 30, right: 50, bottom: 20, left: 50 },
    width = 1100 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom;

  const svg = d3
    .create("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + 30)
    .style("border", "none");

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const data = (await Data).filter(
    (d) => selectedDiets.includes(d.diet_group) && selectedSex.includes(d.sex)
  );

  // Color scale
  const color = d3
    .scaleOrdinal()
    .domain(["meat100", "meat50", "meat", "fish", "vegan", "veggie"])
    .range(["#8B4513", "#FFA500", "#c94c4c", "#89CFF0", "#8BC34A", "#388E3C"]);

  const dimensions = [
    "mean_ghgs",
    "mean_land",
    "mean_watscar",
    "mean_eut",
    "mean_ghgs_ch4",
    "mean_ghgs_n2o",
    "mean_bio",
    "mean_watuse",
    "mean_acid"
  ];

  let y = {};
  dimensions.forEach((dimension) => {
    y[dimension] = d3
      .scaleLinear()
      .domain(globalExtents[dimension].slice())
      .range([height, margin.top + 25]);
  });

  let x = d3
    .scalePoint()
    .padding(1)
    .range([margin.left, width - margin.right])
    .domain(dimensions);

  const drag = d3
    .drag()
    .on("start", function (event, d) {
      this.classList.add("active");
    })
    .on("drag", function (event, d) {
      x.domain(
        dimensions.sort((a, b) => {
          return event.x - x(b);
        })
      );
      svg
        .selectAll(".dimension")
        .attr("transform", (d) => `translate(${x(d)}, 0)`);
      svg.selectAll(".line").attr("d", drawPath);
    })
    .on("end", function (event, d) {
      this.classList.remove("active");
    });

  function dragstarted(event, d) {
    d3.select(this).raise().classed("active", true);
  }

  function dragged(event, d) {
    x.range([0, width - margin.right]).domain(
      dimensions.sort((a, b) => {
        return event.x - x(b);
      })
    );

    svg
      .selectAll("text.dimension")
      .attr("transform", (d) => `translate(${x(d)}, -10)`);

    svg.selectAll(".line").attr("d", drawPath);
  }

  function dragended(event, d) {
    d3.select(this).classed("active", false);
    svg.selectAll(".dimension").order();
    svg.selectAll(".line").attr("d", drawPath);
  }

  function drawPath(d) {
    return d3.line()(dimensions.map((p) => [x(p), y[p](d[p])]));
  }

  const line = d3
    .line()
    .x((d) => x(d.dimension))
    .y((d) => y[d.dimension](d.value));

  // Draw the X-axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickSize(0).tickPadding(10))
    .selectAll("text")
    .attr("y", 20)
    .attr("x", 10)
    .style("font-size", "12px")
    // .style("font-weight", "bold")
    .attr("transform", "rotate(30)")
    .attr("text-anchor", "start");

  // remove x line
  svg.select(".domain").remove();

  // Path generator function
  function path(d) {
    return d3.line()(dimensions.map((p) => [x(p), y[p](d.mean_ghgs)]));
  }

  // Draw the lines
  const lines = svg
    .selectAll(".line")
    .data(data)
    .enter()
    .append("path")
    .attr("class", "line")
    .attr("d", drawPath)
    .attr("fill", "none")
    .attr("stroke", (d) =>
      selectedAges.includes(d.age_group) ? color(d.diet_group) : "lightgrey"
    )
    .attr("stroke-width", 0.5)
    .attr("opacity", (d) => (selectedAges.includes(d.age_group) ? 0.4 : 0.1));

  dimensions.forEach((dimension) => {
    const axis = svg
      .append("g")
      .attr("transform", `translate(${x(dimension)}, 0)`)
      .call(d3.axisLeft(y[dimension]));

    const dimensionG = svg
      .selectAll(".dimension")
      .data(dimensions)
      .enter()
      .append("g")
      .attr("class", "dimension")
      .attr("transform", (d) => `translate(${x(d)}, 0)`)
      .call(drag);

    dimensionG
      .append("g")
      .each(function (d) {
        d3.select(this).call(d3.axisLeft(y[d]));
      })
      .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text((d) => d);

    dimensionG.selectAll("text").style("cursor", "move");

    // min value text
    axis
      .append("text")
      .attr("x", 0)
      .attr("y", y[dimension](y[dimension].domain()[0]) + 4)
      .attr("dy", "0.71em")
      .attr("fill", "black")
      .attr("font-size", "10px")
      .style("text-anchor", "middle")
      .text(y[dimension].domain()[0].toFixed(4));

    // max value text
    axis
      .append("text")
      .attr("x", 0)
      .attr("y", y[dimension](y[dimension].domain()[1]) - 4)
      .attr("dy", "-0.32em")
      .attr("fill", "black")
      .attr("font-size", "10px")
      .style("text-anchor", "middle")
      .text(y[dimension].domain()[1].toFixed(4));
  });

  // Draw the axes
  svg
    .selectAll(".axis")
    .data(dimensions)
    .enter()
    .append("g")
    .attr("class", "axis")
    .attr("transform", (d) => `translate(${x(d)},0)`)
    .each(function (d) {
      d3.select(this).call(d3.axisLeft(y[d]));
    })
    .append("text")
    .style("text-anchor", "middle")
    .attr("y", height + margin.bottom)
    .text((d) => d);

  // legend
  const legend = svg
    .append("g")
    .attr(
      "transform",
      `translate(${width - margin.left + 20}, ${height / 2 - 100})`
    );

  color.domain().forEach((diet, index) => {
    const spacing = 30;

    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", index * spacing)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color(diet));

    legend
      .append("text")
      .attr("x", 24)
      .attr("y", index * spacing + 9)
      .attr("dy", "0.35em")
      .text(diet);
  });

  // title
  svg
    .append("text")
    .attr("class", "title")
    .attr("x", (margin.left + width - margin.right) / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .text("Environmental Impacts of Different Diet");

  return svg.node();
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["Results_21Mar2022.csv", {url: new URL("./files/0889bb673b31b523d26028ed55d06adb7368f3036914611fe1c74a7c86f933122b51cbb035e9e2367f7909c82f730608b42b1db5bb2aee89e0ffe576b3cdbd42.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("Data")).define("Data", ["FileAttachment"], _Data);
  main.variable(observer("globalExtents")).define("globalExtents", ["Data","d3"], _globalExtents);
  main.variable(observer("viewof selectedDiets")).define("viewof selectedDiets", ["Inputs"], _selectedDiets);
  main.variable(observer("selectedDiets")).define("selectedDiets", ["Generators", "viewof selectedDiets"], (G, _) => G.input(_));
  main.variable(observer("viewof selectedSex")).define("viewof selectedSex", ["Inputs"], _selectedSex);
  main.variable(observer("selectedSex")).define("selectedSex", ["Generators", "viewof selectedSex"], (G, _) => G.input(_));
  main.variable(observer("viewof selectedAges")).define("viewof selectedAges", ["Inputs"], _selectedAges);
  main.variable(observer("selectedAges")).define("selectedAges", ["Generators", "viewof selectedAges"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["d3","Data","selectedDiets","selectedSex","globalExtents","selectedAges"], _chart);
  return main;
}
