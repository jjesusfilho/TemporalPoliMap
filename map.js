var data_obj = null;
var map_obj = null;

function change_country (ctry, year) {
	// body...
    //console.log("Current Map Object: ", map_obj);
	d3.csv('data/'+ctry+'.csv', function(error, raw_data){
		console.log(ctry);
	var selected_cty = ctry;
	var curr_year = year;
	var data = [];
    var dataQuad1 = {};
    var dataQuad2 = {};
    var dataQuad3 = {};
    var dataQuad4 = {};
	var fillKeys = ["verbal_coorporation","material_coorporation","verbal_conflict","material_conflict"];
	d3.select('#country-name').text(selected_cty+"-"+curr_year);
	
    raw_data.forEach(function (d) {
		// body...
        if (d === undefined) {return};
		if(!(d.Year in data)){
			data[d.Year] = {};
		}
		if(!(d.Target in data[d.Year])){
			data[d.Year][d.Target] = {};
            for (var i = 1; i <= 4; i++) {
                data[d.Year][d.Target][i] = {
                    'ECount':0,
                    'StdDevSources': 0,
                    'NSources': 0,
                    'MaxSources': 0,
                    'AvgSources': 0
                };
            };
		} 
		data[d.Year][d.Target][d.QuadClass] = {
			'ECount':+d.ECount,
			'StdDevSources': +d.StdDevSources,
			'NSources': +d.NSources,
			'MaxSources': +d.MaxSources,
			'AvgSources': +d.AvgSources
		};
		data[d.Year][d.Target]['fillKey'] = "defaultFill";
		max = 0.0;
		max_i = 1;
		for (var i = 1; i <=4; i++) {
			if(i in data[d.Year][d.Target] && data[d.Year][d.Target][i]['MaxSources'] > max){
				max_i = i;
				max = data[d.Year][d.Target][i]['MaxSources'];
			}
		};

        if(max_i == 1) {
            if(!(d.Year in dataQuad1)) {
                dataQuad1[d.Year] = [];
            }
            dataQuad1[d.Year].push(max);
        } else if(max_i == 2) {
            if(!(d.Year in dataQuad2)) {
                dataQuad2[d.Year] = [];
            }
            dataQuad2[d.Year].push(max);
        } else if(max_i == 3) {
            if(!(d.Year in dataQuad3)) {
                dataQuad3[d.Year] = [];
            }
            dataQuad3[d.Year].push(max);
        } else if(max_i == 4) {
            if(!(d.Year in dataQuad4)) {
                dataQuad4[d.Year] = [];
            }
            dataQuad4[d.Year].push(max);
        }

        
		data[d.Year][d.Target]['fillKey'] = fillKeys[max_i-1];
        // console.log(data[d.Year]);
	});
<<<<<<< HEAD

	var curr_data = data[curr_year]; // already based on year!!
	curr_data[selected_cty] = {fillKey: 'selected'};
=======
    data_obj = data;
    console.log("Current Data Object: ", data_obj);
	var curr_data = data[curr_year];
	curr_data[selected_cty] = {fillKey: 'selected'};    
>>>>>>> master

    Object.size = function(obj) {
        var size = 0;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    // Get the size of an object
    var size1 = Object.size(dataQuad1);

    console.log(size1); // 36 years

    function getRange(dataQuad, year) {
        var arr = dataQuad[year].sort( function(a, b) {return a - b} );
        return [arr[0], arr[arr.length-1]];
    }

    console.log(getRange(dataQuad1, curr_year));
    console.log(dataQuad1[curr_year]);


    /* var total = 0;

    for(var each in dataQuad1) {
        total += dataQuad1[each].length;
    }

    console.log(total); */

    

    function getVals (d) {
    	// body...
        if (d == null) { return ""};
    	return "<br/><em>Event Count: </em>"+d['ECount']+
			"<br/><em>#Sources: </em>"+d['NSources']+
			"<br/><em>Max Source for Events: </em>"+d['MaxSources']+
			"<br/><em>Avg Sources/Event: </em>"+d['AvgSources'];
    }
    d3.select('#container').html(""); // Clear out the container before creating a new map.
    map_obj = new Datamap({
            element: document.getElementById('container'),
            fills: {
                defaultFill: "#E5DCCC",
                verbal_conflict: "#34495E",
                verbal_coorporation: "#F1C40F",
                material_conflict: "#C0392B",
                material_coorporation: "#2ECC71",
                selected: "#00C4DD"
            },
            data: curr_data,
            geographyConfig: {
                //highlightOnHover: false,
                highlightBorderColor: "#000000",
                highlightBorderWidth: 1,
                highlightFillColor: function(geo, data) {
                    var code = geo.id;
                    if(curr_data[code] === undefined || curr_data[code]['fillKey'] === undefined){
                        return "#E5DCCC";
                    }
                    return curr_data[code]['fillKey'];
                },
                popupTemplate: function(geo, data) {
                    event_data = [];
                    event_names = ["Verbal Cooperation", "Verbal Conflict", "Material Cooperation", "Material Conflict"]
                    for (var i = 1; i <= 4 && data!= null; i++) {
                        if(i in data){
                            event_data.push("<br /><strong>"+event_names[i-1]+" Events: </strong> "+getVals(data[i]));
                        }
                    };
                    event_data = ['<div class="hoverinfo"><strong>'+geo.properties.name+'</strong>'].concat(event_data);
                    event_data = event_data.concat('</div>');
                    return event_data.join('');
                }
            }
    });;
    map_obj.legend({
        legendTitle: "Country Colors",
        defaultFillName: "No data",
        labels: {
                verbal_conflict: "Verbal Conflict",
                verbal_coorporation: "Verbal Cooperation",
                material_conflict: "Material Conflict",
                material_coorporation: "Material Cooperation",
                selected: "Selected Country"
            }
    });
    function getDomain (cd, i) {
        // body...
        var r = d3.extent(d3.values(curr_data),function(d){
            if(d === undefined){return 0;} if(!(i in d)){return 0} return d[i].MaxSources;
        });
        return r;
        //return [r[0], (r[0]+r[1])/2.0,r[1]];
    }
    function getRange (c_rgb) {
        // body...
        return ["#ffffff", d3.rgb(c_rgb)];
        //return [d3.rgb(c_rgb).brighter(5),d3.rgb(c_rgb),d3.rgb(c_rgb).darker(1)];

    }
    var vcf_scale = d3.scale.linear()
        .domain(getDomain(curr_data,3)).range(getRange("#34495E")); // Visual Conflict range
    var vcp_scale = d3.scale.linear()
        .domain(getDomain(curr_data,1)).range(getRange("#F1C40F")); // Visual Cooperation range
    var mcp_scale = d3.scale.linear()
        .domain(getDomain(curr_data,2)).range(getRange("#2ECC71")); // Material Cooperation range
    var mcf_scale = d3.scale.linear()
        .domain(getDomain(curr_data,4)).range(getRange("#C0392B")); // Material Conflict range
    var color_scales = [vcp_scale,mcp_scale,vcf_scale,mcf_scale]
    var curr_data_arr = d3.entries(curr_data);
    var color_data = [{},{},{},{}];
    for (var i = curr_data_arr.length - 1; i >= 0; i--) {
        for (var j = 1; j <= 4; j++) {
            if(curr_data_arr[i].value['fillKey'] == fillKeys[j-1]){
                color_data[j-1][curr_data_arr[i].key] = color_scales[j-1](curr_data_arr[i].value[j].MaxSources);
                //console.log("Deleted Key for: ", curr_data_arr[i]);
            }
        };
    };
    for (var i = 0; i < 4; i++) {
        map_obj.updateChoropleth(color_data[i]);
    };
    });
}

