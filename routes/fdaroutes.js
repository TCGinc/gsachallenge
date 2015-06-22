'use strict';

var moment = require('moment');

module.exports = function (app) {

	var FdaService = require('../services/FdaService')();


	app.get('/fda/counts', function (req, res) {

		var searchParams = {};
		var errors = [];

		searchParams.nouns = [];
		if(req.query.includeFood === 'true') {
			searchParams.nouns.push('food');
		}
		if(req.query.includeDrugs === 'true') {
			searchParams.nouns.push('drug');
		}
		if(req.query.includeDevices === 'true') {
			searchParams.nouns.push('device');
		}

		// Validate fromDate param
		if(req.query.fromDate) {
			// Ensure YYYY-MM-DD format
			// Regex from http://www.regular-expressions.info/dates.html
			if(!/^(19|20)\d\d-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/.test(req.query.fromDate)) {
				errors.push('Invalid fromDate.')
			}
			else {
				searchParams.fromDate = moment(req.query.fromDate, 'YYYY-MM-DD').toDate();
			}
		}
		else {
			// Default to far past date
			searchParams.fromDate = moment('1900-01-01', 'YYYY-MM-DD').toDate();
		}

		// Validate toDate param
		if(req.query.toDate) {
			// Ensure YYYY-MM-DD format
			if(!/^(19|20)\d\d-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/.test(req.query.toDate)) {
				errors.push('Invalid toDate.')
			}
			else {
				searchParams.toDate = moment(req.query.toDate, 'YYYY-MM-DD').toDate();
			}
		}
		else {
			// Default to far future date
			searchParams.toDate = moment('3000-01-01', 'YYYY-MM-DD').toDate();
		}


		if(errors.length === 0) {
			FdaService.getStateRecallCountsLocal(searchParams, function getStateRecallCountsCallback(err, result) {
				if(err) {
					console.error(err);
					console.error(err.stack);
					res.json({
						result: null,
						status: {
							error: true,
							message: err.message
						}
					});
				}
				else {
					res.json({
						result: result,
						status: {
							error: false
						}
					});
				}
			});
		}
		else {
			res.json({
				result: null,
				status: {
					error: true,
					message: errors.join("; ")
				}
			});
		}
	});

};
