function change_country (ctry, year) {
	// body...
	d3.csv('data/'+ctry+'.csv', function(error, raw_data){
		console.log(ctry);
	var selected_cty = ctry;
	var curr_year = year;
	var data = [];
	var fillKeys = ["verbal_coorporation","material_coorporation","verbal_conflict","material_conflict"];
	d3.select('#country-name').text(selected_cty+"-"+curr_year);
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
		data[d.Year][d.Target]['fillKey'] = fillKeys[max_i-1];
	});
	var curr_data = data[curr_year];
	curr_data[selected_cty] = {fillKey: 'selected'};

    function getVals (d) {
    	// body...
    	return "<br/><em>Event Count: </em>"+d['ECount']+
			"<br/><em>#Sources: </em>"+d['NSources']+
			"<br/><em>Max Source for Events: </em>"+d['MaxSources']+
			"<br/><em>Avg Sources/Event: </em>"+d['AvgSources'];
    }

	var map = new Datamap({element: document.getElementById('container'),
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
                    return curr_data[code]['fillKey'];
                },
            	popupTemplate: function(geo, data) {
            		event_data = [];
            		event_names = ["Verbal Cooperation", "Verbal Conflict", "Material Cooperation", "Material Conflict"]
            		for (var i = 1; i <= 4; i++) {
            			if(i in data){
            				event_data.push("<br /><strong>"+event_names[i-1]+" Events: </strong> "+getVals(data[i]));
            			}
            		};
            		event_data = ['<div class="hoverinfo"><strong>'+geo.properties.name+'</strong>'].concat(event_data);
            		event_data = event_data.concat('</div>');
                	return event_data.join('');
            	}
        	}
            /* ,
            done: function(datamap) {
                  datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                      //var m = {};
                      //m[geography.id] = '#000000';
                      //datamap.updateChoropleth(m);

                  });
            }  */
    });
    // map.legend();

    function addLegendBox(layer, data, options) {
        data = data || {};
        if ( !this.options.fills ) {
          return;
        }

        var html = '<dl>';
        var label = '';
        if ( data.legendTitle ) {
          html = '<h4>' + data.legendTitle + '</h4>' + html;
        }

        for ( var fillKey in this.options.fills ) {

              if ( fillKey === 'defaultFill') {
                if (! data.defaultFillName ) {
                  continue;
                }
                label = data.defaultFillName;
              } else {
                if (data.labels && data.labels[fillKey]) {
                  label = data.labels[fillKey];
                } else {

                // Changed: //
            label= '' + fillKey;
            html += '<dd style="background-color:' +  this.options.fills[fillKey] + '">&nbsp;</dd>';
            html += '<dt>' + label + '</dt>'+ '<br><br>';

                }
              }
        }
        html += '</dl>';

        var hoverover = d3.select( this.options.element ).append('div')
          .attr('class', 'datamaps-legend')
          .html(html);
    }


    //Show Legend 
    map.addPlugin("mylegend", addLegendBox);
    map.mylegend({legendTitle:"Legend"})




    });
}

