import { process_country_info, feature_code_to_value, 
    geo_to_dataset_country_names, filterCities} from "./data_process.js";


export function CreateMap(geo, cities, dataset){
    // Set up the map dimensions
    const width = document.getElementById('global-map').offsetWidth;
    const height = document.getElementById('global-map').offsetHeight;

    let main = d3.select("#global-map");
    let Map = main.append("svg")
                  .attr("id", "map")
                  .attr("width", width)
                  .attr("height", height - 100);

    const projection = d3.geoIdentity()
                        .reflectY(true)
                        .fitSize([width, height-100], geo);
    const pathGenerator = d3.geoPath().projection(projection);

    const zoom = d3.zoom()
    .scaleExtent([1, 8]) 
    .on("zoom", zoomed);

    function zoomed(event) {
        mapGroup.attr("transform", event.transform);
    }
    
    // Create a group for the map features
    const mapGroup = Map.append("g")
                        // .attr("transform", "translate(0, -500)")
                        .attr("width", width)
                        .attr("height", height - 100);

    // Bind the GeoJSON data to the path elements and draw them
    mapGroup.selectAll("path")
      .data(geo.features)
      .enter()
      .append("path")
      .attr("d", pathGenerator)
      .attr("class", 'global-map-country')
      .style("fill", "darkcyan") 
      .style("background", 'black')
      .style("stroke", "white")
      .style("stroke-width", "0.25");

    mapGroup.call(zoom);
    mapGroup.on("wheel.zoom", null); 

    // 
    // MouseOver MouseOut Click 
    // 

    let country_color = 'darkcyan';
    mapGroup.selectAll("path")
      .on("mouseover", function (event, d) {
        country_color = d3.color(d3.select(this).style("fill"));
        d3.select(this)
        .style("fill", 'orange');
        
        // POP-UP
        if (selected_feature !== undefined){
            let dataset_country_name = geo_to_dataset[d.properties.admin];
            if (!(dataset_country_name === 'NoData') ){
                let v = countries_data[dataset_country_name][selected_feature].toFixed(2);
                if (! (typeof v === 'undefined')){
                    document.addEventListener('mousemove', function (event) {
                        d3.select("#global-map-popup")
                        .style("top", `${event.clientY}px`)
                        .style("left", `${event.clientX - 200}px`);
                      });
                    d3.select("#global-map-popup-content")
                      .text(`In ${dataset_country_name} it costs ${v}`);
                    d3.select("#global-map-popup")
                    .style("display", "block");
                }   
            }
        }
      })    
      .on("mouseout", function (event, d) {
        d3.select(this)
          .style("fill", country_color.toString());
        d3.select("#global-map-popup")
          .style("display", "none");    
            
      })
      .on("click", function (event, d) {
        d3.select(this)
            .style("fill", "green"); 
            // selectedCountry, geo, world_cities, dataset
            updateCountryMap(d, geo, cities, dataset);
            d3.selectAll("#country-bar").remove();
            selectedCountryInfo(d);

           // d3.selectAll("#country-bar").html("");
      });

    //   Buttons
    main.append('div')
                .attr("id", "global-map-bttns")
                .style("display", "flex")
                .style("justify-content", 'space-between')
                .style("padding-left", `${width / 8}px`)
                .style("padding-right", "100px");

    d3.select("#global-map-bttns").append('div')
                    .attr("id", "zoom-map-bttns")
                    .style("display", "flex")
                    .style("flex-direction", "column");

    d3.select("#zoom-map-bttns").append("a")
                                .attr("class", "waves-effect waves-light btn")
                                .text("+")
                                .attr("transform", "translate(0,0)")
                                .on("click", function() {
                                    mapGroup.transition().call(zoom.scaleBy, 1.2);
                                });

    d3.select("#zoom-map-bttns").append("a")
                                .attr("class", "waves-effect waves-light btn")
                                .text("-")
                                .attr("transform", "translate(0,0)")
                                .on("click", function() {
                                    mapGroup.transition().call(zoom.scaleBy, 0.8);
                                });
    d3.select("#global-map-bttns")
        .append("svg")
        .attr("id", "bar-svg")
        .style("display", "none");
                    

        // Select form 
    // let selectContainer = bttns.append("div")
    //                             .attr("class", "input-field")
    //                             .attr("id", "global-map-select-container");

    d3.select("#global-map-bttns").append("select")
                            .attr("name", "global-map-select")
                            .attr("id", "global-map-select");
    d3.select("#global-map-select").append("option")
            .attr('value', '')
            .attr('disabled', true)
            .attr('selected', true)
            .text('Choose feature');
    
    let options = [{'value': -1, 'text':''}];
    let feature_keys = Object.keys(feature_code_to_value);
    for (let i = 0; i < feature_keys.length; i++) {
        let opt = {
          value: i,
          text: feature_code_to_value[feature_keys[i]],
        };
        options.push(opt);
      }

    d3.select("#global-map-select").selectAll('option')
        .data(options)
        .enter()
        .append('option')
        .attr('value', d => d.value)
        .text(d => d.text); 

    let elem_select = document.getElementById('global-map-select');
    let instance_select = M.FormSelect.init(elem_select, '');
    
    let countries_data = process_country_info(dataset);
    let countries_list = Object.keys(countries_data);
    let geo_to_dataset = geo_to_dataset_country_names(geo.features, dataset);
    
    //  Update map
    let selected_feature; //needed outside the scope to access in mouseover popup
    d3.select("#global-map-select")
    .on("change", function(){
        // console.log(instance_select.getSelectedValues());
        let selected_value = parseInt(d3.select(this).property("value"));
        selected_feature = options[selected_value + 1].text;
        let min_val = d3.min(countries_list, d => countries_data[d][selected_feature]);
        let max_val = d3.max(countries_list, d => countries_data[d][selected_feature]);
        let log_scaler = d3.scaleLog()
                            .domain([min_val, max_val]);
        let scaler = d3.scaleSequential(d3.interpolateViridis).domain([
            log_scaler(min_val),
            log_scaler(max_val)
        ]);
        mapGroup.selectAll("path")
                .style("fill", function(d) {
                let dataset_country = geo_to_dataset[d.properties.admin];
                if (dataset_country === 'NoData'){
                    return 'grey';
                }
                let v = countries_data[dataset_country][selected_feature];
                if (typeof v === 'undefined'){
                    return 'gray';
                }
                return scaler(log_scaler(v)).toString();
                });

        // Scale bar

        const numberOfSteps = 8; 
        const step = (max_val - min_val) / numberOfSteps;

        const legendValues = Array.from({length: numberOfSteps + 1},
                                         (_, i) => max_val - i * step);

        let bar = d3.select("#bar-svg").style("display", "block");
        bar.selectAll("rect")
        .data(legendValues)
        .join(
            enter => (
                enter.append("rect")
                .attr("x", 20)
                .attr("y", (d, i) => i * 15)
                .attr("width", 50)
                .attr("height", 15)
                .attr("fill", d => scaler(log_scaler(d)))
            ),
            update => (
                update.call(
                    update => {
                        update.attr("fill", d => scaler(log_scaler(d)));
                    }
                )
            ),
            exit => (
                exit.remove()
            )
        );
        bar.selectAll("text")
        .data(legendValues)
        .join(
            enter => (
                enter.append("text")
                .attr("x", 95)
                .attr("y", (d, i) => i * 15 + 15)
                .attr("text-anchor", "middle")
                .text((d, i) => {
                        if (i % 2 == 0){
                            return d.toFixed(1)
                        } else {return ''}})
            ),
            update => (
                update.call(
                    update => {
                        update.text((d, i) => {
                                        if (i % 2 == 0){
                                            return d.toFixed(1)
                                        } else {return ''}});
                    }
                )
            ),
            exit => (
                exit.remove()
            )
        );                 
    }); 
};









export function CreateCountryMap(geo, world_cities, dataset){

    const width = document.getElementById('global-map').offsetWidth;
    const height = document.getElementById('global-map').offsetHeight;

    let country_vis = d3.select("#selected-country-map").append("div")
                  .attr("id", "country-vis")
                  .attr("width", width)
                  .attr("height", height - 100)
                  .style("display", "flex")
                  .style("flex-direction", "column-reverse");
                //   .style("margin-top", "50px");

    geo.features = geo.features.filter(d => d.properties.name == "France");
    world_cities.features = world_cities.features.filter(d => d.properties.cou_name_en == "France");
        
    let first_feat = geo.features[0].geometry;
    first_feat.coordinates = first_feat.coordinates.slice(0, 3);


    const country_projection = d3.geoIdentity()
                                .reflectY(true)
                                .fitSize([width/2, height-300], geo);
    const pathGenerator = d3.geoPath().projection(country_projection);

    const city_projection = d3.geoIdentity()
                                .reflectY(true)
                                .fitSize([width/2, height-300], world_cities);
    const cityPathGenerator = d3.geoPath().projection(city_projection);


    let svg = d3.select("#country-vis").append("svg")
            .attr("id", "country-map")
            .attr("width", width/2)
            .attr("height", height - 300);

        // Filter cities here to keep initial scale
    world_cities.features = filterCities('France', dataset, world_cities.features);
    d3.select("#country-map").append("g").attr("id", "coutry-map-group")
            .selectAll("path")
            .data(geo.features)
            .enter()
            .append("path")
            .attr("d", pathGenerator)
            .style("fill", "darkcyan") 
            .style("stroke", "none");

    d3.select("#country-map").append("g").attr("id", "city-map-group")
            .selectAll("path")
            .data(world_cities.features)
            .enter()
            .append("path")
            .attr("d", cityPathGenerator)
            .attr("name", (d) => d.properties.name)
            .attr("fill", "blueviolet")
            .style("stroke", "white")
            .style("stroke-width", "0.25");
    // draw_country_city_maps(geo.features, world_cities.features,
    //     pathGenerator, cityPathGenerator);
    
    const zoom = d3.zoom()
    .scaleExtent([1, 2]) 
    .on("zoom", zoomed);

    function zoomed(event) {
        d3.select("#country-map-group").attr("transform", event.transform);
        d3.select("#city-map-group").attr("transform", event.transform);
    }


    // Hover 

    country_vis.append("p").attr("id", "city-name")
                            .style("display", "none")
                            .style("position", "absolute")
                            .style("translate", "150px 0px");
    let city_color;
    d3.select("#city-map-group").selectAll("path")
      .on("mouseover", function (event, d) {
        city_color = d3.color(d3.select(this).style("fill"));
        d3.select(this).style("fill", 'orange');
        
        d3.select("#city-name")
            .style("display", "block")
            .text(`${d3.select(this).attr("name")}`);
      })    
      .on("mouseout", function (event, d) {
        d3.select(this)
          .style("fill", city_color.toString());
        d3.select("#city-name")
          .style("display", "none");    
            
      });


    //   Buttons

    country_vis.append('div')
                .attr("id", "country-map-bttns")
                .style("display", "flex")
                .style("justify-content", 'space-between')
                .style("padding-left", `${width / 8}px`)
                .style("padding-right", "100px");

    d3.select("#country-map-bttns").append('div')
                    .attr("id", "zoom-country-bttns")
                    .style("display", "flex")
                    .style("flex-direction", "column");

    d3.select("#zoom-country-bttns").append("a")
                                .attr("class", "waves-effect waves-light btn")
                                .text("+")
                                .attr("transform", "translate(0,0)")
                                .on("click", function() {
                                    d3.select("#country-map-group").transition().call(zoom.scaleBy, 1.2);
                                    d3.select("#city-map-group").transition().call(zoom.scaleBy, 1.2);
                                });

    d3.select("#zoom-country-bttns").append("a")
                                .attr("class", "waves-effect waves-light btn")
                                .text("-")
                                .attr("transform", "translate(0,0)")
                                .on("click", function() {
                                    d3.select("#country-map-group").transition().call(zoom.scaleBy, 0.8);
                                    d3.select("#city-map-group").transition().call(zoom.scaleBy, 0.8);
                                });
};





// Selected Country INFO 


export function selectedCountryInfo(selected_country){
    const width = document.getElementById('global-map').offsetWidth;
    const height = document.getElementById('global-map').offsetHeight;
    let selectedCountry;
    if (typeof selected_country === 'string'){
        selectedCountry = selected_country;
    } else {
        selectedCountry = selected_country.properties.name;
    }
    d3.selectAll("#selected-country-map").selectAll("text").html("");
    d3.select("#selected-country-map").append("text")
            .attr("x", width /2) 
            .attr("y", 20)  
            .text(selectedCountry)
            .style("font-size", "30px")  
            .style("fill", "black")
            .style("position", "absolute")
            .style("top", "700px")
            .style("left", '40%'); 

    Promise.all([
        d3.json("data/custom.geo.json"),
        d3.csv("data/cost-of-living.csv"),
        d3.json("data/world.geojson")
        ])
        .then(function(data) {
            let geo = data[0];
            let dataset = data[1];
            let world_cities = data[2];

            d3.selectAll("#country-div").remove();

            let country_vis = d3.select("#selected-country-map");//.append("div");
            //Select Feature
            const selectContainer = country_vis.append("div")
                                            .attr("name", "country-div")
                                            .attr("id", "country-div")
                                            .attr("class", "dropdown-container")
                                            .style("margin-top", "50px");

            selectContainer.append("label")
                            .attr("for", "country-select")
                            .text("Choose top feature");
            
            const countryselect = selectContainer.append("select")
                                    .attr("name", "country-select")
                                    .attr("id", "country-select");

            countryselect.append("option")
                    .attr('value', '')
                    .attr('disabled', true)
                    .attr('selected', true)
                    .text('Choose feature');

            let options = [{'value': -1, 'text':''}];
            let feature_keys = Object.keys(feature_code_to_value);
            for (let i = 0; i < feature_keys.length; i++) {
                let opt = {
                value: i,
                text: feature_code_to_value[feature_keys[i]],
                };
                options.push(opt);
            }

            countryselect.selectAll('option')
            .data(options)
            .enter()
            .append('option')
            .attr('value', d => d.value)
            .text(d => d.text); 

            let elem_select = document.getElementById('country-select');
            M.FormSelect.init(elem_select, '');

            //Barchart Container
            let bar = country_vis.append("div")
                                .style("display", "flex")
                                .attr("name", "country-bar")
                                .attr("id", "country-bar")
                                .style("position", "relative")
                                //.style("flex-direction", "column-reverse")
                                .style("margin-top", "100px");

            const barChartContainer = bar
            .append("foreignObject")
            .attr("width", width / 2)
            .attr("height", height)
            .append("xhtml:div")
            .style("display", "block")
            .attr("id", "CountryBarChartContainer");

            const barChartContainerSelection = d3.select(barChartContainer);

            // Events
            countryselect.on("change", function () {
                
                barChartContainer.html("");
                //createCountryBarChart(barChartContainer.node(), data, selectedOption, selectedCountry);

                const barChart = d3.create('svg')
                                    .attr('width',width / 2 )
                                    .attr('height', height/2)
                                    .style("opacity", 1);

                let selected_value = parseInt(d3.select(this).property("value"));
                let selected_feature = options[selected_value + 1].text;


                const chartGroup = barChart.append("g").attr('width', width/2).attr('height', height/2)
                                            .attr('transform', 'translate(50, 50)');

                const filteredCities = dataset.filter(city => city.country === selectedCountry);

                const sortedData = filteredCities.sort((a, b) => b['x'+selected_value] - a['x'+selected_value]).slice(0,10);
                console.log(sortedData);
                //Scales for the barchart
                const xScale = d3.scaleBand()
                    .domain(sortedData.map(d => d.city))
                    .range([0, width/2 - 100])
                    .padding(0.1);

                console.log(sortedData[0]['x'+selected_value]);

                const yScale = d3.scaleLinear()
                    .domain([0, sortedData[0]['x'+selected_value]])
                    .range([(height / 2 - 100), 0]);

                //Barcharts
                chartGroup.selectAll('rect')
                    .data(sortedData)
                    .enter().append('rect')
                    .attr('x', d => xScale(d['city']))
                    .attr('y', d => yScale(d['x'+selected_value]))
                    .attr('width', xScale.bandwidth())
                    .attr('height', d => (height / 2 - 100) - yScale(d['x'+selected_value]))
                    .attr('fill', 'lightblue')
                    .style("opacity", 1);

                //Labels
                chartGroup.selectAll('text.bar-label')
                    .data(sortedData)
                    .enter()
                    .append('text')
                    .attr('class', 'bar-label')
                    .text(d => d['x'+selected_value]) 
                    .attr('x', d => xScale(d['city']) + xScale.bandwidth()/2)
                    .attr('y', d => yScale(d['x'+selected_value]) - 5) 
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
                    .attr('y', (height / 2 - 75))
                    .attr('text-anchor', 'middle')
                    .attr('transform', (d) => `rotate(-15 ${xScale(d.city) + xScale.bandwidth() / 2},${(height / 2 - 75)})`);

                    barChartContainer.append(() => barChart.node());
            });
    });
};


function draw_country_city_maps(geo_features, world_cities_features,
    pathGenerator, cityPathGenerator){

    d3.select("#country-map-group")
        .selectAll("path")
        .data(geo_features)
        .join(
            enter => (
                enter.append("path")
                .attr("d", pathGenerator)
                .style("fill", "darkcyan") 
                .style("stroke", "none")
            ),
            update => (
                update.call(
                    update => {
                        
                    }
                )
            ),
            exit => (
                exit.remove()
            )
        );



    // d3.select("#country-map").append("g").attr("id", "coutry-map-group")
    //         .selectAll("path")
    //         .data(geo_features)
    //         .enter()
    //         .append("path")
    //         .attr("d", pathGenerator)
    //         .style("fill", "darkcyan") 
    //         .style("stroke", "none");

    // d3.select("#country-map").append("g").attr("id", "city-map-group")
    //         .selectAll("path")
    //         .data(world_cities_features)
    //         .enter()
    //         .append("path")
    //         .attr("d", cityPathGenerator)
    //         .attr("name", (d) => d.properties.name)
    //         .attr("fill", "blueviolet")
    //         .style("stroke", "white")
    //         .style("stroke-width", "0.25");
};










function updateCountryMap(selectedCountry, _geo, _world_cities, _dataset) {
    Promise.all([
        d3.json("data/custom.geo.json"),
        d3.csv("data/cost-of-living.csv"),
        d3.json("data/world.geojson")
      ])
        .then(function(data) {
            let geo = data[0];
            let dataset = data[1];
            let world_cities = data[2];

            const selectedCountryName = selectedCountry.properties.name;

            const width = document.getElementById('global-map').offsetWidth;
            const height = document.getElementById('global-map').offsetHeight;
            console.log(geo);
            geo.features = geo.features.filter(d => d.properties.name === selectedCountryName);
            console.log(geo);
            world_cities.features = world_cities.features.filter(d => d.properties.cou_name_en === selectedCountryName);
                
            //Filter geojson to get rid of small or distant country parts

            // let first_feat = geo.features[0].geometry;
            // const maxIndex = first_feat.coordinates.reduce((maxIndex, currentArray, currentIndex, array) => {
            //     return currentArray.length > array[maxIndex].length ? currentIndex : maxIndex;
            // }, 0);
            // const minIndex = first_feat.coordinates.reduce((minIndex, currentArray, currentIndex, array) => {
            //     if (currentArray.length < array[minIndex].length) {
            //       return currentIndex;
            //     } else {
            //       return minIndex;
            //     }
            //   }, 0);
            
            // console.log(first_feat.coordinates);
            // console.log(maxIndex);
            // console.log(minIndex);
            // first_feat.coordinates = first_feat.coordinates.slice(maxIndex, minIndex);
            


            const country_projection = d3.geoIdentity()
                                        .reflectY(true)
                                        .fitSize([width/2, height-300], geo);
            const pathGenerator = d3.geoPath().projection(country_projection);

            const city_projection = d3.geoIdentity()
                                        .reflectY(true)
                                        .fitSize([width/2, height-300], world_cities);
            const cityPathGenerator = d3.geoPath().projection(city_projection);

                // Filter cities here to keep initial scale
            world_cities.features = filterCities(selectedCountryName, dataset, world_cities.features);
            let countryMapElement = d3.select("#country-map").html('');
            countryMapElement.select("#country-map-group").remove();
            countryMapElement.select("#city-map-group").remove();


            countryMapElement.append("g").attr("id", "country-map-group")
                    .selectAll("path")
                    .data(geo.features)
                    .enter()
                    .append("path")
                    .attr("d", pathGenerator)
                    .style("fill", "darkcyan") 
                    .style("stroke", "none");

            countryMapElement.append("g").attr("id", "city-map-group")
                    .selectAll("path")
                    .data(world_cities.features)
                    .enter()
                    .append("path")
                    .attr("d", cityPathGenerator)
                    .attr("name", (d) => d.properties.name)
                    .attr("fill", "blueviolet")
                    .style("stroke", "white")
                    .style("stroke-width", "0.25");


                    let city_color;
                    d3.select("#city-map-group").selectAll("path")
                    .on("mouseover", function (event, d) {
                    city_color = d3.color(d3.select(this).style("fill"));
                    d3.select(this).style("fill", 'orange');

                    d3.select("#city-name")
                        .style("display", "block")
                        .text(`${d3.select(this).attr("name")}`);
                    })    
                    .on("mouseout", function (event, d) {
                    d3.select(this)
                    .style("fill", city_color.toString());
                    d3.select("#city-name")
                    .style("display", "none");    
                        
                    });
        }).catch(function (error) { console.log(error) });

};
