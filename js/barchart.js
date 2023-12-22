const top = {
    SVG_W: 1000,
    SVG_H: 1000,
    barChartWidth: 100,
    barChartHeight: 50,
    barSpacing: 10,
    selectedOption: '',
    topfeatures: {"McMeal": 'x3', 
                "One-way Ticket": 'x28',
                "Basic": 'x36',
                "Internet": 'x38', 
                "Average Monthly Net Salary": 'x54', 
                "Mortgage Interest Rate": 'x55', 
                "Price per Square Meter": 'x52', 
                "Gasoline": 'x33'},
};

function createTable(container, data) {
     const table = d3.create('table').attr('x', 250).attr('y', 50).attr('width', top.SVG_W/2).attr('height', top.SVG_H/2);
     const thead = table.append('thead');
     const tbody = table.append('tbody');

     // Создание заголовка таблицы
     const headerRow = thead.append('tr');
     const headers = ['Place', 'City', 'Country', 'Price, USD'];
     headers.forEach(headerText => {
         headerRow.append('th').text(headerText);
     });

     let column = top.topfeatures[top.selectedOption];

     const sortedData = data.sort((a, b) => b[column] - a[column]).slice(0,10);


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
 };

 function createBarChart(container, data) {
    const barChart = d3.create('svg')
        .attr('width', top.SVG_W)
        .attr('height', top.SVG_H/2)
        .style("opacity", 1);
        //.attr('transform', 'translate(500, 50)');

    let column = top.topfeatures[top.selectedOption];

    const chartGroup = barChart.append("g").attr('width', top.SVG_W).attr('height', top.SVG_H/2)
        .attr('transform', 'translate(50, 50)');

    //const filteredCities = data.filter(city => city.country === top.selectedCountry);

    const sortedData = data.sort((a, b) => b[column] - a[column]).slice(0, 10);

    //console.log(sortedData[0][column]);

    const xScale = d3.scaleBand()
        .domain(sortedData.map(d => d.city))
        .range([0, top.SVG_W - 100])
        .padding(0.3);

    //console.log(column);

    const yScale = d3.scaleLinear()
        .domain([0, sortedData[0][column]])
        .range([(top.SVG_H / 2 - 100), 0]);

    //console.log(d3.max(sortedData, d => d[column]));

    chartGroup.selectAll('rect')
        .data(sortedData)
        .enter().append('rect')
        .attr('x', d => xScale(d['city']))
        .attr('y', d => yScale(d[column]))
        .attr('width', xScale.bandwidth())
        .attr('height', d => (top.SVG_H / 2 - 100) - yScale(d[column]))
        .attr('fill', 'lightblue')
        .style("opacity", 1);

    chartGroup.selectAll('text.bar-label')
        .data(sortedData)
        .enter()
        .append('text')
        .attr('class', 'bar-label')
        .text(d => d[column]) // Use the data value as the label
        .attr('x', d => xScale(d['city']) + xScale.bandwidth()/2)
        .attr('y', d => yScale(d[column]) - 5) // Adjust the position of the label
        .attr('text-anchor', 'middle'); // Center the text horizontally

    chartGroup.append("g")
        .call(d3.axisLeft(yScale))
        .selectAll("text")
        .attr("x", -15) // Adjust the distance of the labels from the axis
        .attr("y", -15)  // Adjust the vertical position of the labels
        .attr("dy", "1em") // Fine-tune the vertical alignment
        .style("text-anchor", "middle") // Align text to the end of the axis
        .attr("transform", "rotate(-45)"); // Center the text horizontally

    // chartGroup.append('text')
    //     .attr('y', -10)
    //     .attr('x', 250)
    //     .attr('dy', '1em')
    //     .style('text-anchor', 'middle')
    //     .text('USD');

    // Adding city labels below each bar
    chartGroup.selectAll('text.city-label')
        .data(sortedData)
        .enter()
        .append('text')
        .attr('class', 'city-label')
        .text(d => d.city)
        .attr('x', d => xScale(d.city) + xScale.bandwidth() / 2)
        .attr('y', (top.SVG_H / 2 - 75)) // Adjust the vertical position of the city labels
        .attr('text-anchor', 'middle')
        .attr('transform', (d) => `rotate(-15 ${xScale(d.city) + xScale.bandwidth() / 2},${(top.SVG_H / 2 - 75)})`);

    container.appendChild(barChart.node());
    return barChart;
}

 function CreateTop(main, data){
    const topGroup = d3.select("#info");
    topGroup.append("text")
    .attr("x", top.SVG_W/2)  // Adjust the x-coordinate of the text
    .attr("y", 20)  // Adjust the y-coordinate of the text
    .text("Top 10 Cities in the World")
    .style("font-size", "30px")  // Adjust the font size if needed
    .style("fill", "black"); 

    const selectContainer = topGroup.append("div")
    .attr("class", "dropdown-container");

    selectContainer.append("label")
    .attr("for", "plot-selectX")
    .text("Choose top feature");
    
    const topselect = selectContainer.append("select")
                            .attr("name", "top-select")
                            .attr("id", "top-select");
    topselect.append("option")
            .attr('value', '')
            .attr('disabled', true)
            .attr('selected', true)
            .text('Choose feature');

    topselect.selectAll("option")
        .data(Object.keys(top.topfeatures))
        .enter()
        .append('option')
        .attr("value", function (d) {
            return d;
        })
        .text(function (d) {
            return d;
        });

    let elem_select = document.getElementById('top-select');
    let instance_select = M.FormSelect.init(elem_select, '');

    const tableContainer = topGroup.append("foreignObject")
         //.attr('transform', 'translate(0,50)') 
         .attr("x", 50) // Adjust the x-coordinate to position it to the right
         .attr("y", 50)
         .attr("width", top.SVG_W/2)
         .attr("height", top.SVG_H/2)
         .append("xhtml:div")
         .style("display", "block")
         .attr("id", "tableContainer");

     const barChartContainer = topGroup.append("foreignObject")
         .attr("width", top.SVG_W/2)
         .attr("height", top.SVG_H)
         .attr("transform", "translate(0, 0)") // Adjust the position as needed
         .append("xhtml:div")
         .style("display", "block")
         .attr("id", "barChartContainer");


     // Обработчик события для выпадающего списка
     topselect.on("change", function () {
         top.selectedOption = d3.select(this).property("value");
         tableContainer.html("");
         barChartContainer.html("");
         createTable(tableContainer.node(), data);
         createBarChart(barChartContainer.node(), data);
     });
 };

 function CreatePlot(main, data) {
     //let Plot = main.append("svg").attr("id", "plot").attr("width", 1000).attr("height", 1000);
     //const plotGroup = main.append("g").attr("id", "plotgroup").attr("transform", "translate(0, 0)");
     // Создание выпадающих списков для выбора осей
     main.append("text")
     .attr("x", top.SVG_W/2)  // Adjust the x-coordinate of the text
     .attr("y", 20)  // Adjust the y-coordinate of the text
     .text("Plot")
     .style("font-size", "30px")  // Adjust the font size if needed
     .style("fill", "black"); 

     const selectXContainer = main.append("div")
     .attr("class", "dropdown-container");

    selectXContainer.append("label")
     .attr("for", "plot-selectX")
     .text("Choose feature X");

    const plotselectX = selectXContainer.append("select")
                            .attr("name", "plot-selectX")
                            .attr("id", "plot-selectX");
    plotselectX.append("option")
            .attr('value', '')
            .attr('disabled', true)
            .attr('selected', true)
            .text('Choose feature X');

    plotselectX.selectAll("option")
        .data(Object.keys(top.topfeatures))
        .enter()
        .append('option')
        .attr("value", function (d) {
            return d;
        })
        .text(function (d) {
            return d;
        });

    let elem_select_X = document.getElementById('plot-selectX');
    M.FormSelect.init(elem_select_X, '');

    const selectYContainer = main.append("div")
    .attr("class", "dropdown-container");

   selectYContainer.append("label")
    .attr("for", "plot-selectX")
    .text("Choose feature Y");

    const plotselectY = selectYContainer.append("select")
                            .attr("name", "plot-selectY")
                            .attr("id", "plot-selectY");
    plotselectY.append("option")
            .attr('value', '')
            .attr('disabled', true)
            .attr('selected', true)
            .text('Choose feature Y');

    plotselectY.selectAll("option")
        .data(Object.keys(top.topfeatures))
        .enter()
        .append('option')
        .attr("value", function (d) {
            return d;
        })
        .text(function (d) {
            return d;
        });

    let elem_select_Y = document.getElementById('plot-selectY');
    M.FormSelect.init(elem_select_Y, '');

    const scatterPlotContainer = main.append("foreignObject")
         .attr("width", top.SVG_W)
         .attr("height", top.SVG_H/2)
         .attr("transform", "translate(0, 0)") // Adjust the position as needed
         .append("xhtml:div")
         .attr("id", "scatterPlotContainer");


     // Обработчик события для изменения осей графика
     [plotselectX, plotselectY].forEach(select => {
         select.on("change", function () {
             scatterPlotContainer.html("");
             const xOption = plotselectX.property("value");
             const yOption = plotselectY.property("value");
             createScatterPlot(scatterPlotContainer.node(), data, xOption, yOption);
         });
     });

 }

 function createScatterPlot(container, data, xOption, yOption) {
     const scatterPlot = d3.create('svg')
         .attr('width', top.SVG_W)
         .attr('height', top.SVG_H/2 + 50)
         .style("opacity", 1)
         .attr('transform', 'translate(50, 50)');

     const xColumn = top.topfeatures[xOption];
     const yColumn = top.topfeatures[yOption];

     const xScale = d3.scaleLinear()
         .domain([0, d3.max(data, d => d[xColumn])])
         .range([0, top.SVG_W]);

     const yScale = d3.scaleLinear()
         .domain([0, d3.max(data, d => d[yColumn])])
         .range([top.SVG_H/2, 0]);

     // Ось X
     scatterPlot.append("g")
         .attr("transform", `translate(50, ${top.SVG_H/2})`)
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

    scatterPlot.append("text")
         .attr("x", top.SVG_W / 2)
         .attr("y", top.SVG_H / 2 + 40)
         .style("text-anchor", "middle")
         .style("font-weight", "bold")
         .text(`Scatter Plot: ${yOption} vs ${xOption}`);
 
     // Добавление подписей осей
     scatterPlot.append("text")
         .attr("x", top.SVG_W / 2)
         .attr("y", 50)
         .style("text-anchor", "middle")
         .style("font-weight", "bold")
         .text(xOption);
 
     scatterPlot.append("text")
         .attr("x", -top.SVG_H/2 + 150)
         .attr("y", 20)
         .attr("transform", "rotate(-90)")
         .style("text-anchor", "middle")
         .style("font-weight", "bold")
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


export function CreateInfo(data){
    const width = document.getElementById('bar-charts').offsetWidth;
    const height = 1000;//document.getElementById('bar-charts').offsetHeight;

    top.SVG_W = width;
    top.SVG_H = height;

     let main = d3.select("#bar-charts");
     let Info = main.append("div").attr("id", "info").attr("width", width).attr("height", height);

     CreateTop(Info, data);
     CreatePlot(Info, data);

}
