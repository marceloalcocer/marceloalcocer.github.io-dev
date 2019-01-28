/**
 * sunfleet.js
 * 
 * Toggle cheapest pro-rata Sunfleet rental graph
 * 
 * @author: Marcelo alcocer
 * 
 */

// Module namepace
var sunfleet= {
		
	// Module init
	init : function(){
		
		// Update graph on car/time change
		function updateGraph(changeEvent){
			var car = document.getElementById("car").value;
			document.getElementById("graph").src = "_static/img/sunfleet_" + car + ".png";
		}
		document.getElementById("car").addEventListener( "change", updateGraph, false);

	}
	
}
sunfleet.init();
