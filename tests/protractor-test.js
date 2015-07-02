describe('GSA Challenge Demo App', function() {

	var dashboard = require('../tests/protractor-dashboard.js');

	beforeEach(function() {
		dashboard.loadPage();
	});

	it('should have the correct page title', function() {
		expect(dashboard.getTitle()).toEqual('U.S. Food and Drug Administration Recalls');
	});

	it('should be able to add/remove several states by clicking state buttons', function() {
		dashboard.clickStateOnMap('VA');
		dashboard.clickStateOnMap('TX');
		dashboard.clickStateOnMap('MD');
		var states = dashboard.getHighlightedStates();

		expect(states.count()).toEqual(3);
		expect(states.first().getText()).toMatch('MARYLAND');
		expect(states.last().getText()).toMatch('VIRGINIA');

		dashboard.clickStateOnMap('MD');
		dashboard.clickStateOnMap('VA');
		states = dashboard.getHighlightedStates();

		expect(states.count()).toEqual(1);
		expect(states.first().getText()).toMatch('TEXAS');
	});

	it('should be able to remove a state from the map by clicking the state button above the detail table', function() {
		dashboard.clickStateOnMap('VA');
		dashboard.clickStateOnMap('TX');
		dashboard.clickStateOnMap('MD');
		var states = dashboard.getHighlightedStates();

		expect(states.count()).toEqual(3);
		expect(states.first().getText()).toMatch('MARYLAND');
		expect(states.last().getText()).toMatch('VIRGINIA');

		dashboard.clickStateButton('Maryland');
		dashboard.clickStateButton('Virginia');
		states = dashboard.getHighlightedStates();

		expect(states.count()).toEqual(1);
		expect(states.first().getText()).toMatch('TEXAS');
	});

	it('should be able to search using the search form', function() {
		var input = element(by.model('searchParams.recallingFirm'));
		var checkbox = element(by.model('searchParams.eventTypeDevice'));
		var detailTableCounts = dashboard.getDetailTableCounts();

		input.sendKeys('safeway');
		checkbox.click();

		expect(detailTableCounts.getText()).toEqual('Showing 1 to 8 of 8 entries');
	});

	it('clicking the Clear Filters button should clear the form elements and the selected states', function() {
		var input = element(by.model('searchParams.recallingFirm'));
		var checkbox = element(by.model('searchParams.eventTypeDevice'));
		var states = dashboard.getHighlightedStates();
		var detailTableCounts = dashboard.getDetailTableCounts();

		input.sendKeys('safeway');
		checkbox.click();
		dashboard.clickStateOnMap('VA');

		expect(input.getAttribute('value')).toEqual('safeway');
		expect(checkbox.getAttribute('checked')).toBe(null);
		expect(detailTableCounts.getText()).toEqual('Showing 1 to 6 of 6 entries');
		expect(states.count()).toEqual(1);

		dashboard.clickClearFiltersButton();

		expect(input.getAttribute('value')).toEqual('');
		expect(checkbox.getAttribute('checked')).toBe('true');
		expect(detailTableCounts.getText()).not.toEqual('Showing 1 to 6 of 6 entries');
		expect(states.count()).toEqual(0);
	});

	it('should be able to save a search', function() {
		var randomString = dashboard.getRandomString(10);

		element(by.partialButtonText('Save & Share this Search')).click();
		element(by.id('saveSearchName')).sendKeys(randomString);
		element(by.buttonText('Save')).click();

		var name = element(by.binding('savedSearch.name'));

		expect(name.getText()).toEqual(randomString);
	});

});
