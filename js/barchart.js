// function createTable(container, data, selectedOption) {
//     const table = d3.create('table').attr('x', 250).attr('y', 50);
//     const thead = table.append('thead');
//     const tbody = table.append('tbody');

//     // Создание заголовка таблицы
//     const headerRow = thead.append('tr');
//     const headers = ['Place', 'City', 'Country', 'Price'];
//     headers.forEach(headerText => {
//         headerRow.append('th').text(headerText);
//     });

//     let column = ctx.topfeatures[selectedOption];
//     console.log(column);

//     const sortedData = data.sort((a, b) => b[column] - a[column]).slice(0,10);

//     console.log(sortedData);

//     // Создание строк таблицы с данными
//     sortedData.forEach((rowData, index) => {
//         const row = tbody.append('tr');
//         row.append('td').text(index + 1);
//         row.append('td').text(rowData['city']);
//         row.append('td').text(rowData['country']);
//         row.append('td').text(rowData[column]);
//     });

//     container.appendChild(table.node());
//     return table;
// }

// function CreateTop(main, data){
//     let Top = main.append("svg").attr("id", "top").attr("width", 1000).attr("height", 1000);
//     const topGroup = Top.append("g").attr("id", "topgroup").attr("transform", "translate(0, 0)");

//     // Создание выпадающего списка
//     const select = topGroup
//         .append("foreignObject")
//         .attr("x", 250)
//         .attr("y", 10)
//         .attr("width", 150)
//         .attr("height", 30)
//         .append("xhtml:select")
//         //.attr("transform", "translate(1000, 0)")
//         .attr("style", "width: 100%;");

//     // Добавление опций в выпадающий список
//     select.selectAll("option")
//         .data(Object.keys(ctx.topfeatures))
//         .enter()
//         .append("xhtml:option")
//         .attr("value", function(d) {
//             return d;
//         })
//         .text(function(d) {
//             return d;
//         });

//     const tableContainer = topGroup.append("foreignObject")
//         //.attr('transform', 'translate(0,50)') 
//         .attr("x", 50) // Adjust the x-coordinate to position it to the right
//         .attr("y", 50)
//         .attr("width", 500)
//         .attr("height", 500)
//         .append("xhtml:div")
//         .style("display", "none")
//         .attr("id", "tableContainer");

//     // Добавление кнопки для отображения таблицы
//     topGroup.append("foreignObject")
//         .attr("x", 400)
//         .attr("y", 10)
//         .attr("width", 100)
//         .attr("height", 30)
//         .append("xhtml:button")
//         .text("Show Top")
//         .on("click", function () {
//             // Показать таблицу
//             //tableContainer.style("display", "block");
//             tableContainer.style("display", "block");
//             barChartContainer.style("display", "block");
//         });

//     const barChartContainer = topGroup.append("foreignObject")
//         .attr("width", 1000)
//         .attr("height", 1000)
//         .attr("transform", "translate(550, 50)") // Adjust the position as needed
//         .append("xhtml:div")
//         .style("display", "none")
//         .attr("id", "barChartContainer");


//     // Создание 5 чекбоксов
//     /*const checkboxData = [1, 2, 3, 4, 5];
//     const checkboxGroup = topGroup.selectAll(".checkbox")
//         .data(checkboxData)
//         .enter().append("g")
//         .attr("class", "checkbox")
//         .attr("transform", function(d, i) {
//           return "translate(10, " + (40 * i + 10) + ")";
//         });


//     checkboxGroup.append("rect")
//         .attr("width", 20)
//         .attr("height", 20)
//         .style("fill", "lightgray")
//         .style("stroke", "black");

//     checkboxGroup.append("text")
//         .attr("x", 30)
//         .attr("y", 15)
//         .text((d) => `Checkbox ${d}`);

//     CreateBarCharts(svgEl);

//     // Обработчик событий для чекбоксов
//     checkboxGroup.on("click", function (d) {
//         const checkbox = d3.select(this);
//         const isChecked = !checkbox.classed("checked");
//         checkbox.classed("checked", isChecked);
//         console.log(`Чекбокс ${d} выбран: ${isChecked}`);
//     });*/

//     // Обработчик события для выпадающего списка
//     select.on("change", function () {
//         const selectedOption = d3.select(this).property("value");
//         tableContainer.html("");
//         barChartContainer.html("");
//         createTable(tableContainer.node(), data, selectedOption);
//         createBarChart(barChartContainer.node(), data, selectedOption);
//         tableContainer.style("display", "none");
//         barChartContainer.style("display", "none");
//     });
// }

// function CreatePlot(main, data) {
//     let Plot = main.append("svg").attr("id", "plot").attr("width", 1000).attr("height", 1000);
//     const plotGroup = Plot.append("g").attr("id", "plotgroup").attr("transform", "translate(500, 0)");

//     // Создание выпадающих списков для выбора осей
//     const xSelect = plotGroup
//         .append("foreignObject")
//         .attr("x", 50)
//         .attr("y", 0)
//         .attr("width", 150)
//         .attr("height", 30)
//         .append("xhtml:select")
//         .attr("style", "width: 100%;");

//     const ySelect = plotGroup
//         .append("foreignObject")
//         .attr("x", 250)
//         .attr("y", 0)
//         .attr("width", 150)
//         .attr("height", 30)
//         .append("xhtml:select")
//         .attr("style", "width: 100%;");

//     // Добавление опций в выпадающие списки
//     [xSelect, ySelect].forEach(select => {
//         select.selectAll("option")
//             .data(Object.keys(ctx.topfeatures))
//             .enter()
//             .append("xhtml:option")
//             .attr("value", d => d)
//             .text(d => d);
//     });

//     const scatterPlotContainer = plotGroup.append("foreignObject")
//         .attr("width", 1000)
//         .attr("height", 1000)
//         .attr("transform", "translate(50, 50)") // Adjust the position as needed
//         .append("xhtml:div")
//         .attr("id", "scatterPlotContainer");

//     // Добавление кнопки для отображения графика
//     plotGroup.append("foreignObject")
//         .attr("x", 450)
//         .attr("y", 0)
//         .attr("width", 150)
//         .attr("height", 30)
//         .append("xhtml:button")
//         .text("Show Scatter Plot")
//         .on("click", function () {
//             scatterPlotContainer.html("");
//             const xOption = xSelect.property("value");
//             const yOption = ySelect.property("value");
//             createScatterPlot(scatterPlotContainer.node(), data, xOption, yOption);
//         });

//     // Обработчик события для изменения осей графика
//     [xSelect, ySelect].forEach(select => {
//         select.on("change", function () {
//             scatterPlotContainer.html("");
//             const xOption = xSelect.property("value");
//             const yOption = ySelect.property("value");
//             createScatterPlot(scatterPlotContainer.node(), data, xOption, yOption);
//         });
//     });

//     // Первичное отображение графика
//     const initialXOption = xSelect.property("value");
//     const initialYOption = ySelect.property("value");
//     createScatterPlot(scatterPlotContainer.node(), data, initialXOption, initialYOption);

// }

// function createScatterPlot(container, data, xOption, yOption) {
//     const scatterPlot = d3.create('svg')
//         .attr('width', 1000)
//         .attr('height', 1000)
//         .style("opacity", 1)
//         .attr('transform', 'translate(50, 0)');

//     const xColumn = ctx.topfeatures[xOption];
//     const yColumn = ctx.topfeatures[yOption];

//     const xScale = d3.scaleLinear()
//         .domain([0, d3.max(data, d => d[xColumn])])
//         .range([0, 500]);

//     const yScale = d3.scaleLinear()
//         .domain([0, d3.max(data, d => d[yColumn])])
//         .range([500, 0]);

//     // Ось X
//     scatterPlot.append("g")
//         .attr("transform", "translate(50, 500)")
//         .call(d3.axisBottom(xScale))
//         .append("text")
//         .attr("x", 250) // Расположение подписи оси X по центру
//         .attr("y", 30)  // Расположение подписи ниже оси X
//         .style("text-anchor", "middle")
//         .text(xOption);

//     // Ось Y
//     scatterPlot.append("g")
//         .attr("transform", "translate(50, 0)")
//         .call(d3.axisLeft(yScale))
//         .append("text")
//         .attr("x", 30)  // Расположение подписи оси Y по центру
//         .attr("y", 30)   // Расположение подписи слева от оси Y
//         .style("text-anchor", "middle")
//         .text(yOption);

//     const tooltip = d3.select("body").append("div")
//         .attr("class", "tooltip")
//         .style("opacity", 0);

//     scatterPlot.selectAll('circle')
//         .data(data)
//         .enter().append('circle')
//         .attr('cx', d => xScale(d[xColumn]))
//         .attr('cy', d => yScale(d[yColumn]))
//         .attr('r', 3)
//         .attr("transform", "translate(50, 0)")
//         .attr('fill', 'lightblue')
//         .style("opacity", 0.7)
//         .on("mouseover", function (event, d) {
//             // Показать всплывающую подсказку при наведении мыши
//             tooltip.transition()
//                 .duration(200)
//                 .style("opacity", 0.9);
//             tooltip.html(d.city)
//                 .style("left", (event.pageX + 5) + "px")
//                 .style("top", (event.pageY - 18) + "px");
//         })
//         .on("mouseout", function (d) {
//             // Скрыть всплывающую подсказку при уходе мыши
//             tooltip.transition()
//                 .duration(500)
//                 .style("opacity", 0);
//         });

//     container.appendChild(scatterPlot.node());
//     return scatterPlot;
// }


// function CreateInfo(data){
//     let main = d3.select("#info").style("float", "right");
//     let Info = main.append("svg").attr("id", "info").attr("width", ctx.SVG_W/2-50).attr("height", ctx.SVG_H/2-50)
//                     .attr("alignment-baseline", "middle");

//     CreateTop(Info, data);
//     CreatePlot(Info, data);

// }