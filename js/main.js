const ctx = {
    SVG_W: 1000,
    SVG_H: 1000,
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
};

import { CreateMap } from "./maps.js";
import { CreateInfo} from "./barchart.js";


function loadData() {
    Promise.all([
        d3.json("data/custom.geo.json"),
        d3.csv("data/cost-of-living.csv"),
        d3.json("data/world.geojson")
      ])
        .then(function(data) {
            console.log('data loaded')
            CreateMap(data[0], data[2], data[1]);
            // CreateCountryMap(data[2]);
            CreateInfo(data[1]);

            // d3.selectAll("global-map").call(zoom);

        }).catch(function (error) { console.log(error) });
};

function createViz() {
    console.log("Using D3 v" + d3.version);
    loadData();
};

window.createViz = createViz;

