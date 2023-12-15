const ctx = {
    SVG_W: 2000,
    SVG_H: 2000,
    barChartWidth: 100,
    barChartHeight: 50,
    barSpacing: 10,
    topfeatures: {"McMeal": 'x3', 
                "One-way Ticket": 'x28',
                "Basic": 'x36',
                "Internet": 'x38', 
                "Average Monthly Net Salary": 'x54', 
                "Mortgage Interest Rate": 'x55', 
                "Price per Square Meter": 'x52', 
                "Gasoline": 'x33'},
    CitiesInfo: '',
    selectedOption: 'McMeal',
    selectedCountry: 'France',
};

function createBarChart(container, data) {
    const barChart = d3.create('svg')
        .attr('width', 1000)
        .attr('height', 1000)
        .style("opacity", 1);
        //.attr('transform', 'translate(500, 50)');

    let column = ctx.topfeatures[ctx.selectedOption];

    const chartGroup = barChart.append("g")
        .attr('transform', 'translate(50, 30)');

    const filteredCities = data.filter(city => city.country === ctx.selectedCountry);

    const sortedData = filteredCities.sort((a, b) => b[column] - a[column]).slice(0, 10);

    const yScale = d3.scaleBand()
        .domain(sortedData.map(d => d.city))
        .range([0, 200])
        .padding(0.1);

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(sortedData, d => d[column])])
        .range([0, 500]);

    chartGroup.selectAll('rect')
        .data(sortedData)
        .enter().append('rect')
        .attr('x', d => 0)
        .attr('y', d => yScale(d['city']))
        .attr('height', yScale.bandwidth())
        .attr('width', d => xScale(d[column]))
        .attr('fill', 'lightblue')
        .style("opacity", 1);

    chartGroup.selectAll('text')
        .data(sortedData)
        .enter()
        .append('text')
        .text(d => d[column]) // Use the data value as the label
        .attr('y', d => yScale(d.city) + yScale.bandwidth()/2 + 5)
        .attr('x', d => xScale(d[column]) + 35) // Adjust the position of the label
        .attr('text-anchor', 'middle') // Center the text horizontally

    chartGroup.append("g")
        //.attr("transform", 'rotate(-90)')
        .call(d3.axisLeft(yScale))
        .selectAll("text")
        .attr("x", -15) // Adjust the distance of the labels from the axis
        .attr("y", -15)  // Adjust the vertical position of the labels
        .attr("dy", "1em") // Fine-tune the vertical alignment
        .style("text-anchor", "middle") // Align text to the end of the axis
        .attr("transform", "rotate(-45)"); // Center the text horizontally

    chartGroup.append('text')
        //.attr('transform', 'rotate(-90)')
        .attr('y', 200)
        .attr('x', 100)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('USD');

    container.appendChild(barChart.node());
    return barChart;
}

function createTable(container, data) {
    const table = d3.create('table').attr('x', 250).attr('y', 50);
    const thead = table.append('thead');
    const tbody = table.append('tbody');

    // Создание заголовка таблицы
    const headerRow = thead.append('tr');
    const headers = ['Place', 'City', 'Country', 'Price'];
    headers.forEach(headerText => {
        headerRow.append('th').text(headerText);
    });

    let column = ctx.topfeatures[ctx.selectedOption];

    const filteredCities = data.filter(city => city.country === ctx.selectedCountry);

    const sortedData = filteredCities.sort((a, b) => b[column] - a[column]).slice(0,10);

    console.log(sortedData);

    // Создание строк таблицы с данными
    sortedData.forEach((rowData, index) => {
        const row = tbody.append('tr');
        row.append('td').text(index + 1);
        row.append('td').text(rowData['city']);
        row.append('td').text(rowData['country']);
        row.append('td').text(rowData[column]);
    });

    container.appendChild(table.node());
    return table;
}

function CreateTop(main, data){
    let Top = main.append("svg").attr("id", "top").attr("width", 1000).attr("height", 1000);
    const topGroup = Top.append("g").attr("id", "topgroup").attr("transform", "translate(0, 0)");

    // Создание выпадающего списка
    const select = topGroup
        .append("foreignObject")
        .attr("x", 250)
        .attr("y", 10)
        .attr("width", 150)
        .attr("height", 30)
        .append("xhtml:select")
        //.attr("transform", "translate(1000, 0)")
        .attr("style", "width: 100%;");

    // Добавление опций в выпадающий список
    select.selectAll("option")
        .data(Object.keys(ctx.topfeatures))
        .enter()
        .append("xhtml:option")
        .attr("value", function(d) {
            return d;
        })
        .text(function(d) {
            return d;
        });

    const tableContainer = topGroup.append("foreignObject")
        //.attr('transform', 'translate(0,50)') 
        .attr("x", 50) // Adjust the x-coordinate to position it to the right
        .attr("y", 50)
        .attr("width", 500)
        .attr("height", 500)
        .append("xhtml:div")
        .style("display", "none")
        .attr("id", "tableContainer");

    // Добавление кнопки для отображения таблицы
    /*topGroup.append("foreignObject")
        .attr("x", 400)
        .attr("y", 10)
        .attr("width", 100)
        .attr("height", 30)
        .append("xhtml:button")
        .text("Show Top")
        .on("click", function () {
            // Показать таблицу
            //tableContainer.style("display", "block");
            tableContainer.style("display", "block");
            barChartContainer.style("display", "block");
        });*/

    const barChartContainer = topGroup.append("foreignObject")
        .attr("width", 1000)
        .attr("height", 1000)
        .attr("transform", "translate(550, 50)") // Adjust the position as needed
        .append("xhtml:div")
        .style("display", "none")
        .attr("id", "barChartContainer");


    // Создание 5 чекбоксов
    /*const checkboxData = [1, 2, 3, 4, 5];
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
    });*/

    // Обработчик события для выпадающего списка
    select.on("change", function () {
        const selectedOption = d3.select(this).property("value");
        ctx.selectedOption = selectedOption;
        
        tableContainer.html("");
        barChartContainer.html("");
        createTable(tableContainer.node(), data);
        createBarChart(barChartContainer.node(), data);
        tableContainer.style("display", "block");
        barChartContainer.style("display", "block");

        //tableContainer.style("display", "none");
        //barChartContainer.style("display", "none");
    });
}

function CreateMap(geo, data, cities){
    
    let main = d3.select("#map")

    let Map = main.append("svg").attr("id", "map").attr("width", ctx.SVG_W).attr("height", ctx.SVG_H);

    const projection = d3.geoIdentity().reflectY(true).fitSize([ctx.SVG_W, ctx.SVG_H], geo);
    const pathGenerator = d3.geoPath().projection(projection);

    const zoom = d3.zoom()
    .scaleExtent([1, 8]) // Установка диапазона масштабирования
    .on("zoom", zoomed);
    
    // Create a group for the map features
    const mapGroup = Map.append("g")
                        .attr("transform", "translate(0, -500)")
                        .attr("width", ctx.SVG_W)
                        .attr("height", ctx.SVG_H);

    // Bind the GeoJSON data to the path elements and draw them
    mapGroup
      .selectAll("path")
      .data(geo.features)
      .enter()
      .append("path")
      .attr("d", pathGenerator)
      .style("fill", "red") // Set a fill color
      .style("background", 'black')
      .style("stroke", "white");

    mapGroup.call(zoom);
    mapGroup.on("wheel.zoom", null); // Отключаем стандартное масштабирование браузера

    mapGroup.selectAll("path")
      .on("mouseover", function (event, d) {
          d3.select(this)
              .style("fill", "orange"); // Измените цвет подсветки по своему выбору
      })
      .on("mouseout", function (event, d) {
          d3.select(this)
              .style("fill", "lightblue"); // Возвращение оригинального цвета
      })
      .on("click", function (event, d) {
        d3.select(this)
            .style("fill", "green"); // Возвращение оригинального цвета
        ctx.selectedCountry = d.properties.name;
        updateCountryMap(d, cities);
        updateInfo(d, data);
      });

    const zoomInButton = main.append("button")
      .text("Zoom In")
      .attr("transform", "translate(0, 0)")
      .on("click", function() {
          mapGroup.transition().call(zoom.scaleBy, 1.2);
      });

    const zoomOutButton = main.append("button")
      .text("Zoom Out")
      .attr("transform", "translate(0,0)")
      .on("click", function() {
          mapGroup.transition().call(zoom.scaleBy, 0.8);
      });

    function zoomed(event) {
        mapGroup.attr("transform", event.transform);
    }

}

function CreatePlot(main, data) {
    let Plot = main.append("svg").attr("id", "plot").attr("width", 1000).attr("height", 1000);
    const plotGroup = Plot.append("g").attr("id", "plotgroup").attr("transform", "translate(500, 0)");

    // Создание выпадающих списков для выбора осей
    const xSelect = plotGroup
        .append("foreignObject")
        .attr("x", 50)
        .attr("y", 0)
        .attr("width", 150)
        .attr("height", 30)
        .append("xhtml:select")
        .attr("style", "width: 100%;");

    const ySelect = plotGroup
        .append("foreignObject")
        .attr("x", 250)
        .attr("y", 0)
        .attr("width", 150)
        .attr("height", 30)
        .append("xhtml:select")
        .attr("style", "width: 100%;");

    // Добавление опций в выпадающие списки
    [xSelect, ySelect].forEach(select => {
        select.selectAll("option")
            .data(Object.keys(ctx.topfeatures))
            .enter()
            .append("xhtml:option")
            .attr("value", d => d)
            .text(d => d);
    });

    const scatterPlotContainer = plotGroup.append("foreignObject")
        .attr("width", 1000)
        .attr("height", 1000)
        .attr("transform", "translate(50, 50)") // Adjust the position as needed
        .append("xhtml:div")
        .attr("id", "scatterPlotContainer");

    // Добавление кнопки для отображения графика
    plotGroup.append("foreignObject")
        .attr("x", 450)
        .attr("y", 0)
        .attr("width", 150)
        .attr("height", 30)
        .append("xhtml:button")
        .text("Show Scatter Plot")
        .on("click", function () {
            scatterPlotContainer.html("");
            const xOption = xSelect.property("value");
            const yOption = ySelect.property("value");
            createScatterPlot(scatterPlotContainer.node(), data, xOption, yOption);
        });

    // Обработчик события для изменения осей графика
    [xSelect, ySelect].forEach(select => {
        select.on("change", function () {
            scatterPlotContainer.html("");
            const xOption = xSelect.property("value");
            const yOption = ySelect.property("value");
            createScatterPlot(scatterPlotContainer.node(), data, xOption, yOption);
        });
    });

    // Первичное отображение графика
    const initialXOption = xSelect.property("value");
    const initialYOption = ySelect.property("value");
    createScatterPlot(scatterPlotContainer.node(), data, initialXOption, initialYOption);

}

function createScatterPlot(container, data, xOption, yOption) {
    const scatterPlot = d3.create('svg')
        .attr('width', 1000)
        .attr('height', 1000)
        .style("opacity", 1)
        .attr('transform', 'translate(50, 0)');

    const xColumn = ctx.topfeatures[xOption];
    const yColumn = ctx.topfeatures[yOption];

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[xColumn])])
        .range([0, 500]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[yColumn])])
        .range([500, 0]);

    // Ось X
    scatterPlot.append("g")
        .attr("transform", "translate(50, 500)")
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("x", 250) // Расположение подписи оси X по центру
        .attr("y", 30)  // Расположение подписи ниже оси X
        .style("text-anchor", "middle")
        .text(xOption);

    // Ось Y
    scatterPlot.append("g")
        .attr("transform", "translate(50, 0)")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("x", 30)  // Расположение подписи оси Y по центру
        .attr("y", 30)   // Расположение подписи слева от оси Y
        .style("text-anchor", "middle")
        .text(yOption);

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    scatterPlot.selectAll('circle')
        .data(data)
        .enter().append('circle')
        .attr('cx', d => xScale(d[xColumn]))
        .attr('cy', d => yScale(d[yColumn]))
        .attr('r', 3)
        .attr("transform", "translate(50, 0)")
        .attr('fill', 'lightblue')
        .style("opacity", 0.7)
        .on("mouseover", function (event, d) {
            // Показать всплывающую подсказку при наведении мыши
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltip.html(d.city)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 18) + "px");
        })
        .on("mouseout", function (d) {
            // Скрыть всплывающую подсказку при уходе мыши
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });


    container.appendChild(scatterPlot.node());
    return scatterPlot;
}

function CreateCountryMap(map){
    let main = d3.select("#country").style("display", "inline-block");

    let CountryMap = main.append("svg").attr("id", "country-map").attr("width", ctx.SVG_W/2).attr("height", ctx.SVG_H/2);

    const projection = d3.geoIdentity().reflectY(true).fitSize([ctx.SVG_W/2, ctx.SVG_H/2], map);
    const pathGenerator = d3.geoPath().projection(projection);
    
    // Create a group for the map features
    const cmapGroup = CountryMap.append("g")
                        .attr("transform", "translate(0, 0)")
                        .attr("id", "city-markers")
                        .attr("width", ctx.SVG_W/2)
                        .attr("height", ctx.SVG_H/2);

    // Bind the GeoJSON data to the path elements and draw them
    cmapGroup.selectAll("path")
      .data(map.features)
      .enter()
      .append("path")
      .attr("d", pathGenerator)
      .style("fill", "red") // Set a fill color
      .style("background", 'black')
      .style("stroke", "white");

    cmapGroup.selectAll("path")
      .on("mouseover", function (event, d) {
          d3.select(this)
              .style("fill", "orange"); // Измените цвет подсветки по своему выбору
      })
      .on("mouseout", function (event, d) {
          d3.select(this)
              .style("fill", "lightblue"); // Возвращение оригинального цвета
      });
}


function CreateInfo(data){
    let main = d3.select("#info").style("float", "right");
    let Info = main.append("svg").attr("id", "info").attr("width", ctx.SVG_W/2-50).attr("height", ctx.SVG_H/2-50)
                    .attr("alignment-baseline", "middle");

    CreateTop(Info, data);
    CreatePlot(Info, data);

}

function updateCountryMap(selectedCountry, cities) {
    const selectedCountryId = selectedCountry.properties.geoname_id;

    console.log(selectedCountry.properties.name);

    // Assuming your city data is named 'cityData' and is in GeoJSON format
    const filteredCities = cities.features.filter(city => city.properties.cou_name_en === selectedCountry.properties.name);
    const cityNames = filteredCities.map(city => city.properties.name);
    ctx.CitiesInfo = cityNames;
    //console.log(cityNames);
    //console.log(ctx.CitiesInfo);

    // Customize the display of filteredCities as needed
    const countryMapElement = d3.select("#country-map");
    countryMapElement.html("");
    countryMapElement.append("h2").text(selectedCountry.properties.name);
    console.log(countryMapElement.node());

    // Remove existing city markers
    countryMapElement.select("#city-markers").remove();

    // Create a new group for city markers
    const cityMarkers = countryMapElement.append("g").attr("id", "city-markers");

    // Create a projection for the map
    const projection = d3.geoIdentity().reflectY(true).fitSize([ctx.SVG_W / 2, ctx.SVG_H / 2], selectedCountry);
    const pathGenerator = d3.geoPath().projection(projection);

    // Draw the map for the selected country
    /*const cmapGroup = countryMapElement.append("g")
        .attr("transform", "translate(0, 0)")
        .attr("width", ctx.SVG_W / 2)
        .attr("height", ctx.SVG_H / 2);*/

    const cmapGroup = cityMarkers.selectAll("path")
        .data(filteredCities)  // Pass only the selected country to the data
        .enter()
        .append("path")
        .attr("d", pathGenerator)
        .style("fill", "red") // Set a fill color
        .style("background", 'black')
        .style("stroke", "white");

    // Bind the GeoJSON data to the path elements and draw them
    /*cmapGroup.selectAll("path")
        .data(filteredCities.properties)  // Передаем только выбранную страну в данные
        .enter()
        .append("path")
        .attr("d", pathGenerator)
        .style("fill", "orange") // Set a fill color
        .style("background", 'black')
        .style("stroke", "white");*/

}

function updateInfo(selectedCountry, data){
   // const filteredCities = data.filter(city => ctx.CitiesInfo.includes(city.city));
    const tableContainer = d3.selectAll("#tableContainer");
    const barChartContainer = d3.selectAll("#barChartContainer");

    tableContainer.html("");
    barChartContainer.html("");

    createTable(tableContainer.node(), data);
    createBarChart(barChartContainer.node(), data);
        
   // tableContainer.style("display", "none");
   // barChartContainer.style("display", "none");

}

function loadData() {
    Promise.all([
        d3.json("data/custom.geo.json"),
        d3.csv("data/cost-of-living.csv"),
        d3.json("data/world.geojson")
      ])
        .then(function(data) {

          //createViz();
          CreateMap(data[0], data[1], data[2]);
          CreateCountryMap(data[2]);
          CreateInfo(data[1]);

          d3.selectAll("map").call(zoom);

        }).catch(function (error) { console.log(error) });
};

function createViz() {
    console.log("Using D3 v" + d3.version);
    loadData();
};

