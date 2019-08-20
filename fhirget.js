'use strict';
//Copyright 2018 Tim Coates
//
//Licensed under the Apache License, Version 2.0 (the "License");
//you may not use this file except in compliance with the License.
//You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
//Unless required by applicable law or agreed to in writing, software
//distributed under the License is distributed on an "AS IS" BASIS,
//WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//See the License for the specific language governing permissions and
//limitations under the License.

var AWS = require("aws-sdk");
var docClient = null;
var tblName = null;
var utility = require("./utility.js");
var mime = "application/json";

module.exports = {
	entrypoint: entrypoint
};

/**
    Function to do a READ, NB thisonly handles GET with an ID, i.e.:
    /fhir/Patient/{patID}
 */
function entrypoint(event, context, callback) {

	context.callbackWaitsForEmptyEventLoop = false;
    console.log("Event: ", JSON.stringify(event));

    mime = utility.getMimeType(event);

	var NHSNumber = null;

	// Check we've got the necessary parameters...
	if ('pathParameters' in event) {
		if ('patID' in event.pathParameters) {
			// Here optionally we could do some more validation
			// e.g. check it's 10 digits long, check all numeric, check checkdigit?

			NHSNumber = event.pathParameters.patID;
		}
	}

	var response = "404 - Resource with ID (NHS Number) of " + NHSNumber + " not found";

	var reply = {
		statusCode: 404,
		headers: { "Content-Type": "text/plain" },
		body: response
	};


	if (NHSNumber == null) {
		console.log("No NHS Number was provided");
	} else {
		console.log("NHS Number: " + NHSNumber + " was provided");
		if (docClient == null) {
			docClient = new AWS.DynamoDB.DocumentClient();
		}
		tblName = "prod-pds-data";

		var params = {
			TableName: tblName,
			Key: { "nhs_number": NHSNumber }
		};
		console.log("Params: " + JSON.stringify(params));

		docClient.get(params, function (err, data) {
			if (err) {
				console.log("Error getting record: " + JSON.stringify(err));
			} else {
				console.log("Got: " + JSON.stringify(data));
				if ('Item' in data) {
                    console.log("Data item found was: " + JSON.stringify(data.Item));
					response = utility.makePatient(data.Item, mime);
					console.log("Response JSON object: " + response);

					reply = {
						statusCode: 200,
						headers: { "Content-Type": "application/json" },
						body: response
					};
				}
			}
			callback(null, reply);
		});
	}
}