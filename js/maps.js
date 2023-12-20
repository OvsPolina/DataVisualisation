import { process_country_info, feature_code_to_value, geo_to_dataset_country_names} from "./data_process.js";


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
      .style("fill", "red") 
      .style("background", 'black')
      .style("stroke", "white");

    mapGroup.call(zoom);
    mapGroup.on("wheel.zoom", null); 

    mapGroup.selectAll("path")
      .on("mouseover", function (event, d) {
          d3.select(this)
              .style("fill", "orange"); 
      })
      .on("mouseout", function (event, d) {
          d3.select(this)
              .style("fill", "red"); 
      })
      .on("click", function (event, d) {
        d3.select(this)
            .style("fill", "green"); 
        updateCountryMap(d, cities);
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

    d3.select("#global-map-select")
    .on("change", function(){
        // console.log(instance_select.getSelectedValues());
        let selected_value = parseInt(d3.select(this).property("value"));
        let selected_feature = options[selected_value + 1].text;
        let log_scaler = d3.scaleLog()
                            .domain([
                                d3.min(countries_list, d => countries_data[d][selected_feature]),
                                d3.max(countries_list, d => countries_data[d][selected_feature])
                            ]);
        let scaler = d3.scaleSequential(d3.interpolateViridis).domain([
            log_scaler(d3.min(countries_list, d => countries_data[d][selected_feature])),
            log_scaler(d3.max(countries_list, d => countries_data[d][selected_feature]))
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
    }); 
    
    


};



// function CreateCountryMap(map){
//     let main = d3.select("#country").style("display", "inline-block");

//     let CountryMap = main.append("svg").attr("id", "country-map").attr("width", ctx.SVG_W/2).attr("height", ctx.SVG_H/2);

//     const projection = d3.geoIdentity().reflectY(true).fitSize([ctx.SVG_W/2, ctx.SVG_H/2], map);
//     const pathGenerator = d3.geoPath().projection(projection);
    
//     // Create a group for the map features
//     const cmapGroup = CountryMap.append("g")
//                         .attr("transform", "translate(0, 0)")
//                         .attr("id", "city-markers")
//                         .attr("width", ctx.SVG_W/2)
//                         .attr("height", ctx.SVG_H/2);

//     // Bind the GeoJSON data to the path elements and draw them
//     cmapGroup.selectAll("path")
//       .data(map.features)
//       .enter()
//       .append("path")
//       .attr("d", pathGenerator)
//       .style("fill", "red") // Set a fill color
//       .style("background", 'black')
//       .style("stroke", "white");

//     cmapGroup.selectAll("path")
//       .on("mouseover", function (event, d) {
//           d3.select(this)
//               .style("fill", "orange"); // Измените цвет подсветки по своему выбору
//       })
//       .on("mouseout", function (event, d) {
//           d3.select(this)
//               .style("fill", "lightblue"); // Возвращение оригинального цвета
//       });
// }


// function updateCountryMap(selectedCountry, cities) {
//     const selectedCountryId = selectedCountry.properties.geoname_id;

//     console.log(selectedCountry.properties.name);

//     // Assuming your city data is named 'cityData' and is in GeoJSON format
//     const filteredCities = cities.features.filter(city => city.properties.cou_name_en === selectedCountry.properties.name);
//     console.log(filteredCities);
//     // Customize the display of filteredCities as needed
//     const countryMapElement = d3.select("#country-map");
//     countryMapElement.html("");
//     countryMapElement.append("h2").text(selectedCountry.properties.name);
//     console.log(countryMapElement.node());

//     // Remove existing city markers
//     countryMapElement.select("#city-markers").remove();

//     // Create a new group for city markers
//     const cityMarkers = countryMapElement.append("g").attr("id", "city-markers");

//     // Create a projection for the map
//     const projection = d3.geoIdentity().reflectY(true).fitSize([ctx.SVG_W / 2, ctx.SVG_H / 2], selectedCountry);
//     const pathGenerator = d3.geoPath().projection(projection);

//     // Draw the map for the selected country
//     /*const cmapGroup = countryMapElement.append("g")
//         .attr("transform", "translate(0, 0)")
//         .attr("width", ctx.SVG_W / 2)
//         .attr("height", ctx.SVG_H / 2);*/

//     const cmapGroup = cityMarkers.selectAll("path")
//         .data(filteredCities)  // Pass only the selected country to the data
//         .enter()
//         .append("path")
//         .attr("d", pathGenerator)
//         .style("fill", "red") // Set a fill color
//         .style("background", 'black')
//         .style("stroke", "white");

//     // Bind the GeoJSON data to the path elements and draw them
//     /*cmapGroup.selectAll("path")
//         .data(filteredCities.properties)  // Передаем только выбранную страну в данные
//         .enter()
//         .append("path")
//         .attr("d", pathGenerator)
//         .style("fill", "orange") // Set a fill color
//         .style("background", 'black')
//         .style("stroke", "white");*/

// }
