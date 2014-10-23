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
        onInit: function() {
        	valueOutput(this.$element[0]);
        	window.setTimeout(function() {}, 60000);
        },

        // Callback function
        onSlideEnd: function(position, value) {
            console.log('onSlideEnd');
            console.log('position: ' + position, 'value: ' + value);
            $('#container').html("");
    		curr_year = value;
    		change_country(curr_country, curr_year);
    		curr_obj = $(this);
    		curr_obj1 = this;
    		console.log("Current Object: ", $(this));
    		valueOutput(this.$element[0]);
        }
    });
});