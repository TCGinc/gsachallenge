'use strict';

module.exports = {

	loadPage: function() {
		browser.get('http://localhost/');
	},

	// Return the title of the page.
	getTitle: function() {
		return browser.getTitle();
	},

	// Click a state on the heatmap.
	clickStateOnMap: function(state) {
		return element(by.css('path.' + state)).click();
	},

	// Click a state button above details table.
	clickStateButton: function(state) {
		return element(by.partialButtonText(state.toLowerCase())).click();
	},

	// Get the list of states currently highlighted on the heatmap.
	getHighlightedStates: function() {
		return element.all(by.repeater('state in highlightedStates'));
	},

	// Get detail table counts
	getDetailTableCounts: function() {
		return element(by.id('DataTables_Table_0_info'));
	},

	// Click the clear filters button.
	clickClearFiltersButton: function() {
		return element(by.buttonText('Clear Filters')).click();
	},

	// Generate a random string.
	getRandomString: function (characterLength) {
		var randomText = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for (var i = 0; i < characterLength; i++)
			randomText += possible.charAt(Math.floor(Math.random() * possible.length));
		return randomText;
	}
};
