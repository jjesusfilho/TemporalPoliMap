d3.csv('data/IND.csv', function(error, raw_data){
	var selected_cty = "IND";
	var data = [];
	var fillKeys = ["verbal_coorporation","material_coorporation","verbal_conflict","material_conflict"];
	raw_data.forEach(function (d) {
		// body...
		if(!(d.Year in data)){
			data[d.Year] = {};
		}
		if(!(d.Target in data[d.Year])){
			data[d.Year][d.Target] = {};
		} 
		data[d.Year][d.Target][d.QuadClass] = {
			'ECount':+d.ECount,
			'StdDevSources': +d.StdDevSources,
			'NSources': +d.NSources,
			'AvgSources': +d.AvgSources
		};
		data[d.Year][d.Target]['fillKey'] = "defaultFill";
		max = 0.0;
		max_i = 1;
		for (var i = 1; i <=4; i++) {
			if(i in data[d.Year][d.Target] && data[d.Year][d.Target][i]['AvgSources'] > max){
				max_i = i;
				max = data[d.Year][d.Target][i]['AvgSources'];
			}
		};
		data[d.Year][d.Target]['fillKey'] = fillKeys[max_i-1];
	});
	var curr_data = data['1987'];
	curr_data[selected_cty] = {fillKey: 'selected'};
	var map = new Datamap({element: document.getElementById('container'),
            fills: {
                defaultFill: "#E5DCCC",
                verbal_conflict: "#34495E",
                verbal_coorporation: "#F1C40F",
                material_conflict: "#C0392B",
                material_coorporation: "#2ECC71",
                selected: "#7F8C8D"
             },
             data: curr_data,
              geographyConfig: {
            	popupTemplate: function(geo, data) {
                	return ['<div class="hoverinfo"><strong>'+geo.properties.name+'</strong>',
                        '<br /># Verbal Cooperation Events: ' + JSON.stringify(data[1]),
                        '<br /># Verbal Conflict Events: ' + JSON.stringify(data[2]),
                        '<br /># Material Cooperation Events: ' + JSON.stringify(data[3]),
                        '<br /># Material Conflict Events: ' + JSON.stringify(data[4]),
                        '</div>'].join('');
            	}
        	 }
         });
	map.legend();

});