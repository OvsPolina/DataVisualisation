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

     const headerRow = thead.append('tr');
     const headers = ['Place', 'City', 'Country', 'Price, USD'];
     headers.forEach(headerText => {
         headerRow.append('th').text(headerText);
     });

     let column = top.topfeatures[top.selectedOption];

     const sortedData = data.sort((a, b) => b[column] - a[column]).slice(0,10);


     //Rows of a table
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

    let column = top.topfeatures[top.selectedOption];

    const chartGroup = barChart.append("g").attr('width', top.SVG_W).attr('height', top.SVG_H/2)
        .attr('transform', 'translate(50, 50)');

    //const filteredCities = data.filter(city => city.country === top.selectedCountry);

    const sortedData = data.sort((a, b) => b[column] - a[column]).slice(0, 10);

    //Scales for the barchart
    const xScale = d3.scaleBand()
        .domain(sortedData.map(d => d.city))
        .range([0, top.SVG_W - 100])
        .padding(0.3);

    const yScale = d3.scaleLinear()
        .domain([0, sortedData[0][column]])
        .range([(top.SVG_H / 2 - 100), 0]);

    //Barcharts
    chartGroup.selectAll('rect')
        .data(sortedData)
        .enter().append('rect')
        .attr('x', d => xScale(d['city']))
        .attr('y', d => yScale(d[column]))
        .attr('width', xScale.bandwidth())
        .attr('height', d => (top.SVG_H / 2 - 100) - yScale(d[column]))
        .attr('fill', 'lightblue')
        .style("opacity", 1);

    //Labels
    chartGroup.selectAll('text.bar-label')
        .data(sortedData)
        .enter()
        .append('text')
        .attr('class', 'bar-label')
        .text(d => d[column]) 
        .attr('x', d => xScale(d['city']) + xScale.bandwidth()/2)
        .attr('y', d => yScale(d[column]) - 5) 
        .attr('text-anchor', 'middle'); 

    //Y label
    chartGroup.append("g")
        .call(d3.axisLeft(yScale))
        .selectAll("text")
        .attr("x", -15) 
        .attr("y", -15)  
        .attr("dy", "1em")
        .style("text-anchor", "middle") 
        .attr("transform", "rotate(-45)"); 

    // City labels below each bar
    chartGroup.selectAll('text.city-label')
        .data(sortedData)
        .enter()
        .append('text')
        .attr('class', 'city-label')
        .text(d => d.city)
        .attr('x', d => xScale(d.city) + xScale.bandwidth() / 2)
        .attr('y', (top.SVG_H / 2 - 75))
        .attr('text-anchor', 'middle')
        .attr('transform', (d) => `rotate(-15 ${xScale(d.city) + xScale.bandwidth() / 2},${(top.SVG_H / 2 - 75)})`);

    container.appendChild(barChart.node());
    return barChart;
}

 function CreateTop(main, data){
    const topGroup = d3.select("#info");
    
    //Head Text
    topGroup.append("text")
    .attr("x", top.SVG_W/2) 
    .attr("y", 20)  
    .text("Top 10 Cities in the World")
    .style("font-size", "30px")  
    .style("fill", "black"); 

    //Select Feature
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
        .data(Object.keys(top.topfeatures)) //Adding options
        .enter()
        .append('option')
        .attr("value", function (d) {
            return d;
        })
        .text(function (d) {
            return d;
        });

    let elem_select = document.getElementById('top-select');
    M.FormSelect.init(elem_select, '');

    //Table Container
    const tableContainer = topGroup.append("foreignObject")
         .attr("x", 50) 
         .attr("y", 50)
         .attr("width", top.SVG_W/2)
         .attr("height", top.SVG_H/2)
         .append("xhtml:div")
         .style("display", "block")
         .attr("id", "tableContainer");

     //Barchart Container
     const barChartContainer = topGroup.append("foreignObject")
         .attr("width", top.SVG_W/2)
         .attr("height", top.SVG_H)
         .attr("transform", "translate(0, 0)")
         .append("xhtml:div")
         .style("display", "block")
         .attr("id", "barChartContainer");

     // Events
     topselect.on("change", function () {
         top.selectedOption = d3.select(this).property("value");
         tableContainer.html("");
         barChartContainer.html("");
         createTable(tableContainer.node(), data);
         createBarChart(barChartContainer.node(), data);
     });
 };

 function CreatePlot(main, data) {
     // Head Text
     main.append("text")
     .attr("x", top.SVG_W/2)  
     .attr("y", 20)  
     .text("Plot")
     .style("font-size", "30px") 
     .style("fill", "black"); 

     //Select X
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

    //Select Y
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

    //Plot Container
    const scatterPlotContainer = main.append("foreignObject")
         .attr("width", top.SVG_W)
         .attr("height", top.SVG_H/2)
         .append("xhtml:div")
         .attr("id", "scatterPlotContainer");


     // Events
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
    //SVG for Plot
     const scatterPlot = d3.create('svg')
         .attr('width', top.SVG_W)
         .attr('height', top.SVG_H/2 + 50)
         .style("opacity", 1)
         .attr('transform', 'translate(50, 50)');

    //Data
     const xColumn = top.topfeatures[xOption];
     const yColumn = top.topfeatures[yOption];

     let filteredData = data.filter(d => d[xColumn] !== '' && d[yColumn] !== '');

     //Scales
     const xScale = d3.scaleLinear()
         .domain([0, d3.max(data, d => d[xColumn])])
         .range([0, top.SVG_W]);

     const yScale = d3.scaleLinear()
         .domain([0, d3.max(data, d => d[yColumn])])
         .range([top.SVG_H/2, 0]);

     const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

     //Legend
     const legend = scatterPlot.append("g")
                                .attr("class", "legend")
                                .attr("transform", `translate(${top.SVG_W - 150}, 10)`);

     // Axe X
     scatterPlot.append("g")
         .attr("transform", `translate(50, ${top.SVG_H/2})`)
         .call(d3.axisBottom(xScale))
         .append("text")
         .attr("x", 250) 
         .attr("y", 30) 
         .style("text-anchor", "middle")
         .text(xOption);

     scatterPlot.append("text")
         .attr("x", top.SVG_W / 2)
         .attr("y", top.SVG_H / 2 + 40)
         .style("text-anchor", "middle")
         .style("font-weight", "bold")
         .text(xOption + ", USD");

     // Axe Y
     scatterPlot.append("g")
         .attr("transform", "translate(50, 0)")
         .call(d3.axisLeft(yScale))
         .append("text")
         .attr("x", 30)  
         .attr("y", 30)   
         .style("text-anchor", "middle")
         .text(yOption);
 
     scatterPlot.append("text")
         .attr("x", -top.SVG_H/4)
         .attr("y", 20)
         .attr("transform", "rotate(-90)")
         .style("text-anchor", "middle")
         .style("font-weight", "bold")
         .text(yOption+", USD");


     scatterPlot.selectAll('circle')
         .data(filteredData)
         .enter().append('circle')
         .attr('cx', d => xScale(d[xColumn]))
         .attr('cy', d => yScale(d[yColumn]))
         .attr('r', 3)
         .attr("transform", "translate(50, 0)")
         .attr('fill', d => colorScale(d.country))
         .style("opacity", 0.7)
         .on("mouseover", function (event, d) {
             //City label
             scatterPlot.append("text")
                        .attr("class", "tooltip-label")
                        .attr("x", xScale(d[xColumn]) + 55) 
                        .attr("y", yScale(d[yColumn]) - 5)  
                        .text(d.city);

            //Changing Size
            const currentColor = colorScale(d.country);
            scatterPlot.selectAll('circle')
                        .filter(circle => colorScale(circle.country) === currentColor)
                        .attr('r', 5);
            
            //Legend addition
            legend.append("rect")
                        .attr("width", 12)
                        .attr("height", 12)
                        .attr("fill", currentColor);
 
            legend.append("text")
                        .attr("x", 12 + 4)
                        .attr("y", 12)
                        .text(d.country)
                        .style("font-weight", "bold")
                        .attr("fill", currentColor);
         })
         .on("mouseout", function (d) {
             scatterPlot.select(".tooltip-label").remove();
             scatterPlot.selectAll('circle')
                        .attr('r', 3);
            legend.selectAll("rect").remove();
            legend.selectAll("text").remove();
         });

    container.appendChild(scatterPlot.node());
    return scatterPlot;
 }


export function CreateInfo(data){
    const width = document.getElementById('bar-charts').offsetWidth;
    const height = 1000;

    top.SVG_W = width;
    top.SVG_H = height;

     let main = d3.select("#bar-charts");
     let Info = main.append("div").attr("id", "info").attr("width", width).attr("height", height);

     CreateTop(Info, data);
     CreatePlot(Info, data);

}
