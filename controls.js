var curr_country = "USA";
var curr_year = 2007;
var curr_obj = null;
var curr_obj1 = null;
var slider = null;
$(function () {
	// body...
	change_country(curr_country, curr_year);
	function valueOutput(element) {
        var value = element.value,
            output = element.parentNode.getElementsByTagName('output')[0];
        output.innerHTML = value;
        console.log("New Value", value);
    }
	$(".chosen-select").chosen().change(function(e){
		console.log(e.target.value);
		$('#container').html("");
		curr_country = e.target.value;
		change_country(curr_country, curr_year);
	});
	slider = $('[data-rangeslider]').rangeslider({

        // Deactivate the feature detection
        polyfill: false,

        // Callback function
        onSlide: function(position, value) {
            console.log('onSlideEnd');
            console.log('position: ' + position, 'value: ' + value);
    		curr_year = value;
    		if(map_obj != null && data_obj != null && 0){
                console.log("Updating exiting map for: ", curr_country, "Map Obj: ", map_obj);
                console.log("Current Data Object: ", data_obj);
                map_obj.updateChoropleth(data_obj[curr_year]);
            }
            else{
                $('#container').html("");
                console.log("Creating new map for: ", curr_country, "Map Obj: ", map_obj);
                change_country(curr_country,curr_year);
            }
    		curr_obj = $(this);
    		curr_obj1 = this;
    		console.log("Current Object: ", $(this));
    		valueOutput(this.$element[0]);
        }
    });
    curr_year = 2007;
    slider.val(curr_year).change(); // Update slider to current year.
    var intervalId = null;
    intervalId = window.setInterval(function() {
        if (curr_year > curr_obj1.max) {window.clearInterval(intervalId)};
        slider.val(curr_year+1).change();
        console.log("Updating year to: "+curr_year);
    }, 30000);
});