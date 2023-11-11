const ctx = {
    SVG_W: 1200,
    SVG_H: 1200,
    barChartWidth: 100,
    barChartHeight: 50,
    barSpacing: 10,
};

function CreateBarCharts(svgEl) {
  const barChartsGroup = svgEl.append("g")
      .attr("id", "barChartsGroup")
      .attr("transform", `translate(200, 500)`);

  // Генерируйте случайные данные для 10 барчартов
  const barChartData = [];
  for (let i = 0; i < 10; i++) {
      const data = [];
      for (let j = 0; j < 5; j++) {
          data.push(Math.random() * 100); // Замените это на ваши данные
      }
      barChartData.push(data);
  }

  // Создайте барчарты
  barChartsGroup
    .selectAll("g")
    .data(barChartData)
    .enter()
    .append("g")
    .attr("transform", (d, i) => `translate(200, ${40 * i + 10})`)
    .selectAll("rect")
    .data(d => d)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * ctx.barChartWidth)
    .attr("y", (d) => ctx.barChartHeight - d)
    .attr("width", ctx.barChartWidth / d.length - 2)
    .attr("height", (d) => d)
    .style("fill", "lightblue");

  // Добавьте подписи или метки для барчартов
  barChartsGroup
      .selectAll("text")
      .data(barChartData)
      .enter()
      .append("text")
      .attr("x", (d, i) => i * (ctx.barChartWidth + ctx.barSpacing) + (ctx.barChartWidth / 2))
      .attr("y", ctx.barChartHeight + 20)
      .attr("text-anchor", "middle")
      .text((d, i) => `Bar Chart ${i + 1}`);
}


function CreateTop(svgEl){
    const topGroup = svgEl.append("g").attr("id", "topgroup");

    // Создание выпадающего списка
    const select = topGroup
        .append("foreignObject")
        .attr("x", 250)
        .attr("y", 10)
        .attr("width", 150)
        .attr("height", 30)
        .append("xhtml:select")
        .attr("style", "width: 100%;");

    // Добавление опций в выпадающий список
    select.selectAll("option")
        .data(["Option 1", "Option 2", "Option 3"])
        .enter()
        .append("xhtml:option")
        .attr("value", function(d) {
            return d;
        })
        .text(function(d) {
            return d;
        });

    // Создание 5 чекбоксов
    const checkboxData = [1, 2, 3, 4, 5];
    const checkboxGroup = topGroup.selectAll(".checkbox")
        .data(checkboxData)
        .enter().append("g")
        .attr("class", "checkbox")
        .attr("transform", function(d, i) {
          return "translate(10, " + (40 * i + 10) + ")";
        });


    checkboxGroup.append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", "lightgray")
        .style("stroke", "black");

    checkboxGroup.append("text")
        .attr("x", 30)
        .attr("y", 15)
        .text((d) => `Checkbox ${d}`);

    CreateBarCharts(svgEl);

    // Обработчик событий для чекбоксов
    checkboxGroup.on("click", function (d) {
        const checkbox = d3.select(this);
        const isChecked = !checkbox.classed("checked");
        checkbox.classed("checked", isChecked);
        console.log(`Чекбокс ${d} выбран: ${isChecked}`);
    });

    // Обработчик события для выпадающего списка
    select.on("change", function () {
        const selectedOption = d3.select(this).property("value");
        console.log("Выбрана опция: " + selectedOption);
    });
}

function CreateMap(svgEl, geo){

    const projection = d3.geoIdentity().reflectY(true).fitSize([ctx.SVG_W, ctx.SVG_H], geo);
    const pathGenerator = d3.geoPath().projection(projection);
    
    // Create a group for the map features
    const mapGroup = svgEl.append("g").attr("width", ctx.SVG_W).attr("height", ctx.SVG_H);

    // Bind the GeoJSON data to the path elements and draw them
    mapGroup
      .selectAll("path")
      .data(geo.features)
      .enter()
      .append("path")
      .attr("d", pathGenerator)
      .style("fill", "lightblue") // Set a fill color
      .style("stroke", "gray");

}

function loadData(svgEl) {
    // TASK 1.1
    Promise.all([
        d3.json("data/custom.geo.json"),
      ])
        .then(function(data) {
          console.log(data)

          //createViz();
          CreateMap(svgEl, data[0]);
          CreateTop(svgEl);

        }).catch(function (error) { console.log(error) });
};

function createViz() {
    console.log("Using D3 v" + d3.version);
    let svgEl = d3.select("#main").append("svg").attr("id", "map");
    svgEl.attr("width", ctx.SVG_W);
    svgEl.attr("height", ctx.SVG_H);
    loadData(svgEl);
};

