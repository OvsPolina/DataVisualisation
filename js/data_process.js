export const feature_code_to_value = {
    x1: "Meal, Inexpensive Restaurant (USD)",
    x2: "Meal for 2 People, Mid-range Restaurant, Three-course (USD)",
    x3: "McMeal at McDonalds (or Equivalent Combo Meal) (USD)",
    x4: "Domestic Beer (0.5 liter draught, in restaurants) (USD)",
    x5: "Imported Beer (0.33 liter bottle, in restaurants) (USD)",
    x6: "Cappuccino (regular, in restaurants) (USD)",
    x7: "Coke/Pepsi (0.33 liter bottle, in restaurants) (USD)",
    x8: "Water (0.33 liter bottle, in restaurants) (USD)",
    x9: "Milk (regular), (1 liter) (USD)",
    x10: "Loaf of Fresh White Bread (500g) (USD)",
    x11: "Rice (white), (1kg) (USD)",
    x12: "Eggs (regular) (12) (USD)",
    x13: "Local Cheese (1kg) (USD)",
    x14: "Chicken Fillets (1kg) (USD)",
    x15: "Beef Round (1kg) (or Equivalent Back Leg Red Meat) (USD)",
    x16: "Apples (1kg) (USD)",
    x17: "Banana (1kg) (USD)",
    x18: "Oranges (1kg) (USD)",
    x19: "Tomato (1kg) (USD)",
    x20: "Potato (1kg) (USD)",
    x21: "Onion (1kg) (USD)",
    x22: "Lettuce (1 head) (USD)",
    x23: "Water (1.5 liter bottle, at the market) (USD)",
    x24: "Bottle of Wine (Mid-Range, at the market) (USD)",
    x25: "Domestic Beer (0.5 liter bottle, at the market) (USD)",
    x26: "Imported Beer (0.33 liter bottle, at the market) (USD)",
    x27: "Cigarettes 20 Pack (Marlboro) (USD)",
    x28: "One-way Ticket (Local Transport) (USD)",
    x29: "Monthly Pass (Regular Price) (USD)",
    x30: "Taxi Start (Normal Tariff) (USD)",
    x31: "Taxi 1km (Normal Tariff) (USD)",
    x32: "Taxi 1hour Waiting (Normal Tariff) (USD)",
    x33: "Gasoline (1 liter) (USD)",
    x34: "Volkswagen Golf 1.4 90 KW Trendline (Or Equivalent New Car) (USD)",
    x35: "Toyota Corolla Sedan 1.6l 97kW Comfort (Or Equivalent New Car) (USD)",
    x36: "Basic (Electricity, Heating, Cooling, Water, Garbage) for 85m2 Apartment (USD)",
    x37: "1 min. of Prepaid Mobile Tariff Local (No Discounts or Plans) (USD)",
    x38: "Internet (60 Mbps or More, Unlimited Data, Cable/ADSL) (USD)",
    x39: "Fitness Club, Monthly Fee for 1 Adult (USD)",
    x40: "Tennis Court Rent (1 Hour on Weekend) (USD)",
    x41: "Cinema, International Release, 1 Seat (USD)",
    x42: "Preschool (or Kindergarten), Full Day, Private, Monthly for 1 Child (USD)",
    x43: "International Primary School, Yearly for 1 Child (USD)",
    x44: "1 Pair of Jeans (Levis 501 Or Similar) (USD)",
    x45: "1 Summer Dress in a Chain Store (Zara, H&M, …) (USD)",
    x46: "1 Pair of Nike Running Shoes (Mid-Range) (USD)",
    x47: "1 Pair of Men Leather Business Shoes (USD)",
    x48: "Apartment (1 bedroom) in City Centre (USD)",
    x49: "Apartment (1 bedroom) Outside of Centre (USD)",
    x50: "Apartment (3 bedrooms) in City Centre (USD)",
    x51: "Apartment (3 bedrooms) Outside of Centre (USD)",
    x52: "Price per Square Meter to Buy Apartment in City Centre (USD)",
    x53: "Price per Square Meter to Buy Apartment Outside of Centre (USD)",
    x54: "Average Monthly Net Salary (After Tax) (USD)",
    x55: "Mortgage Interest Rate in Percentages (%), Yearly, for 20 Years Fixed-Rate"
  };


export function process_country_info(cities_data){
    // Aggregates (takes a mean by cities) information 
    // about countries and renames features 
    
    let countries_info = {};
    let counter = {};
    cities_data.forEach(city => {
        let curr_country = city.country;
        
        if (curr_country in countries_info){
            for (const key in city){
                if (key in feature_code_to_value && city[key] != '' && parseFloat(city[key]) > 0){
                    let curr_feature = feature_code_to_value[key];
                    if (curr_feature in countries_info[curr_country]){
                        countries_info[curr_country][curr_feature] += parseFloat(city[key]);
                    } else {
                        countries_info[curr_country][curr_feature] = parseFloat(city[key]);
                    }
                    counter = _update_counter(counter, curr_country, curr_feature);
                };
            };
        } else {
            let current_country_info = {};
            for (const key in city){
                if (key in feature_code_to_value && city[key] != '' && parseFloat(city[key]) > 0){
                    let curr_feature = feature_code_to_value[key];
                    current_country_info[curr_feature] = parseFloat(city[key]);
                    counter = _update_counter(counter, curr_country, curr_feature);
                };
            };
            countries_info[curr_country] = current_country_info;
        };

        // if (current_country in country_cities_count){
        //     country_cities_count[current_country] += 1;
        // } else {
        //     country_cities_count[current_country] = 1;
        // };
    });
    for(const country_key in countries_info){
        for (const key in countries_info[country_key]){
            // countries_info[country_key][key] /= country_cities_count[country_key];
            countries_info[country_key][key] /= counter[country_key][key];
        };
    };

    return countries_info;
};

function _update_counter(counter, country, feature){
    if (country in counter && feature in counter[country]){
        counter[country][feature] += 1
    } else if (country in counter){
        counter[country][feature] = 1
    } else {
        counter[country] = {}
        counter[country][feature] = 1
    };
    return counter;
};


export function geo_to_dataset_country_names(geo_set, dataset){
    let geo_names = geo_set.map(c => c.properties.admin);
    let dataset_names = dataset.map(o => o.country);
    let lower_case_dataset = {};
    dataset_names.forEach(n =>{
        lower_case_dataset[n.toLowerCase()] = n;
    });
    let geo_to_dataset = {};
    geo_names.forEach(name => {
        if (!(name in Object.keys(geo_to_dataset))){
            if (Object.keys(lower_case_dataset).includes(name.toLowerCase())){
                geo_to_dataset[name] = lower_case_dataset[name.toLowerCase()];
            } else {
                geo_to_dataset[name] = 'NoData';
            }
        }
    });
    // Exceptions 
    geo_to_dataset['United States of America'] = 'United States';
    geo_to_dataset['Republic of Serbia'] = 'Serbia';
    geo_to_dataset['Vatican'] = 'Vatican City';
    return geo_to_dataset;
};


export function filterCities(country, dataset, geo_cities_features){
    let dataset_country = dataset.filter(c => c.country === country);

    let dataset_cities = dataset_country.map(c => c.city);

    return geo_cities_features.filter(d => dataset_cities.includes(d.properties.name));
};