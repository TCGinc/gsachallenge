app.directive("heatmap", function(utilityService) {

	// Configuration settings for heatmap color bands.
	// See available options in public/js/external/colorbrewer.js
	var colorbrewerConfig = {
		palette: "PuBu",
		numberOfBands: 9 // Allowable number of color bands are 3-9.
	};

	// Highlight fill color when a state on the map has been selected.
	var highlightFillColor = '#d12212'

	// Generate map fills based on number of bands.
	var fillKeys = [];
	var fills = {};
	for (var i = 0; i < colorbrewerConfig.numberOfBands; i++) {
		fillKeys.push("band " + i);
		fills["band " + i] = colorbrewer[colorbrewerConfig.palette][colorbrewerConfig.numberOfBands][i];
	}
	fills["highlighted"] = highlightFillColor;
	var getFillKey;

	// Intitialize default fill values for each state.
	var stateFillData = {};
	angular.forEach(utilityService.stateNames, function(stateAbbr, name) {
		stateFillData[stateAbbr.toUpperCase()] = {
			fillKey: "",
			numberOfEvents: 0
		};
	});

	return {
		restrict: "E",
		template: '<div></div>',
		link: function(scope, element, attrs) {

			// Initialize heatmap.
			var map = new Datamap({
				element: element.children("div")[0],
				scope: 'usa',
        		responsive: true,
        		fills: fills,
			    geographyConfig: {
					borderWidth: 1,
	        		borderColor: 'rgba(0,0,0,.5)',
			        popupTemplate: function(geo, data) {
			            return ['<div class="hoverinfo"><strong>',
			                    'Number of events in ' + geo.properties.name,
			                    ': ' + data.numberOfEvents,
			                    '</strong></div>'].join('');
					},
			        highlightFillColor: highlightFillColor,
			        highlightBorderColor: 'rgba(0,0,0,0)',
			        highlightBorderWidth: 1
		        },
		        done: function(datamap) {
		            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {

			        	var stateAbbr = utilityService.stateNames[geography.properties.name];

			        	// Push or pop the clicked state off the highlighted state list and make it stick
			        	// by coloring the fill on mouseout.
			        	var index = $.inArray(stateAbbr, scope[attrs.highlightedStates]);
						if (index == -1) {
							scope[attrs.highlightedStates].push(stateAbbr);
							$(this).on("mouseout", function() { 
								$(this).css("fill", fills["highlighted"]);
			            	});
						}
						else {
							scope[attrs.highlightedStates].splice(index, 1);
							$(this).on("mouseout", function() {
								$(this).css("fill", fills[getFillKey(stateFillData[stateAbbr.toUpperCase()].numberOfEvents)]);
			            	});
						}

						// Update map colors to show the hightlight change.
		            	if (Object.keys(scope[attrs.stateCounts]).length > 0) {
							updateMap(scope[attrs.stateCounts], scope[attrs.highlightedStates]);
						}

						// Fire off the click-map-callback.
		                scope[attrs.clickMapCallback](utilityService.stateNames[geography.properties.name]);
		            });
		        },
		        data: stateFillData
			});

			map.labels();

			// Resize heatmap when window size changes.
      		window.addEventListener('resize', function(event){
        		map.resize();
      		});

			// Ensure map is correct size at page load.
			setTimeout(function() {	map.resize(); }, 1000);

      		// Refresh the heatmap colors based on the new state counts.
      		function updateMap(stateCounts, highlightedStates) {

				// Calculate the domain of the state counts.
				var counts = d3.values(stateCounts);
				var countDomain = [d3.min(counts), d3.max(counts)];

				// Create lookup function used to calculate what heatmap band a state should be assigned to.
				getFillKey = d3.scale.quantize().domain(countDomain).range(fillKeys);

				angular.forEach(stateCounts, function(count, stateAbbr) {

					var fillKeyValue = "band 0";
					if ($.inArray(stateAbbr, highlightedStates) > -1) {
						fillKeyValue = "highlighted";
					}
					else if (count > 0) {
						fillKeyValue = getFillKey(count);
					}

					stateFillData[stateAbbr.toUpperCase()] = {
						fillKey: fillKeyValue,
						numberOfEvents: count
					};

				});

				map.updateChoropleth(stateFillData);
			}

			// Update map after state-count attribute value is changed.
			scope.$watch(attrs.stateCounts, function(stateCounts) {
				if (Object.keys(stateCounts).length > 0) {
					updateMap(stateCounts, scope[attrs.highlightedStates]);
				}
			});

		}
    }
});

